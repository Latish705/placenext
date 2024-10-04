import 'package:flutter/material.dart';
import 'package:http/http.dart' as http; // Add http package
import 'dart:convert'; // For JSON encoding

class CompanyRegistrationForm extends StatefulWidget {
  const CompanyRegistrationForm({super.key});

  @override
  State<CompanyRegistrationForm> createState() => _CompanyRegistrationFormState();
}

class _CompanyRegistrationFormState extends State<CompanyRegistrationForm> {
  int _currentStep = 0;
  final _step1FormKey = GlobalKey<FormState>();
  final _step2FormKey = GlobalKey<FormState>();

  // Form Data
  final Map<String, dynamic> formData = {
    "comp_name": "",
    "comp_start_date": "", // Date should be formatted correctly
    "comp_contact_person": "",
    "comp_email": "",
    "comp_industry": "",
    "com_positions_offered": [],
    "comp_address": "",
    "comp_jobs_offered": [],
    "comp_no_employs": 0,
    "comp_website": "",
    "comp_location": "",
    "comp_contact_no": "",
    "comp_departments": [],
    "comp_no_of_stud": 0,
    "comp_courses_offered": [],
  };

  // To navigate steps
  void _nextStep() {
    if (_currentStep < 1) {
      setState(() => _currentStep += 1);
    }
  }

  void _previousStep() {
    if (_currentStep > 0) {
      setState(() => _currentStep -= 1);
    }
  }

  void _submitForm() async {
    // Validate both steps
    final step1IsValid = _step1FormKey.currentState?.validate() ?? false;
    final step2IsValid = _step2FormKey.currentState?.validate() ?? false;

    if (step1IsValid && step2IsValid) {
      _step1FormKey.currentState?.save();
      _step2FormKey.currentState?.save();

      // Handle form submission logic, e.g., API call
      final response = await http.post(
        Uri.parse('YOUR_API_ENDPOINT'), // Replace with your API endpoint
        headers: {'Content-Type': 'application/json'},
        body: json.encode(formData),
      );

      // Show success or failure message
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(response.statusCode == 200
              ? 'Company registered successfully!'
              : 'Failed to register the company: ${response.body}'),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Company Registration Form'),
      ),
      body: Stepper(
        currentStep: _currentStep,
        onStepContinue: _currentStep == 1 ? _submitForm : _nextStep,
        onStepCancel: _currentStep == 0 ? null : _previousStep,
        steps: [
          // Step 1: Company Details
          Step(
            title: const Text('Company Details'),
            content: Form(
              key: _step1FormKey,
              child: Column(
                children: [
                  TextFormField(
                    decoration: const InputDecoration(labelText: 'Company Name'),
                    onSaved: (value) => formData['comp_name'] = value ?? '',
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter the company name';
                      }
                      return null;
                    },
                  ),
                  TextFormField(
                    decoration: const InputDecoration(labelText: 'Owner Name'),
                    onSaved: (value) => formData['comp_contact_person'] = value ?? '',
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter the owner name';
                      }
                      return null;
                    },
                  ),
                  TextFormField(
                    decoration: const InputDecoration(labelText: 'Email'),
                    onSaved: (value) => formData['comp_email'] = value ?? '',
                    validator: (value) {
                      if (value == null || value.isEmpty || !value.contains('@')) {
                        return 'Please enter a valid email';
                      }
                      return null;
                    },
                  ),
                  TextFormField(
                    decoration: const InputDecoration(labelText: 'Phone'),
                    onSaved: (value) => formData['comp_contact_no'] = value ?? '',
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter a phone number';
                      }
                      return null;
                    },
                  ),
                  TextFormField(
                    decoration: const InputDecoration(labelText: 'Website'),
                    onSaved: (value) => formData['comp_website'] = value ?? '',
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter a website URL';
                      }
                      return null;
                    },
                  ),
                  TextFormField(
                    decoration: const InputDecoration(labelText: 'Industry'),
                    onSaved: (value) => formData['comp_industry'] = value ?? '',
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter the industry';
                      }
                      return null;
                    },
                  ),
                  TextFormField(
                    decoration: const InputDecoration(labelText: 'Number of Employees'),
                    keyboardType: TextInputType.number,
                    onSaved: (value) => formData['comp_no_employs'] = int.tryParse(value ?? '') ?? 0,
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter the number of employees';
                      }
                      return null;
                    },
                  ),
                ],
              ),
            ),
          ),
          // Step 2: Address Details
          Step(
            title: const Text('Address Details'),
            content: Form(
              key: _step2FormKey,
              child: Column(
                children: [
                  TextFormField(
                    decoration: const InputDecoration(labelText: 'Address'),
                    onSaved: (value) => formData['comp_address'] = value ?? '',
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter an address';
                      }
                      return null;
                    },
                  ),
                  TextFormField(
                    decoration: const InputDecoration(labelText: 'Location'),
                    onSaved: (value) => formData['comp_location'] = value ?? '',
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter the location';
                      }
                      return null;
                    },
                  ),
                  TextFormField(
                    decoration: const InputDecoration(labelText: 'Number of Students'),
                    keyboardType: TextInputType.number,
                    onSaved: (value) => formData['comp_no_of_stud'] = int.tryParse(value ?? '') ?? 0,
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter the number of students';
                      }
                      return null;
                    },
                  ),
                  TextFormField(
                    decoration: const InputDecoration(labelText: 'Courses Offered'),
                    onSaved: (value) {
                      // Split the input into a list
                      formData['comp_courses_offered'] = value?.split(',').map((e) => e.trim()).toList() ?? [];
                    },
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter the courses offered';
                      }
                      return null;
                    },
                  ),
                  // Add more fields as needed
                ],
              ),
            ),
          ),
        ],
      ),
      floatingActionButton: _currentStep == 1 // Show submit button only on the last step
          ? FloatingActionButton.extended(
              onPressed: _submitForm,
              label: const Text('Submit'),
              icon: const Icon(Icons.check),
            )
          : null,
    );
  }
}
