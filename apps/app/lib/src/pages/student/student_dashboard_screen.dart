import 'package:flutter/material.dart';
import 'package:app/src/components/Dashboard/student/overview_component.dart';
import 'package:app/src/components/Dashboard/student/student_sidebar.dart'; // Import the Sidebar component

class StudentDashboardScreen extends StatefulWidget {
  const StudentDashboardScreen({super.key});

  @override
  State<StudentDashboardScreen> createState() => _StudentDashboardScreenState();
}

class _StudentDashboardScreenState extends State<StudentDashboardScreen> {
  // Define the currently selected index for the BottomNavigationBar
  int _selectedIndex = 0;

  // List of widgets for each tab's content
  static const List<Widget> _pages = <Widget>[
    OverviewComponent(),
    Center(child: Text("Search Screen")),
    Center(child: Text("Profile Screen")),
  ];

  // Function to handle the selection of tabs
  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Student Dashboard"),
        // Add a menu button to open the sidebar
        leading: Builder(
          builder: (context) => IconButton(
            icon: const Icon(Icons.menu),
            onPressed: () {
              Scaffold.of(context).openDrawer(); // Open the sidebar drawer
            },
          ),
        ),
      ),
      drawer: Sidebar(), // Removed 'const' from here
      // Show the content based on the selected index
      body: _pages[_selectedIndex],
      bottomNavigationBar: BottomNavigationBar(
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: "Home",
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.search),
            label: "Search",
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person),
            label: "Profile",
          ),
        ],
        currentIndex: _selectedIndex, // Set the currently selected tab
        onTap: _onItemTapped, // Update the index when a tab is tapped
      ),
    );
  }
}
