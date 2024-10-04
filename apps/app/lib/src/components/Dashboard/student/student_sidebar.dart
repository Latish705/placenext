import 'package:flutter/material.dart';
import 'package:app/src/components/Login/login_page_image.dart';

class Sidebar extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: ListView(
        padding: EdgeInsets.zero,
        children: <Widget>[
          DrawerHeader(
            decoration: const BoxDecoration(
              color: Colors.blue,
            ),
            child: Column(
              children: [
                const Text(
                  'Placenext',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 24,
                  ),
                ),
                SizedBox(
                  width: 80,
                  height: 80,
                  child: const LoginPageImage(),
                ),
                const SizedBox(height: 10),
              ],
            ),
          ),
          ListTile(
            leading: const Icon(Icons.home),
            title: const Text('Dashboard'),
            onTap: () {
              Navigator.pop(context); // Close the drawer
              // Navigate to dashboard screen (if needed)
            },
          ),
          ListTile(
            leading: const Icon(Icons.person),
            title: const Text('Apply for Jobs'),
            onTap: () {
              Navigator.pop(context); // Close the drawer
              Navigator.pushNamed(context, "/student_apply_job"); // Navigate to Apply for Jobs
            },
          ),
          ListTile(
            leading: const Icon(Icons.message),
            title: const Text('Messages'),
            onTap: () {
              Navigator.pop(context); // Close the drawer
              Navigator.pushNamed(context, "/messages"); // Navigate to Messages
            },
          ),
          ListTile(
            leading: const Icon(Icons.person),
            title: const Text('Profile'),
            onTap: () {
              Navigator.pop(context); // Close the drawer
              Navigator.pushNamed(context, "/student_profile"); // Navigate to Profile
            },
          ),
          ListTile(
            leading: const Icon(Icons.settings),
            title: const Text('Settings'),
            onTap: () {
              Navigator.pop(context); // Close the drawer
              Navigator.pushNamed(context, "/settings"); // Navigate to Settings
            },
          ),
          ListTile(
            leading: const Icon(Icons.logout),
            title: const Text('Logout'),
            onTap: () {
              Navigator.pop(context); // Close the drawer
              // Implement logout functionality if needed
            },
          ),
        ],
      ),
    );
  }
}
