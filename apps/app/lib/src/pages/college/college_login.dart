import 'package:app/src/components/Form/login_form.dart';
import 'package:app/src/components/Login/login_page_image.dart';
import 'package:app/src/components/Form/login_top_bar.dart'; // Import your LoginTopBar component
import 'package:flutter/material.dart';

class CollegeLoginScreen extends StatefulWidget {
  const CollegeLoginScreen({super.key});

  @override
  State<CollegeLoginScreen> createState() => _CollegeLoginScreenState();
}

class _CollegeLoginScreenState extends State<CollegeLoginScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("College Login Screen"),
      ),
      body: Container(
        color: Colors.lightBlue[50], // Suitable background color to match royal blue image
        padding: const EdgeInsets.all(16.0),
        child: SingleChildScrollView(
          child: Column(
            children: [
              const LoginTopBar(), // Add the LoginTopBar here
              const SizedBox(height: 20), // Add spacing
              Row(
                crossAxisAlignment: CrossAxisAlignment.start, // Aligns the content to the top
                children: [
                  // Left side - Form
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.center, // Center content in column
                      children: const [
                        SizedBox(height: 30), // Add space before the form
                        LoginForm(), // The login form on the left now
                      ],
                    ),
                  ),
                  const SizedBox(width: 40), // Space between form and image
                  
                  // Right side - Image and text
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.center, // Center content in column
                      children: [
                        const Text(
                          "Welcome to", // "Welcome to" above the image
                          style: TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.w600,
                            color: Colors.black87,
                          ),
                        ),
                        const SizedBox(height: 10),
                        const LoginPageImage(), // Image here
                        const SizedBox(height: 10),
                        Text(
                          "PlaceNext", // "PlaceNext" in decorative style
                          style: TextStyle(
                            fontSize: 28,
                            fontWeight: FontWeight.bold,
                            color: Colors.black87,
                            fontFamily: 'Cursive', // Decorative font style
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 80), // Extra spacing after the row
            ],
          ),
        ),
      ),
    );
  }
}
