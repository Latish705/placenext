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
    <div className="flex flex-row items-center justify-between w-full px-2 pl-10 py-2 relative z-20 bg-white dark:bg-dark_main_background">
      <div className="flex flex-row items-center justify-center gap-2 lg:ml-[200px]">
        <h1 className="text-lg font-bold">{getDashboardTitle()}</h1>
      </div>

      <div className="flex flex-row justify-center items-center gap-2 relative">
        <ToggleTheme style="hover:border-light_primary_background border-2" />
        <div className="hover:border-light_primary_background border-2 p-2 rounded-md">
          <IoIosNotifications size={20} />
        </div>

        {/* Avatar + Dropdown */}
        <div className="relative">
          <div
            onClick={toggleDropdown}
            className="cursor-pointer hover:border-light_primary_background border-2 p-2 rounded-full"
          >
            <Avatar>
              <AvatarImage src="" alt="User Avatar" />
              <AvatarFallback>{userInitials || "U"}</AvatarFallback>
            </Avatar>
          </div>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 dark:bg-dark_main_background bg-white border rounded-lg shadow-lg z-50">
              <ul className="py-1 flex flex-col items-start">
                <li>
                  <Button
                    className="px-4 py-2 dark:text-white hover:text-light_primary_background dark:hover:text-light_primary_background w-full"
                    onClick={() => router.push("/student/profile")}
                    variant="text"
                  >
                    Profile
                  </Button>
                </li>
                <li>
                  <Button
                    className="px-4 py-2 dark:text-white hover:text-light_primary_background dark:hover:text-light_primary_background w-full"
                    onClick={() => router.push("/student/settings")}
                    variant="text"
                  >
                    Settings
                  </Button>
                </li>
                <li>
                  <Button
                    className="px-4 py-2 text-red-300 hover:text-red-500 w-full"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
