"use client";

import Hero from "@/components/own/Landing/Hero";
import LandingNav from "@/components/own/Nav/LandingNav";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { SparklesCore } from "@/components/ui/sparkles";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ToastContainer, Bounce, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useThemeStore from "../store/store";
import { Inconsolata } from "next/font/google";
import Services from "@/components/own/Landing/Services";
import JoiningCard from "@/components/own/Landing/Card/JoiningCard";
import { InfiniteMovingCards } from "@/components/own/Landing/Card/InfiniteMovingCards";
import TeamSection from "@/components/own/Landing/TeamSection";
import BlueLandingText from "@/components/own/Landing/Text/BlueLandingText";
import JobApplicationStatus from "./company/job_application_status/page";

const inconsolata = Inconsolata({
  subsets: ["latin"],
  weight: ["400", "600", "800"],
});

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const { darkMode, toggleDarkMode }: any = useThemeStore();
  useEffect(() => {
    setIsClient(true); // Ensure component renders only on the client side
    // document.documentElement.classList.add("dark"); // Set dark mode by default
    // Toggle the dark class on the body
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  const handleClick = () => {
    toast.success("Welcome to Placenext!", {
      position: "top-right",
      autoClose: 3000,
      theme: "colored",
    });
  };

  return (
    <>
      {isClient && (
        <div
          className={`relative min-h-screen ${inconsolata.className} flex-col`}
        >
          <LandingNav />
          <div className="relative top-20 flex flex-col items-center justify-center px-10 gap-12 w-screen lg:px-12 xl:px-20">
            <Hero />
            <Services />
            <JoiningCard />
            <TeamSection />
            {/* <JobApplicationStatus/> */}
            <div className="flex flex-col items-center">
              <div className="w-auto px-4">
                <BlueLandingText text={"Testimonies"} />
              </div>
              <div>
                <InfiniteMovingCards
                  direction="right"
                  speed="slow"
                  className="w-screen"
                />
              </div>
            </div>
          </div>
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
      )}
    </>
  );
}
