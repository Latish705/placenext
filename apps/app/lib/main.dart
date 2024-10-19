import 'package:app/firebase_options.dart';  // Firebase options for the platform
import 'package:app/presentation/splash/pages/splash.dart';  // Path to your SplashPage
import 'package:app/presentation/auth/pages/google_sign_in_page.dart';  // Google Sign-In page
import 'package:app/presentation/dashboard/pages/home.dart';  // Student Dashboard
import 'package:app/service_locator.dart';  // Dependency injection setup
import 'package:firebase_auth/firebase_auth.dart';  // Firebase Authentication package
import 'package:firebase_core/firebase_core.dart';  // Firebase package
import 'package:flutter/material.dart';  // Flutter's core package

Future<void> main() async {
  // Ensures the Flutter engine is initialized before Firebase
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize Firebase
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );

  // Initialize other dependencies (Uncomment this when needed)
  // await initializeDependencies();

  // Run the app
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,  // Remove the debug banner
      home: AuthGate(),  // Authentication gate to decide which page to show
      theme: ThemeData(
        appBarTheme: const AppBarTheme(
          backgroundColor: Color(0xFFEDF3FF),  // Adjusted color for better visibility
        ),
      ),
    );
  }
}

// AuthGate widget to decide if user is signed in or not
class AuthGate extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return StreamBuilder<User?>(
      stream: FirebaseAuth.instance.authStateChanges(),  // Listen to authentication state
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          // While Firebase checks for authentication state, show splash screen
          return const SplashPage();
        } else if (snapshot.hasData) {
          // If the user is signed in, navigate to the dashboard
          return const StudentDashboard();
        } else {
          // If the user is not signed in, show Google Sign-In page
          return SignInPage();
        }
      },
    );
  }
}
