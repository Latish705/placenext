"use client";

import { useEffect, useState } from "react";
import { ToastContainer, Bounce, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Inconsolata } from "next/font/google";
import { motion } from "framer-motion";

import Hero from "@/components/own/Landing/Hero";
import LandingNav from "@/components/own/Nav/LandingNav";
import Services from "@/components/own/Landing/Services";
import JoiningCard from "@/components/own/Landing/Card/JoiningCard";
import { InfiniteMovingCards } from "@/components/own/Landing/Card/InfiniteMovingCards";
import TeamSection from "@/components/own/Landing/TeamSection";
import BlueLandingText from "@/components/own/Landing/Text/BlueLandingText";
import useThemeStore from "../store/store";

type ThemeStore = {
  darkMode: boolean;
  // add other properties if needed
};

const inconsolata = Inconsolata({
  subsets: ["latin"],
  weight: ["400", "600", "800"],
});

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const { darkMode } = useThemeStore() as ThemeStore;
  
  useEffect(() => {
    setIsClient(true);
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  const notifyWelcome = () => {
    toast.success("Welcome to Placenext!", {
      position: "top-right",
      autoClose: 3000,
      theme: "colored",
    });
  };

  if (!isClient) {
    return null; // Prevent flash of unstyled content
  }

  return (
    <div className={`${inconsolata.className} bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-black min-h-screen transition-colors duration-300`}>
      <LandingNav />
      
      <main className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Hero Section with fade-in animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-24"
        >
          <Hero />
        </motion.div>
        
        {/* Services Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-24"
        >
          <Services />
        </motion.section>
        
        {/* Joining Card Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-24"
        >
          <JoiningCard />
        </motion.section>
        
        {/* Team Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-24"
        >
          <TeamSection />
        </motion.section>
        
        {/* Testimonials Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-24"
        >
          <div className="text-center mb-10">
            <BlueLandingText text="Testimonials" />
          </div>
          <div className="overflow-hidden">
            <InfiniteMovingCards
              direction="right"
              speed="slow"
              className="w-full"
            />
          </div>
        </motion.section>
        
        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-24 text-center"
        >
          <div className="max-w-3xl mx-auto py-12 px-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl shadow-sm">
            <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">Ready to get started?</h2>
            <p className="text-lg mb-8 text-gray-600 dark:text-gray-300">
              Join thousands of users finding their perfect career match with Placenext.
            </p>
            <button 
              onClick={notifyWelcome}
              className="px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200 font-medium"
            >
              Sign up now
            </button>
          </div>
        </motion.section>
      </main>
      
      {/* Footer */}
      <footer className="py-12 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Placenext</h3>
              <p className="text-gray-600 dark:text-gray-400">Find your perfect career match with our AI-powered platform.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Resources</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Blog</a></li>
                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Guides</a></li>
                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Company</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">About</a></li>
                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Careers</a></li>
                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Legal</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Privacy</a></li>
                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-gray-600 dark:text-gray-400">
            <p>© {new Date().getFullYear()} Placenext. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Bounce}
      />
    </div>
  );
}
