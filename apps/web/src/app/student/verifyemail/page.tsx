"use client";
import { useEffect, useState } from "react";
import {  isUserVerified, signUpWithEmail } from "@/config/firebase-config";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { BackendUrl } from "@/utils/constants";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

export default function VerifyEmail() {
  const [attempts, setAttempts] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const maxAttempts = 10;
  const router = useRouter();

  const resendEmail = async () => {
    setIsLoading(true);
    const email = localStorage.getItem("email");
    const password = localStorage.getItem("password");

    if (email && password) {
      try {
        await signUpWithEmail(email, password);
        toast.success("Verification email resent. Please check your inbox.");
      } catch (error) {
        console.error("Error resending email:", error);
        toast.error("Failed to resend verification email. Please try again.");
      }
    } else {
      toast.error("Email or password not found. Please try logging in again.");
    }
    setIsLoading(false);
  };

  const checkVerification = async () => {
    const email = localStorage.getItem("email");
    const token = localStorage.getItem("token");

    if (email && token) {
      try {
        const isVerified = await isUserVerified();

        if (isVerified) {
          try {
            const userCheck = await axios.get(
              `${BackendUrl}/api/student/is_first_signin`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (userCheck.data.success && userCheck.data.isFirstSignIn) {
              toast.success("Email verified! Please complete your profile.");
              router.push("/student/applicationform");
              return;
            }

            toast.success("Email verified! Redirecting to dashboard...");
            router.push("/student/dashboard");
          } catch (error) {
            console.error("Error checking user status:", error);
          }
        }
      } catch (error) {
        console.error("Error checking verification status:", error);
      }
    } else {
      console.error("Email or token not found in local storage.");
    }
  };

  useEffect(() => {
    if (attempts >= maxAttempts) {
      toast.info(
        "Verification taking longer than expected. Please try again later."
      );
      router.push("/authentication/studentLogin");
      return;
    }

    const intervalId = setInterval(() => {
      checkVerification();
      setAttempts((prev) => prev + 1);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [attempts, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
      <motion.div
        className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 max-w-md w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold text-center text-primary dark:text-blue-400 mb-6">
          Verify Your Email
        </h1>

        <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
          <p className="text-gray-700 dark:text-gray-300 text-center mb-4">
            We&apos;ve sent a verification email to your inbox. Please check and
            click the verification link.
          </p>
          <div className="flex justify-center">
            <span className="inline-block animate-bounce bg-primary w-3 h-3 rounded-full mr-1"></span>
            <span
              className="inline-block animate-bounce bg-primary w-3 h-3 rounded-full mr-1"
              style={{ animationDelay: "0.2s" }}
            ></span>
            <span
              className="inline-block animate-bounce bg-primary w-3 h-3 rounded-full"
              style={{ animationDelay: "0.4s" }}
            ></span>
          </div>
        </div>

        <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
          If you don&apos;t receive the email within a few minutes, check your
          spam folder or click the button below to resend.
        </p>

        <motion.button
          onClick={resendEmail}
          className="w-full bg-primary text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Resend Verification Email"}
        </motion.button>

        <div className="mt-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Already verified?{" "}
            <Link
              href="/authentication/studentLogin"
              className="text-primary hover:underline font-medium"
            >
              Login here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
