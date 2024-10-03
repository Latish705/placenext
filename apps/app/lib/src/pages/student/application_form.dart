import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';

class ApplicationForm extends StatefulWidget {
  const ApplicationForm({super.key});

  @override
  State<ApplicationForm> createState() => _ApplicationFormState();
}

class _ApplicationFormState extends State<ApplicationForm> {
  int _currentStep = 0;
  final _formKey = GlobalKey<FormState>();

  // Form Data
  final Map<String, String> formData = {
    "firstName": "",
    "middleName": "",
    "lastName": "",
    "gender": "",
    "fatherName": "",
    "motherName": "",
    "rollNumber": "",
    "division": "",
    "dateOfBirth": "",
    "email": "",
    "alternateEmail": "",
    "aadharNumber": "",
    "phoneNumber": "",
    "alternatePhoneNo": "",
    "panNumber": "",
    "address": "",
    "state": "",
    "country": "",
    "pincode": "",
    "courseType": "",
    "admissionYear": "",
    "departmentName": "",
    "tenthPercentage": "",
    "hscBoard": "",
    "twelfthPercentage": "",
    "sscBoard": "",
    "cet": "",
    "sem1CGPI": "",
    "sem2CGPI": "",
    "sem3CGPI": "",
    "sem4CGPI": "",
    "sem5CGPI": "",
    "sem6CGPI": "",
    "sem7CGPI": "",
    "sem8CGPI": "",
    "college": ""
  };

  // To store the uploaded files
  Map<String, PlatformFile?> documents = {
    "sem1Marksheet": null,
    "sem2Marksheet": null,
    "sem3Marksheet": null,
    "sem4Marksheet": null,
    "sem5Marksheet": null,
    "sem6Marksheet": null,
    "sem7Marksheet": null,
    "sem8Marksheet": null,
  };

  // Function to pick a file for a particular field
  Future<void> _pickFile(String key) async {
    FilePickerResult? result = await FilePicker.platform.pickFiles();
    if (result != null) {
      setState(() {
        documents[key] = result.files.first;
      });
    }
  }

  // To navigate steps
  void _nextStep() {
    if (_currentStep < 3) {
      setState(() => _currentStep += 1);
    }
  }

  void _previousStep() {
    if (_currentStep > 0) {
      setState(() => _currentStep -= 1);
    }
  }

  void _submitForm() {
    if (_formKey.currentState?.validate() ?? false) {
      _formKey.currentState?.save();
      // Handle form submission logic, e.g., API call
      print(formData);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Application Form'),
      ),
      body: Stepper(
        currentStep: _currentStep,
        onStepContinue: _currentStep == 3 ? _submitForm : _nextStep,
        onStepCancel: _currentStep == 0 ? null : _previousStep,
        steps: [
          // Step 1: Personal Details
          Step(
            title: const Text('Personal Details'),
            content: Form(
              key: _formKey,
              child: Column(
                children: [
                  TextFormField(
                    decoration: const InputDecoration(labelText: 'First Name'),
                    onSaved: (value) => formData['firstName'] = value ?? '',
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter your first name';
                      }
                      return null;
                    },
                  ),
                  TextFormField(
                    decoration: const InputDecoration(labelText: 'Middle Name'),
                    onSaved: (value) => formData['middleName'] = value ?? '',
                  ),
                  TextFormField(
                    decoration: const InputDecoration(labelText: 'Last Name'),
                    onSaved: (value) => formData['lastName'] = value ?? '',
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter your last name';
                      }
                      return null;
                    },
                  ),
                  TextFormField(
                    decoration: const InputDecoration(labelText: 'Father Name'),
                    onSaved: (value) => formData['fatherName'] = value ?? '',
                  ),
                  TextFormField(
                    decoration: const InputDecoration(labelText: 'Mother Name'),
                    onSaved: (value) => formData['motherName'] = value ?? '',
                  ),
                  TextFormField(
                    decoration: const InputDecoration(labelText: 'Gender'),
                    onSaved: (value) => formData['gender'] = value ?? '',
                  ),
                ],
              ),
            ),
            isActive: _currentStep >= 0,
          ),

          // Step 2: Contact Details
          Step(
            title: const Text('Contact Details'),
            content: Column(
              children: [
                TextFormField(
                  decoration: const InputDecoration(labelText: 'Email'),
                  onSaved: (value) => formData['email'] = value ?? '',
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please enter your email';
                    }
                    return null;
                  },
                ),
                TextFormField(
                  decoration: const InputDecoration(labelText: 'Phone Number'),
                  onSaved: (value) => formData['phoneNumber'] = value ?? '',
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please enter your phone number';
                    }
                    return null;
                  },
                ),
                TextFormField(
                  decoration: const InputDecoration(labelText: 'Address'),
                  onSaved: (value) => formData['address'] = value ?? '',
                ),
                TextFormField(
                  decoration: const InputDecoration(labelText: 'State'),
                  onSaved: (value) => formData['state'] = value ?? '',
                ),
                TextFormField(
                  decoration: const InputDecoration(labelText: 'Country'),
                  onSaved: (value) => formData['country'] = value ?? '',
                ),
                TextFormField(
                  decoration: const InputDecoration(labelText: 'Pincode'),
                  onSaved: (value) => formData['pincode'] = value ?? '',
                ),
              ],
            ),
            isActive: _currentStep >= 1,
          ),

          // Step 3: Academic Details
          Step(
            title: const Text('Academic Details'),
            content: Column(
              children: [
                TextFormField(
                  decoration: const InputDecoration(labelText: 'College'),
                  onSaved: (value) => formData['college'] = value ?? '',
                ),
                TextFormField(
                  decoration:
                      const InputDecoration(labelText: 'Semester 1 CGPI'),
                  onSaved: (value) => formData['sem1CGPI'] = value ?? '',
                ),
                TextFormField(
                  decoration:
                      const InputDecoration(labelText: 'Semester 2 CGPI'),
                  onSaved: (value) => formData['sem2CGPI'] = value ?? '',
                ),
                // Add other semesters as needed
              ],
            ),
            isActive: _currentStep >= 2,
          ),

          // Step 4: Upload Documents
          Step(
            title: const Text('Upload Documents'),
            content: Column(
              children: documents.keys.map((key) {
                return ListTile(
                  title: Text(key),
                  subtitle: Text(documents[key]?.name ?? 'No file selected'),
                  trailing: IconButton(
                    icon: const Icon(Icons.upload_file),
                    onPressed: () => _pickFile(key),
                  ),
                );
              }).toList(),
            ),
            isActive: _currentStep >= 3,
          ),
        ],
      ),
    );
  }
}
