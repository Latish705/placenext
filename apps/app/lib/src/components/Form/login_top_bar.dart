import 'package:flutter/material.dart';

class LoginTopBar extends StatelessWidget {
  const LoginTopBar({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16.0), // Add some horizontal padding
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly, // Bring buttons closer
            children: [
              TextButton(
                onPressed: () {
                  Navigator.pushNamed(context, "/company_login");
                },
                child: const Text("Company Login"),
              ),
              TextButton(
                onPressed: () {
                  Navigator.pushNamed(context, "/student_login");
                },
                child: const Text("Student Login"),
              ),
              TextButton(
                onPressed: () {
                  Navigator.pushNamed(context, "/college_login");
                },
                child: const Text("College Login"),
              ),
            ],
          ),
        ),
        const Divider( // Decorative line beneath the top bar
          color: Colors.grey, // You can change the color if needed
          thickness: 2, // Adjust the thickness for a bold or subtle effect
          height: 20, // Space between the row and the line
        ),
      ],
    );
  }
}
