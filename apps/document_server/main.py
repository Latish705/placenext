import os
import threading
import io
import base64
import tempfile
import requests
import logging
from fastapi import FastAPI, HTTPException, BackgroundTasks, status
from pydantic import BaseModel, Field
from pymongo import MongoClient
from PyPDF2 import PdfReader
from googleapiclient.discovery import build
from google.oauth2.service_account import Credentials
from googleapiclient.http import MediaIoBaseDownload
from dotenv import load_dotenv
from bson.objectid import ObjectId
from contextlib import asynccontextmanager

# --- Basic Setup ---
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')


# --- LANGCHAIN INTEGRATION START ---
api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    raise ValueError("GOOGLE_API_KEY environment variable not set.")

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

prompt = ChatPromptTemplate.from_template(
    """You are an automated document verification assistant. Your task is to verify if the 'Extracted Text from Document' contains ALL of the specific 'Information from Database'.

Respond with ONLY the word 'MATCHED' if all of the information from the database is clearly present in the document text.
Respond with ONLY the word 'NOT MATCHED' otherwise.

---
Information from Database:
- Student Name: {student_name}
- Semester Grade (SGPI): {sgpi}

Extracted Text from Document:
{document_text}
---
"""
)
model = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0, api_key=api_key)
verification_chain = prompt | model | StrOutputParser()
# --- LANGCHAIN INTEGRATION END ---


# --- Global Variables & App State ---
app_state = {}

def create_service_account_file() -> str:
    service_account_base64 = os.getenv("GOOGLE_SERVICE_ACCOUNT_JSON_BASE64")
    if not service_account_base64:
        logging.error("GOOGLE_SERVICE_ACCOUNT_JSON_BASE64 environment variable not set.")
        raise ValueError("Base64 encoded service account key is missing.")
    
    try:
        service_account_json = base64.b64decode(service_account_base64)
        with tempfile.NamedTemporaryFile(delete=False, suffix=".json", mode='w') as temp_file:
            temp_file.write(service_account_json.decode('utf-8'))
            return temp_file.name
    except Exception as e:
        logging.error(f"Failed to decode or write service account key: {e}")
        raise

# --- FastAPI Lifespan Events (Startup/Shutdown) ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    logging.info("Application starting up...")
    
    mongo_uri = os.getenv("MONGO_URI")
    database_name = os.getenv("DATABASE_NAME")
    if not mongo_uri or not database_name:
        raise ValueError("MONGO_URI and DATABASE_NAME must be set in the environment.")
    
    app_state["mongo_client"] = MongoClient(mongo_uri)
    app_state["db"] = app_state["mongo_client"][database_name]
    app_state["student_collection"] = app_state["db"]["students"]
    app_state["stud_info_collection"] = app_state["db"]["studentinfos"]
    logging.info("MongoDB connection established.")

    try:
        service_account_file = create_service_account_file()
        creds = Credentials.from_service_account_file(
            service_account_file, scopes=["https://www.googleapis.com/auth/drive.readonly"]
        )
        app_state["drive_service"] = build("drive", "v3", credentials=creds)
        os.remove(service_account_file)
        logging.info("Google Drive service initialized successfully.")
    except Exception as e:
        logging.error(f"Failed to initialize Google Drive service: {e}")
        raise RuntimeError(f"Could not initialize Google Drive service: {e}") from e

    yield

    logging.info("Application shutting down...")
    app_state["mongo_client"].close()
    logging.info("MongoDB connection closed.")


app = FastAPI(title="Document Verification Service", lifespan=lifespan)


# --- Core Verification Logic ---
def perform_verification(user_id: ObjectId):
    student_collection = app_state["student_collection"]
    stud_info_collection = app_state["stud_info_collection"]
    drive_service = app_state["drive_service"]
    
    try:
        user_data = student_collection.find_one({"_id": user_id})
        if not user_data:
            logging.error(f"User with ID {user_id} not found in the database.")
            return
        
        student_name = user_data.get("stud_name")
        stud_info_id_str = user_data.get("stud_info_id")
        if not stud_info_id_str:
            # ... error handling
            return

        stud_info = stud_info_collection.find_one({"_id": ObjectId(stud_info_id_str)})
        if not stud_info:
            # ... error handling
            return

        marksheets = [stud_info.get(f'stud_sem{i + 1}_marksheet') for i in range(8)]
        failed_semesters = []
        any_marksheet_found = False

        for i, pdf_url in enumerate(marksheets):
            semester = i + 1
            if not pdf_url:
                continue
            
            any_marksheet_found = True
            try:
                file_id = pdf_url.split('/d/')[1].split('/')[0]
                request = drive_service.files().get_media(fileId=file_id)

                pdf_stream = io.BytesIO()
                downloader = MediaIoBaseDownload(pdf_stream, request)
                done = False
                while not done:
                    _, done = downloader.next_chunk()
                pdf_stream.seek(0)

                reader = PdfReader(pdf_stream)
                extracted_text = "".join(page.extract_text() or "" for page in reader.pages)
                sgpi_value = stud_info.get(f'stud_sem{semester}_grade')

                if sgpi_value and student_name:
                    
                    # --- ADDED: Detailed LLM I/O Logging ---
                    input_data = {
                        "student_name": student_name,
                        "sgpi": sgpi_value,
                        "document_text": extracted_text
                    }
                    
                    # Log the exact data being sent to the LLM
                    logging.info(
                        f"\n--- Sending data to LLM for User: {user_id}, Semester: {semester} ---\n"
                        f"{prompt.format(**input_data)}\n"
                        f"--------------------------------------------------------------------\n"
                    )

                    # Call the LangChain model
                    response = verification_chain.invoke(input_data)

                    # Log the exact raw data received from the LLM
                    logging.info(
                        f"\n--- Received response from LLM for User: {user_id}, Semester: {semester} ---\n"
                        f"Raw Response: '{response}'\n"
                        f"------------------------------------------------------------------------\n"
                    )
                    # --- END of Detailed Logging ---

                    # Check the model's clean response
                    if response.strip().upper() == 'MATCHED':
                        logging.info(f"Successfully verified semester {semester} for user {user_id} via LLM.")
                    else:
                        failed_semesters.append(semester)
                        logging.warning(f"LLM validation failed for semester {semester} for user {user_id}.")
                else:
                    failed_semesters.append(semester)
                    logging.warning(f"Skipping verification for semester {semester}: Missing SGPI or student name in database.")

            except Exception as e:
                failed_semesters.append(semester)
                logging.error(f"Error processing marksheet for user {user_id}, semester {semester}: {e}")
                continue
        
        if not any_marksheet_found:
             student_collection.update_one(
                {"_id": user_id},
                {"$set": {"verificationStatus": "FAILED", "verificationDetails": "No marksheets found to verify."}}
            )
             response_message = 'Verification failed: No marksheets were found.'
        elif not failed_semesters:
            student_collection.update_one(
                {"_id": user_id},
                {"$set": {"isSystemVerified": True, "verificationStatus": "VERIFIED"}}
            )
            response_message = 'Verification successful.'
        else:
            details = f'Verification failed for semesters: {failed_semesters}'
            student_collection.update_one(
                {"_id": user_id},
                {"$set": {"isSystemVerified": False, "verificationStatus": "FAILED", "verificationDetails": details}}
            )
            response_message = details

        # send_notification(user_data.get('stud_email'), user_id, response_message)

    except Exception as e:
        logging.error(f"An unexpected error occurred during verification for user {user_id}: {e}")
        student_collection.update_one(
            {"_id": user_id},
            {"$set": {"verificationStatus": "FAILED", "verificationDetails": "An unexpected system error occurred."}}
        )

# --- Other functions and endpoints (send_notification, verify_user_endpoint, etc.) remain unchanged ---

def send_notification(user_email: str, user_id: ObjectId, message: str):
    notification_url = os.getenv('NOTIFICATION_SERVICE_URL')
    if not notification_url:
        logging.warning("NOTIFICATION_SERVICE_URL not set. Skipping notification.")
        return

    payload = {"userId": str(user_id), "message": message, "email": user_email}
    try:
        response = requests.post(f"{notification_url}/notifications/send_notification", json=payload, timeout=10)
        response.raise_for_status()
        logging.info(f"Notification sent for user {user_id}. Status: {response.status_code}")
    except requests.exceptions.RequestException as e:
        logging.error(f"Failed to send notification for user {user_id}: {e}")

class VerifyRequest(BaseModel):
    userId: str

@app.post('/verify_user')
def verify_user_endpoint(request: VerifyRequest, background_tasks: BackgroundTasks):
    try:
        user_id = ObjectId(request.userId)
    except Exception:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Invalid userId format')

    student_collection = app_state["student_collection"]
    user_doc = student_collection.find_one_and_update(
        {"_id": user_id, "verificationStatus": {"$ne": "PROCESSING"}},
        {"$set": {"verificationStatus": "PROCESSING"}}
    )
    if not user_doc:
        existing_user = student_collection.find_one({"_id": user_id})
        if not existing_user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='User not found')
        else:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail='User verification is already in progress')

    background_tasks.add_task(perform_verification, user_id)
    return {"success": True, "message": f"User {user_id} has been queued for verification."}

def convert_mongo_document(doc):
    if isinstance(doc, dict):
        return {k: convert_mongo_document(v) for k, v in doc.items()}
    if isinstance(doc, list):
        return [convert_mongo_document(i) for i in doc]
    if isinstance(doc, ObjectId):
        return str(doc)
    return doc

@app.get('/test_db_connection')
def test_endpoint():
    try:
        student_collection = app_state["student_collection"]
        users = student_collection.find().limit(5)
        users_list = [convert_mongo_document(user) for user in users]
        return {"message": "Connection successful", "users_sample": users_list}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database connection test failed: {e}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)