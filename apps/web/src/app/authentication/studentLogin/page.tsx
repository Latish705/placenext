"use client";
import LoginForm from "@/components/own/Form/LoginFrom";
import Image from "next/image";
import useThemeStore from "@/store/store";
import LogoText from "@/components/own/LogoText";
import Link from "next/link";
import { motion } from "framer-motion";

export default function StudentLogin() {
  const { darkMode } = useThemeStore() as { darkMode: boolean };
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row w-full bg-gray-50 dark:bg-gray-900">
      {/* Header with Logo */}
      <div className="fixed top-6 left-6 z-10">
        <Link href="/" className="flex items-center gap-2 group">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <LogoText />
          </motion.div>
        </Link>
      </div>
      
      {/* Login Form Section */}
      <motion.div 
        className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 lg:p-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </motion.div>
      
      {/* Image Section */}
      <motion.div 
        className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-700 dark:to-indigo-900 h-screen items-center justify-center overflow-hidden relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Decorative circles */}
        <div className="absolute w-96 h-96 rounded-full bg-blue-400/20 dark:bg-blue-300/10 top-20 -right-20"></div>
        <div className="absolute w-72 h-72 rounded-full bg-indigo-400/20 dark:bg-indigo-300/10 bottom-20 -left-10"></div>
        
        <div className="relative z-10 px-12 max-w-lg">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mb-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Welcome back to PlaceNext</h2>
            <p className="text-blue-100 text-lg">Access your account to track applications, connect with recruiters, and find your dream opportunity.</p>
          </motion.div>
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="relative"
          >
            <Image
              src="/assets/Fingerprint-amico.svg"
              height={400}
              width={400}
              priority
              alt="Student login illustration"
              className="drop-shadow-lg"
            />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
