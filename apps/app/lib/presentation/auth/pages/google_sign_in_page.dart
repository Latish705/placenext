import 'package:app/presentation/auth/auth_service.dart'; // Import your AuthService
import 'package:flutter/material.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:app/presentation/dashboard/pages/home.dart'; // Your dashboard page
import 'package:app/common/helper/navigator/app_navigator.dart'; // Adjust the path if needed
class SignInPage extends StatefulWidget {
  @override
  _SignInPageState createState() => _SignInPageState();
}

class _SignInPageState extends State<SignInPage> {
  bool _isLoading = false; // Loading state

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Sign In'),
      ),
      body: Center(
        child: _isLoading 
          ? CircularProgressIndicator() // Show loading indicator
          : ElevatedButton(
              onPressed: () async {
                setState(() {
                  _isLoading = true; // Set loading to true
                });

                final authService = AuthService();
                final googleUser = await authService.signIn();

                setState(() {
                  _isLoading = false; // Set loading to false after sign-in attempt
                });

                if (googleUser != null) {
                  AppNavigator.pushAndReplacement(context, StudentDashboard());
                } else {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text('Sign-in failed, please try again.')),
                  );
                }
              },
              child: Text('Sign in with Google'),
            ),
      ),
    );
  }
}
