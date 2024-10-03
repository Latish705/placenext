import "package:app/src/pages/college/college_dashboard.dart";
import "package:app/src/pages/student/application_form.dart";
import "package:app/src/pages/student/student_dashboard_screen.dart";
import "package:flutter/material.dart";

import "src/components/OnBoarding/on_boarding_screen.dart";
import "src/pages/student/login_screen.dart";
import "src/themes/navigation_theme_data.dart";

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      theme: ThemeData(bottomNavigationBarTheme: NavigationThemeData.theme),
      debugShowCheckedModeBanner: false,
      initialRoute: "/student_application_form",
      routes: {
        "/": (context) => const OnBoardingScreen(),
        // student routes
        "/student_login": (context) => const LoginScreen(),
        "/student_register": (context) => const OnBoardingScreen(),
        "/student_dashboard": (context) => const StudentDashboardScreen(),
        "/student_profile": (context) => const OnBoardingScreen(),
        "/student_application_form": (context) => const ApplicationForm(),
        // college routes
        "/college_login": (context) => const OnBoardingScreen(),
        "/college_register": (context) => const OnBoardingScreen(),
        "/college_dashboard": (context) => const CollegeDashboard(),
        // company routes
        "/company_login": (context) => const OnBoardingScreen(),
        "/company_register": (context) => const OnBoardingScreen(),
        "/company_dashboard": (context) => const OnBoardingScreen(),
      },
    );
  }
}
