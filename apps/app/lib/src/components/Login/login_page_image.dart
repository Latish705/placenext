import 'package:flutter/material.dart';

class LoginPageImage extends StatelessWidget {
  const LoginPageImage({super.key});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        Container(
          height: 150,
          width: 150,
          decoration: const BoxDecoration(
            image: DecorationImage(
              image: AssetImage("assets/images/PlaceNext_logo.png"),
              fit: BoxFit.contain,
              scale: 0.5,
            ),
          ),
        ),
        const SizedBox(width: 20), // Add space between the image and text
      ],
    );
  }
}
