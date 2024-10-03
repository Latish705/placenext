import 'package:flutter/material.dart';

class NavigationThemeData {
  // Function that returns the bottom navigation theme
  static BottomNavigationBarThemeData get theme {
    return const BottomNavigationBarThemeData(
      backgroundColor: Color.fromRGBO(12, 12, 12, 0),
      selectedItemColor: Colors.blue,
      unselectedItemColor: Colors.grey,
      elevation: 5.0,
    );
  }
}
