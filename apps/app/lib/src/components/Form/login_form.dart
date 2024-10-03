import 'package:flutter/material.dart';

class LoginForm extends StatefulWidget {
  const LoginForm({super.key});

  @override
  State<LoginForm> createState() => _LoginFormState();
}

class _LoginFormState extends State<LoginForm> {
  final TextEditingController _usernameController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  @override
  void dispose() {
    _usernameController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16.0), // Add padding around the form
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            "Username",
            style: TextStyle(fontSize: 16),
          ),
          const SizedBox(height: 8), // Space between label and TextField
          TextField(
            controller: _usernameController,
            decoration: const InputDecoration(
              border: OutlineInputBorder(),
              hintText: "Enter your username",
              prefixIcon: Icon(Icons.person), // Icon for the username
            ),
          ),
          const SizedBox(height: 16), // Space between fields
          const Text(
            "Password",
            style: TextStyle(fontSize: 16),
          ),
          const SizedBox(height: 8), // Space between label and TextField
          TextField(
            controller: _passwordController,
            decoration: const InputDecoration(
              border: OutlineInputBorder(),
              hintText: "Enter your password",
              prefixIcon: Icon(Icons.lock), // Icon for the password
            ),
            obscureText: true, // Hide password text
          ),
          const SizedBox(height: 20), // Space before the buttons
          ElevatedButton(
            onPressed: () {
              // Handle login logic here

              // Add your login logic
              Navigator.pushNamed(context, '/college_dashboard');
            },
            child: const Text("Login"),
          ),
          const SizedBox(height: 10), // Space between buttons
          ElevatedButton.icon(
            onPressed: () {
              // Handle Google login logic here
            },
            icon: const Icon(
                Icons.golf_course), // Replace with appropriate Google icon
            label: const Text("Login with Google"),

            style: ElevatedButton.styleFrom(
                // primary: Colors.red, // Color for the Google button
                // onPrimary: Colors.white, // Text color
                ),
          ),
        ],
      ),
    );
  }
}
