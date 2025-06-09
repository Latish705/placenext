"use client";

import { useEffect, useState } from "react";
import { IoIosNotifications } from "react-icons/io";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePathname } from "next/navigation";
import { getAuth } from "firebase/auth";
import { logout } from "@/config/firebase-config";
import { useRouter } from "next/navigation";
import { Button } from "@mui/material";
import ToggleTheme from "../ThemeToggle";

export default function MainNav() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  useEffect(() => {
    const getUserInitials = () => {
      const name = localStorage.getItem("name");
      console.log(name);
      if (name) {
        const initials = name
          .split(" ")
          .map((n, index) => {
            if (index === 1) return "";
            return n[0];
          })
          .join("");
        console.log(initials);
        setUserName(initials);
      }
    };
    getUserInitials();
    if (dropdownOpen) {
      document.addEventListener("click", toggleDropdown);
    }
    return () => {
      document.removeEventListener("click", toggleDropdown);
    };
  }, [dropdownOpen]);

  const pathname = usePathname();
  const path = pathname.split("/")[1];

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      logout();
      console.log("User signed out");
      if(path=='company'){
        router.push('/authentication/companyLogin')
      }else if (path === "college") {
        router.push("/authentication/facultyLogin");
      } else {
        router.push("/authentication/studentLogin");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className="flex flex-row items-center justify-between w-full px-2 pl-10 py-2 relative z-20 bg-white dark:bg-dark_main_background">
      <div className="flex flex-row items-center justify-center gap-2 lg:ml-[200px]">
        {path === "college" ? (
          <div>
            <h1 className="text-lg font-bold">TPO Dashboard</h1>
          </div>
        ) : path==='company' ? (<div>
            <h1 className="text-lg font-bold">Company Dashboard</h1>
          </div>) :(
          <div>
            <h1 className="text-lg font-bold">Student Dashboard</h1>
          </div>
        )}
      </div>
      <div className="flex flex-row justify-center items-center gap-2 relative">
        <ToggleTheme style=" hover:border-light_primary_background border-2 " />
        <div className="hover:border-light_primary_background border-2 p-2 rounded-md">
          <IoIosNotifications size={20} />
        </div>
        <div className="relative">
          {/* Avatar with Dropdown */}
          <div
            onClick={toggleDropdown}
            className="cursor-pointer hover:border-light_primary_background border-2 p-2 rounded-full"
          >
            <Avatar>
              <AvatarImage src="" alt="@shadcn" />
              <AvatarFallback className="select-none read-only-text">
                {userName}
              </AvatarFallback>
            </Avatar>
          </div>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 dark:bg-dark_main_background bg-white  border rounded-lg shadow-lg z-50">
              <ul className="py-1 flex flex-col items-start">
                <li>
                  <Button
                    className="px-4 py-2 dark:text-white  hover:text-light_primary_background 
                     dark:hover:text-light_primary_background cursor-pointer w-full"
                    onClick={() => router.push("/student/profile")}
                    variant="text"
                  >
                    Profile
                  </Button>
                </li>
                <li>
                  <Button
                    className="px-4 py-2 dark:text-white hover:text-light_primary_background dark:hover:text-light_primary_background cursor-pointer"
                    onClick={() => router.push("/student/settings")}
                    variant="text"
                  >
                    Settings
                  </Button>
                </li>
                <li>
                  <Button
                    className="px-4 py-2 text-red-300 hover:text-red-500  cursor-pointer"
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