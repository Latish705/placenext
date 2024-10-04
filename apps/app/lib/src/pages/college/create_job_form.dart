import 'package:flutter/material.dart';

class JobForm extends StatefulWidget {
  const JobForm({Key? key}) : super(key: key);

  @override
  State<JobForm> createState() => _JobFormState();
}

class _JobFormState extends State<JobForm> {
  final _formKey = GlobalKey<FormState>();
  int _currentStep = 0;

  // Form Data
  final Map<String, dynamic> formData = {
    "jobTitle": "",
    "jobType": "",
    "jobLocation": "",
    "jobSalary": "",
    "jobDescription": "",
    "jobRequirements": [],
    "jobPostedDate": DateTime.now(),
    "yrOfExpReq": "",
    "jobTiming": "",
    "status": "",
    "college": "",
  };

  // To handle requirements input
  final TextEditingController _requirementsController = TextEditingController();

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
        title: const Text('Create Job'),
      ),
      body: Stepper(
        currentStep: _currentStep,
        onStepContinue: _currentStep == 3 ? _submitForm : _nextStep,
        onStepCancel: _currentStep == 0 ? null : _previousStep,
        steps: [
          // Step 1: Job Details
          Step(
            title: const Text('Job Details'),
            content: Form(
              key: _formKey,
              child: Column(
                children: [
                  TextFormField(
                    decoration: const InputDecoration(labelText: 'Job Title'),
                    onSaved: (value) => formData['jobTitle'] = value ?? '',
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter job title';
                      }
                      return null;
                    },
                  ),
                  TextFormField(
                    decoration: const InputDecoration(labelText: 'Job Type'),
                    onSaved: (value) => formData['jobType'] = value ?? '',
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter job type';
                      }
                      return null;
                    },
                  ),
                  TextFormField(
                    decoration: const InputDecoration(labelText: 'Job Location'),
                    onSaved: (value) => formData['jobLocation'] = value ?? '',
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter job location';
                      }
                      return null;
                    },
                  ),
                  TextFormField(
                    decoration: const InputDecoration(labelText: 'Job Salary'),
                    keyboardType: TextInputType.number,
                    onSaved: (value) => formData['jobSalary'] = double.tryParse(value ?? '') ?? 0,
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter job salary';
                      }
                      return null;
                    },
                  ),
                  TextFormField(
                    decoration: const InputDecoration(labelText: 'Job Description'),
                    maxLines: 3,
                    onSaved: (value) => formData['jobDescription'] = value ?? '',
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter job description';
                      }
                      return null;
                    },
                  ),
                ],
              ),
            ),
            isActive: _currentStep >= 0,
          ),

          // Step 2: Job Requirements
          Step(
            title: const Text('Job Requirements'),
            content: Column(
              children: [
                TextFormField(
                  controller: _requirementsController,
                  decoration: const InputDecoration(labelText: 'Add Job Requirement'),
                ),
                ElevatedButton(
                  onPressed: () {
                    if (_requirementsController.text.isNotEmpty) {
                      setState(() {
                        formData['jobRequirements'].add(_requirementsController.text);
                        _requirementsController.clear();
                      });
                    }
                  },
                  child: const Text('Add Requirement'),
                ),
                const SizedBox(height: 10),
                ...formData['jobRequirements'].map<Widget>((requirement) {
                  return ListTile(
                    title: Text(requirement),
                    trailing: IconButton(
                      icon: const Icon(Icons.delete),
                      onPressed: () {
                        setState(() {
                          formData['jobRequirements'].remove(requirement);
                        });
                      },
                    ),
                  );
                }).toList(),
              ],
            ),
            isActive: _currentStep >= 1,
          ),

          // Step 3: Additional Details
          Step(
            title: const Text('Additional Details'),
            content: Column(
              children: [
                TextFormField(
                  decoration: const InputDecoration(labelText: 'Years of Experience Required'),
                  keyboardType: TextInputType.number,
                  onSaved: (value) => formData['yrOfExpReq'] = int.tryParse(value ?? '') ?? 0,
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please enter years of experience required';
                    }
                    return null;
                  },
                ),
                TextFormField(
                  decoration: const InputDecoration(labelText: 'Job Timing'),
                  onSaved: (value) => formData['jobTiming'] = value ?? '',
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please enter job timing';
                    }
                    return null;
                  },
                ),
                TextFormField(
                  decoration: const InputDecoration(labelText: 'Status'),
                  onSaved: (value) => formData['status'] = value ?? '',
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please enter job status';
                    }
                    return null;
                  },
                ),
                TextFormField(
                  decoration: const InputDecoration(labelText: 'College ID'),
                  onSaved: (value) => formData['college'] = value ?? '',
                ),
              ],
            ),
            isActive: _currentStep >= 2,
          ),
        ],
      ),
    );
  }
}
