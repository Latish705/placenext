import os
from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from pymongo import MongoClient
from PyPDF2 import PdfReader
from googleapiclient.discovery import build
from google.oauth2.service_account import Credentials
from googleapiclient.http import MediaIoBaseDownload
from dotenv import load_dotenv
import threading
import io
import base64
import tempfile
import requests
from bson import ObjectId 

load_dotenv()

# MongoDB setup
MONGO_URI = os.getenv('MONGO_URI')
DATABASE_NAME = os.getenv('DATABASE_NAME')
client = MongoClient(MONGO_URI)
db = client[DATABASE_NAME]
student_collection = db['students']
stud_info_collection = db['studentinfos']

# Google Drive API setup with Service Account
SCOPES = ['https://www.googleapis.com/auth/drive.readonly']

# List to keep track of processing user IDs
processing_users = []
lock = threading.Lock()  # To manage access to the processing list

def create_service_account_file():
    # Get the base64-encoded service account JSON from environment variables
    service_account_base64 = os.getenv('GOOGLE_SERVICE_ACCOUNT_JSON_BASE64')

    if not service_account_base64:
        raise ValueError("Base64 encoded service account key is missing.")

    # Decode the base64 string and create a temporary JSON file
    service_account_json = base64.b64decode(service_account_base64)
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".json")
    temp_file.write(service_account_json)
    temp_file.flush()

    return temp_file.name  # Return the path to the temporary file

def get_drive_service():
    # Create the service account file from the base64-encoded string
    service_account_json_path = create_service_account_file()
    
    if not os.path.exists(service_account_json_path):
        raise FileNotFoundError(f"Service account file not found: {service_account_json_path}")
    
    creds = Credentials.from_service_account_file(service_account_json_path)
    drive_service = build('drive', 'v3', credentials=creds)
    
    return drive_service

@api_view(['POST'])
def verify_user(request):
    user_id = request.data.get('userId')

    # Convert userId to ObjectId
    try:
        user_id = ObjectId(user_id)
    except Exception as e:
        return Response({'message': 'Invalid user ID format'}, status=400)

    with lock:  # Locking to ensure thread safety
        if user_id in processing_users:
            return Response({'message': 'User is already being processed'}, status=400)
        
        processing_users.append(user_id)

    # Perform verification in a background thread
    threading.Thread(target=perform_verification, args=(user_id,), daemon=True).start()

    return Response({'success': True, 'message': f'User with Id: {user_id} added to queue for verification'}, status=200)

def perform_verification(user_id):
    verification_success = False  # Track if verification is successful
    failed_semesters = []  # To track which semester's verification failed

    try:
        # Fetch the user data from MongoDB
        user_data = student_collection.find_one({'_id': user_id})
        if not user_data:
            print(f"User with ID {user_id} not found in the database.")
            return

        stud_info_id = user_data.get('stud_info_id')
        if not stud_info_id:
            print(f"User info not found for user: {user_id}")
            return

        # Fetch the student info document
        stud_info = stud_info_collection.find_one({'_id': ObjectId(stud_info_id)})
        if not stud_info:
            print(f"Student info document not found for stud_info_id: {stud_info_id}")
            return

        # Retrieve the list of marksheets from the student info document
        marksheets = [stud_info.get(f'stud_sem{i + 1}_marksheet') for i in range(8)]
        verification_results = []

        # Iterate through each marksheet URL with index
        for i, pdf_url in enumerate(marksheets):
            if not pdf_url:  # Skip if the URL is None
                continue

            try:
                drive_service = get_drive_service()
                file_id = pdf_url.split('/')[-2]  # Extract file ID from URL
                request = drive_service.files().get_media(fileId=file_id)

                # Use an in-memory buffer to download the PDF
                pdf_stream = io.BytesIO()
                downloader = MediaIoBaseDownload(pdf_stream, request)
                done = False
                while not done:
                    status, done = downloader.next_chunk()

                pdf_stream.seek(0)  # Reset buffer position

                # Extract text from the PDF
                reader = PdfReader(pdf_stream)
                extracted_text = ""
                for page in reader.pages:
                    extracted_text += page.extract_text() or ""

                # Dynamic SGPI check
                sgpi_value = stud_info.get(f'stud_sem{i + 1}_grade')

                if sgpi_value and f"SGPI: {sgpi_value}" in extracted_text:
                    verification_success = True
                else:
                    failed_semesters.append(i + 1)
                    print(f"Validation failed for semester {i + 1}: SGPI value {sgpi_value} not found in marksheet text.")

            except Exception as e:
                failed_semesters.append(i + 1)
                print(f"Error processing marksheet for semester {i + 1}: {e}")
                continue  

        # Determine final verification status
        if verification_success:
            print(f"Verification successful for user: {user_id}")
            student_collection.update_one({'_id': user_id}, {'$set': {'isSystemVerified': True}})
            response_message = 'Verification successful'
        else:
            print(f"Verification failed for user: {user_id}, failed semesters: {failed_semesters}")
            response_message = f'Verification failed for semesters: {failed_semesters}'
            
            send_notification(user_data['stud_email'], response_message)  

        return Response({'message': response_message})
    finally:
        with lock:
            processing_users.remove(user_id)

def send_notification(user_email, message):
    notification_url = f"{os.getenv('NOTIFICATION_SERVICE_URL')}/notifications/send_notification"
    payload = {
        "userId": user_email,
        "message": message
    }
    try:
        response = requests.post(notification_url, json=payload)
        print(f"Notification response: {response.status_code} - {response.json()}")
    except Exception as e:
        print(f"Failed to send notification: {e}")

def convert_objectid(data):
    if isinstance(data, dict):
        return {k: convert_objectid(v) for k, v in data.items()}
    elif isinstance(data, list):
        return [convert_objectid(i) for i in data]
    elif isinstance(data, ObjectId):
        return str(data)
    else:
        return data

@api_view(['GET'])
def test(request):
    # Fetch all users from the MongoDB collection
    users = student_collection.find()
    users_list = [convert_objectid(user) for user in users]
    return Response({'users': users_list})
