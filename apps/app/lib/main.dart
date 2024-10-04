import "package:app/src/pages/student/profile_page.dart";

import "src/pages/student/student_login.dart";
import "package:app/src/pages/college/college_dashboard.dart";
import "package:app/src/pages/college/college_login.dart";
import "package:app/src/pages/college/create_job_form.dart";

import "package:app/src/pages/student/application_form.dart";
import "package:app/src/pages/student/student_dashboard_screen.dart";

import "package:app/src/pages/company/company_register.dart";

import "package:flutter/material.dart";

import "src/components/OnBoarding/on_boarding_screen.dart";

import "src/themes/navigation_theme_data.dart";
import "package:app/src/pages/company/company_login.dart";

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
      initialRoute: "/student_profile",
      routes: {
        "/": (context) => const OnBoardingScreen(),
        // student routes
        "/student_login": (context) => const LoginScreen(),

        "/student_dashboard": (context) => const StudentDashboardScreen(),
        "/student_profile": (context) => ProfilePage(),
        "/student_application_form": (context) => const ApplicationForm(),
        // college routes
        "/college_login": (context) => const CollegeLoginScreen(),
        "/college_register": (context) => const OnBoardingScreen(),
        "/create_job": (context) => const JobForm(),
        "/college_dashboard": (context) => const CollegeDashboard(),
        // company routes
        "/company_login": (context) => const CompanyLoginScreen(),
        "/company_register": (context) => const CompanyRegistrationForm(),
        "/company_dashboard": (context) => const OnBoardingScreen(),
      },
    );
  }
}
