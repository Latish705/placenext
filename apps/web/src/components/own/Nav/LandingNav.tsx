"use client";

import Link from "next/link";
import LogoText from "../LogoText";
import NavOptions from "./NavSubComponents/NavOptions";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import useThemeStore from "@/store/store";
//light theme
import { MdDarkMode } from "react-icons/md";
//dark theme
import { MdOutlineDarkMode } from "react-icons/md";
import ToggleTheme from "../ThemeToggle";

export default function LandingNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 w-full z-50 px-4 lg:px-8 py-1 transition-all duration-300 ease-in-out ${
        isScrolled
          ? "bg-white/80 dark:bg-gray-900/80 shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <LogoText />
        </div>

        {/* Navigation options */}

        <div className="flex flex-row gap-8">
          <div className="hidden lg:flex items-center space-x-6">
            <NavOptions />
          </div>

          {/* Login/Register Buttons for large screens */}
          <div className="hidden lg:flex items-center space-x-3">
            <div className=" ">
              <ToggleTheme
                style={
                  "border-[1px] border-black dark:border-white hover:bg-gray-100 dark:hover:bg-gray-700 px-4 py-2"
                }
              />
            </div>

            <Link href="/authentication/studentLogin">
              <Button className="bg-white dark:bg-gray-800 text-black dark:text-white border-[1px] border-black dark:border-white hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2">
                <span>Student Login</span>
              </Button>
            </Link>
            <Link href="/authentication/facultyLogin">
              <Button className="bg-white dark:bg-gray-800 text-black dark:text-white border-[1px] border-black dark:border-white hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2">
                <span>Faculty Login</span>
              </Button>
            </Link>
            <Link href="/authentication/companyLogin">
              <Button className="bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 w-10/12 px-4 py-2">
                Company Login
              </Button>
            </Link>
          </div>
        </div>
        {/* Mobile Menu Icon */}
        <div className="lg:hidden flex flex-row items-center justify-center gap-2">
          <div className=" ">
            <ToggleTheme
              style={
                "border-[1px] border-black dark:border-white hover:bg-gray-100 dark:hover:bg-gray-700"
              }
            />
          </div>
          <Button
            className=" border-[1px] border-black dark:border-white
               hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Menu"
          >
            {menuOpen ? <HiX size={28} /> : <HiMenu size={28} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu for smaller screens */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden absolute top-full left-0 w-full bg-white dark:bg-gray-900 shadow-lg flex flex-col items-center py-6 space-y-4"
          >
            <NavOptions />
            <Link href="/authentication/studentLogin">
              <Button className="bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 w-10/12 px-4 py-2">
                Student Login
              </Button>
            </Link>
            <Link href="/authentication/facultyLogin">
              <Button className="bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 w-10/12 px-4 py-2">
                Faculty Login
              </Button>
            </Link>
            <Link href="/authentication/companyLogin">
              <Button className="bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 w-10/12 px-4 py-2">
                Company Login
              </Button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
