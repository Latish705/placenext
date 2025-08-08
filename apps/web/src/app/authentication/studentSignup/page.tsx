"use client";
import Image from "next/image";
import useThemeStore from "@/store/store";
import LogoText from "@/components/own/LogoText";
import SignUpFormStudent from "@/components/own/Form/SignupFormStudent";
import Link from "next/link";
import { motion } from "framer-motion";

export default function StudentRegister() {
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
      
      {/* Registration Form Section */}
      <motion.div 
        className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 lg:p-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="w-full max-w-md">
          <SignUpFormStudent />
        </div>
      </motion.div>
      
      {/* Image Section */}
      <motion.div 
        className="hidden md:flex md:w-1/2 bg-gradient-to-br from-green-500 to-emerald-600 dark:from-green-700 dark:to-emerald-900 h-screen items-center justify-center overflow-hidden relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Decorative circles */}
        <div className="absolute w-96 h-96 rounded-full bg-green-400/20 dark:bg-green-300/10 top-20 -right-20"></div>
        <div className="absolute w-72 h-72 rounded-full bg-emerald-400/20 dark:bg-emerald-300/10 bottom-20 -left-10"></div>
        
        <div className="relative z-10 px-12 max-w-lg">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mb-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Join PlaceNext Today</h2>
            <p className="text-green-100 text-lg">Create your account to discover amazing opportunities, connect with top recruiters, and launch your career.</p>
          </motion.div>
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="relative"
          >
            <Image
              src="/assets/Authentication-bro.svg"
              height={400}
              width={400}
              priority
              alt="Student registration illustration"
              className="drop-shadow-lg"
            />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
