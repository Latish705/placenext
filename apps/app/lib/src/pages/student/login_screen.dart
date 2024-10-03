import 'package:app/src/components/Form/login_form.dart';
import 'package:app/src/components/Login/login_page_image.dart';
import 'package:flutter/material.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: const Text("Login Screen"),
        ),
        body: const SingleChildScrollView(
          child: Column(
            children: [LoginPageImage(), SizedBox(height: 80), LoginForm()],
          ),
        ));
  }
}
