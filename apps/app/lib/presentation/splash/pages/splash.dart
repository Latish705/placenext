import 'package:animated_text_kit/animated_text_kit.dart';
import 'package:app/common/helper/navigator/app_navigator.dart';
import 'package:app/presentation/dashboard/pages/home.dart'; // Your dashboard page
import 'package:app/presentation/auth/pages/google_sign_in_page.dart';  // Google Sign-In page
import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart'; // Import Firebase Auth

class SplashPage extends StatelessWidget {
  const SplashPage({super.key});

  // Function to check the authentication state
  void _navigateBasedOnAuth(BuildContext context) {
    User? user = FirebaseAuth.instance.currentUser;

    if (user == null) {
      // If not authenticated, go to sign-in page
      AppNavigator.pushAndReplacement(context, SignInPage());
    } else {
      // If authenticated, go to dashboard
      AppNavigator.pushAndReplacement(context, StudentDashboard());
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(60.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Image.asset('assets/images/PlaceNext_logo.png'),
              const SizedBox(height: 10),
              AnimatedTextKit(
                animatedTexts: [
                  TyperAnimatedText(
                    'PlaceNext',
                    textStyle: const TextStyle(
                      fontSize: 32.0,
                      fontWeight: FontWeight.bold,
                      color: Colors.blueAccent,
                    ),
                    speed: const Duration(milliseconds: 150),
                  ),
                ],
                totalRepeatCount: 1,
                onFinished: () {
                  // Check authentication after the animation finishes
                  _navigateBasedOnAuth(context);
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
