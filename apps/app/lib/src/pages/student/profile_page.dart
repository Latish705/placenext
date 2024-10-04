import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:fluttertoast/fluttertoast.dart'; // Change here

class ProfilePage extends StatefulWidget {
  @override
  _ProfilePageState createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  Map<String, dynamic> profile = {
    'firstName': '',
    'middleName': '',
    'lastName': '',
    'gender': '',
    'fatherName': '',
    'motherName': '',
    'rollNumber': '',
    'division': '',
    'dateOfBirth': '',
    'email': '',
    'alternateEmail': '',
    'aadharNumber': '',
    'phoneNumber': '',
    'alternatePhoneNo': '',
    'panNumber': '',
    'address': '',
    'state': '',
    'country': '',
    'pincode': '',
    'courseType': '',
    'admissionYear': '',
    'departmentName': '',
    'tenthPercentage': '',
    'hscBoard': '',
    'twelfthPercentage': '',
    'sscBoard': '',
    'cet': '',
    'sem1CGPI': '',
    'sem2CGPI': '',
    'sem3CGPI': '',
    'sem4CGPI': '',
    'sem5CGPI': '',
    'sem6CGPI': '',
    'sem7CGPI': '',
    'sem8CGPI': '',
    'college': '',
  };

  bool isEditing = false;

  @override
  void initState() {
    super.initState();
    fetchProfileData();
  }

  Future<void> fetchProfileData() async {
    try {
      final response = await http.get(
        Uri.parse('YOUR_BACKEND_URL/api/student/get_user_details'),
        headers: {
          'Authorization': 'Bearer YOUR_TOKEN',
        },
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success']) {
          setState(() {
            // Map the response data to profile
            var student = data['student'];
            var studentInfo = student['stud_info_id'];
            var nameParts = student['stud_name'].split(" ");
            profile['firstName'] = nameParts[0];
            profile['middleName'] = nameParts.length == 3 ? nameParts[1] : '';
            profile['lastName'] = nameParts.last;
            profile['email'] = student['stud_email'];
            profile['dateOfBirth'] = student['stud_dob'];
            profile['phoneNumber'] = student['stud_phone'];
            profile['address'] = student['stud_address'];
            profile['courseType'] = student['stud_course'];
            profile['departmentName'] = student['stud_department'];
            profile['tenthPercentage'] = studentInfo['stud_ssc'];
            // Set other fields similarly
          });
        } else {
          Fluttertoast.showToast(
            msg: data['message'],
            toastLength: Toast.LENGTH_SHORT,
            gravity: ToastGravity.BOTTOM,
          );
        }
      } else {
        Fluttertoast.showToast(
          msg: "Failed to fetch profile data.",
          toastLength: Toast.LENGTH_SHORT,
          gravity: ToastGravity.BOTTOM,
        );
      }
    } catch (e) {
      Fluttertoast.showToast(
        msg: "Error: $e",
        toastLength: Toast.LENGTH_SHORT,
        gravity: ToastGravity.BOTTOM,
      );
    }
  }

  Future<void> updateProfileData() async {
    try {
      final response = await http.put(
        Uri.parse('YOUR_BACKEND_URL/api/student/get_user_details_update'),
        headers: {
          'Authorization': 'Bearer YOUR_TOKEN',
          'Content-Type': 'application/json',
        },
        body: json.encode(profile),
      );

      final data = json.decode(response.body);
      if (data['success']) {
        Fluttertoast.showToast(
          msg: "Profile updated successfully!",
          toastLength: Toast.LENGTH_SHORT,
          gravity: ToastGravity.BOTTOM,
        );
        setState(() {
          isEditing = false;
        });
      } else {
        Fluttertoast.showToast(
          msg: data['message'],
          toastLength: Toast.LENGTH_SHORT,
          gravity: ToastGravity.BOTTOM,
        );
      }
    } catch (e) {
      Fluttertoast.showToast(
        msg: "Failed to update profile.",
        toastLength: Toast.LENGTH_SHORT,
        gravity: ToastGravity.BOTTOM,
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Profile Section'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            Text(
              'Profile Section',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 20),
            Expanded(
              child: ListView(
                children: [
                  // Build form fields dynamically
                  ...profile.entries.map((entry) {
                    return Padding(
                      padding: const EdgeInsets.symmetric(vertical: 8.0),
                      child: isEditing
                          ? TextField(
                              onChanged: (value) {
                                setState(() {
                                  profile[entry.key] = value;
                                });
                              },
                              decoration: InputDecoration(
                                labelText: entry.key,
                                border: OutlineInputBorder(),
                                hintText: entry.value,
                              ),
                            )
                          : ListTile(
                              title: Text(entry.key),
                              subtitle: Text(entry.value.toString()),
                            ),
                    );
                  }).toList(),
                ],
              ),
            ),
            SizedBox(height: 20),
            ElevatedButton(
              onPressed: () {
                setState(() {
                  isEditing = !isEditing;
                  if (!isEditing) {
                    updateProfileData();
                  }
                });
              },
              child: Text(isEditing ? 'Save' : 'Edit Profile'),
            ),
          ],
        ),
      ),
    );
  }
}
