"use client";

import { useEffect, useState } from "react";
import { IoIosNotifications } from "react-icons/io";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePathname, useRouter } from "next/navigation";
import { getAuth } from "firebase/auth";
import { logout } from "@/config/firebase-config";
import { Button } from "@mui/material";
import ToggleTheme from "../ThemeToggle";
import firebase from "firebase/compat/app";
import { motion } from "framer-motion";

export default function MainNav() {
  const router = useRouter();
  const pathname = usePathname();
  const path = pathname.split("/")[1];

  const [userInitials, setUserInitials] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  // Get and set user initials from localStorage
  useEffect(() => {
    const name = localStorage.getItem("name")?.trim();
    if (name) {
      const initials = name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase();
      setUserInitials(initials);
    }

    // Clean up event listener
    if (dropdownOpen) {
      document.addEventListener("click", toggleDropdown);
    }
    return () => {
      document.removeEventListener("click", toggleDropdown);
    };
  }, [dropdownOpen]);

  const handleLogout = async () => {
    try {
      await firebase.auth().signOut();
      await logout();
      localStorage.clear();

      if (path === "company") {
        router.push("/authentication/companyLogin");
      } else if (path === "college") {
        router.push("/authentication/facultyLogin");
      } else {
        router.push("/authentication/studentLogin");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const getDashboardTitle = () => {
    if (path === "college") return "TPO Dashboard";
    if (path === "company") return "Company Dashboard";
    return "Student Dashboard";
  };

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex flex-row items-center justify-between w-full px-4 lg:px-6 py-3">
        {/* Dashboard Title */}
        <div className="flex flex-row items-center justify-center gap-2">
          <motion.h1 
            className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {getDashboardTitle()}
          </motion.h1>
        </div>

        {/* Right Side Controls */}
        <div className="flex flex-row justify-center items-center gap-3 relative">
          {/* Theme Toggle */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <ToggleTheme />
          </motion.div>

          {/* Notifications */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer relative"
          >
            <IoIosNotifications 
              size={24} 
              className="text-gray-600 dark:text-gray-300"
            />
            {/* Notification badge */}
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </motion.div>

          {/* User Avatar + Dropdown */}
          <div className="relative">
            <motion.div
              onClick={toggleDropdown}
              className="cursor-pointer p-1 rounded-full hover:ring-2 hover:ring-blue-500 hover:ring-offset-2 dark:hover:ring-offset-gray-800 transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Avatar className="w-10 h-10 border-2 border-gray-200 dark:border-gray-600">
                <AvatarImage src="" alt="User Avatar" />
                <AvatarFallback className="bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold">
                  {userInitials || "U"}
                </AvatarFallback>
              </Avatar>
            </motion.div>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 overflow-hidden"
              >
                <div className="py-1">
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {localStorage.getItem("name") || "User"}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {localStorage.getItem("email") || "user@example.com"}
                    </p>
                  </div>
                  
                  <Button
                    className="w-full justify-start px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                    onClick={() => {
                      router.push(`/${path}/profile`);
                      setDropdownOpen(false);
                    }}
                    variant="text"
                  >
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    View Profile
                  </Button>
                  
                  <Button
                    className="w-full justify-start px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                    onClick={() => {
                      router.push(`/${path}/settings`);
                      setDropdownOpen(false);
                    }}
                    variant="text"
                  >
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Settings
                  </Button>

                  <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                  
                  <Button
                    className="w-full justify-start px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                    onClick={() => {
                      handleLogout();
                      setDropdownOpen(false);
                    }}
                    variant="text"
                  >
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign out
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
