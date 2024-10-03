"use client";
import { useEffect, useState } from "react";
import { signUpAndVerifyEmail, isUserVerified } from "@/config/firebase-config";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { BackendUrl } from "@/utils/constants";

export default function VerifyEmail() {
  const [attempts, setAttempts] = useState(0);
  const maxAttempts = 6;
  const router = useRouter();

  const resendEmail = async () => {
    const email = localStorage.getItem("email");
    const password = localStorage.getItem("password");

    if (email && password) {
      try {
        await signUpAndVerifyEmail(email, password);
        alert("Verification email resent. Please check your inbox.");
      } catch (error) {
        console.error("Error resending email:", error);
        alert("Failed to resend verification email. Please try again.");
      }
    } else {
      alert("Email or password not found in local storage.");
    }
  };

  const checkVerification = async () => {
    const email = localStorage.getItem("email");

    if (email) {
      try {
        const isVerified = await isUserVerified();

        const userCheck = await axios.get(
          `${BackendUrl}/api/student/is_first_signin`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (userCheck.data.success && userCheck.data.isFirstSignIn) {
          router.push("/student/applicationform");
          return;
        }

        if (isVerified) {
          router.push("/student/dashboard");
        }
      } catch (error) {
        console.error("Error checking verification status:", error);
      }
    } else {
      console.error("Email not found in local storage.");
    }
  };

  useEffect(() => {
    if (attempts >= maxAttempts) {
      alert("Verification email not received. Please try again.");
      router.push("/student/login");
      return;
    }

    const intervalId = setInterval(() => {
      checkVerification();
      setAttempts((prev) => prev + 1);
    }, 3000);

    return () => clearInterval(intervalId);
  }, [attempts, checkVerification, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-4">
          Verify Your Email
        </h1>
        <p className="text-gray-700 text-center mb-6">
          Thank you for signing up for Placenext: One Stop Gateway to
          Opportunities! Please check your email to verify your account.
        </p>
        <p className="text-gray-600 text-center mb-6">
          If you didn&apos;t receive the email, click the button below to resend
          it.
        </p>
        <button
          onClick={resendEmail}
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700"
        >
          Resend Verification Email
        </button>
        <p className="text-gray-600 text-center mt-4">
          Already verified?
          <Link href="/student/login" className="text-blue-600 hover:underline">
            {" "}
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
