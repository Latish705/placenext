"use client";

import Link from "next/link";
import LogoText from "../LogoText";
import NavOptions from "./NavSubComponents/NavOptions";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import useThemeStore from "@/store/store";
import ToggleTheme from "../ThemeToggle";

export default function LandingNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Close mobile menu when user resizes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && menuOpen) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [menuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out ${
        isScrolled
          ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-md"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <LogoText />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <NavOptions />
            
            <div className="flex items-center space-x-2">
              <ToggleTheme
                style="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              />
              
              <div className="flex items-center space-x-2">
                <Link href="/authentication/studentLogin">
                  <Button variant="outline" size="sm" className="font-medium text-sm px-4 py-2 transition-colors">
                    Student
                  </Button>
                </Link>
                <Link href="/authentication/facultyLogin">
                  <Button variant="outline" size="sm" className="font-medium text-sm px-4 py-2 transition-colors">
                    Faculty
                  </Button>
                </Link>
                <Link href="/authentication/companyLogin">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-4 py-2 rounded-md transition-colors">
                    Company Login
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Mobile Menu Controls */}
          <div className="lg:hidden flex items-center space-x-3">
            <ToggleTheme
              style="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            />
            <Button
              variant="ghost"
              size="icon"
              className="p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              {menuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800"
          >
            <div className="px-4 py-6 space-y-6">
              <NavOptions />
              
              <div className="grid grid-cols-1 gap-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                <Link href="/authentication/studentLogin" className="w-full">
                  <Button variant="outline" className="w-full justify-center text-base">
                    Student Login
                  </Button>
                </Link>
                <Link href="/authentication/facultyLogin" className="w-full">
                  <Button variant="outline" className="w-full justify-center text-base">
                    Faculty Login
                  </Button>
                </Link>
                <Link href="/authentication/companyLogin" className="w-full">
                  <Button className="w-full justify-center bg-blue-600 hover:bg-blue-700 text-white text-base">
                    Company Login
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
