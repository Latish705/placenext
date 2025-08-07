"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignValidation } from "@/utils/validations/SignValidation";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

import firebase, {
  signInWithGoogle,
  signUpAndVerifyEmail,
} from "@/config/firebase-config";
import { BackendUrl } from "@/utils/constants";

const SignUpFormStudent = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(SignValidation),
    defaultValues: {
      email: "",
      password: "",
      confirm_password: "",
    },
  });

  const getErrorMessage = (error: any) => error?.message || "Invalid value";

  const password = watch("password");
  const confirmPassword = watch("confirm_password");

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((currentUser) => {
      //@ts-ignore
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const onSubmit = async (data: any) => {
    const { email, password, confirm_password } = data;
    setIsLoading(true);

    if (password !== confirm_password) {
      toast.error("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      // 1. Sign up and send email verification
      const token = await signUpAndVerifyEmail(email, password);

      // 2. Store token/email in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("email", email);

      // 3. Notify backend
      const response = await axios.post(
        `${BackendUrl}/api/student/signup_with_email`,
        { email }
      );

      if (response.data.success) {
        toast.success("Registration successful! Please verify your email.");
        router.push("/student/verifyemail");
      }
    } catch (error: any) {
      console.error("Signup error:", error.message);
      toast.error(error.message || "Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginWithGoogle = async () => {
    setIsLoading(true);
    try {
      const { token, refreshToken } = await signInWithGoogle();

      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);

      const signCheckResponse = await axios.get(
        `${BackendUrl}/api/student/is_first_signin`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const response = await axios.post(
        `${BackendUrl}/api/student/google_login`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (signCheckResponse.data.isFirstSignIn) {
        toast.success("Welcome! Please complete your profile.");
        router.push("/student/applicationform");
      } else if (response.data.success) {
        toast.success("Login successful!");
        router.push("/student/dashboard");
      }
    } catch (error: any) {
      console.error("Google login error:", error);
      toast.error(error.message || "Google login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = `
    w-full p-2 border rounded 
    focus:outline-none focus:ring-2 focus:ring-blue-700
    bg-white dark:bg-gray-800 
    border-gray-300 dark:border-gray-600
    text-gray-900 dark:text-white
    placeholder-gray-500 dark:placeholder-gray-400
  `;

  return (
    <div className="max-w-md w-full mx-auto p-6 rounded-lg bg-white dark:bg-gray-800 shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white text-center">
        Student Signup
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input
            {...register("email")}
            placeholder="Email"
            type="email"
            className={inputStyle}
            disabled={isLoading}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">
              {getErrorMessage(errors.email)}
            </p>
          )}
        </div>

        <div>
          <input
            type="password"
            {...register("password")}
            placeholder="Password"
            className={inputStyle}
            disabled={isLoading}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {getErrorMessage(errors.password)}
            </p>
          )}
        </div>

        <div>
          <input
            type="password"
            {...register("confirm_password")}
            placeholder="Confirm Password"
            className={inputStyle}
            disabled={isLoading}
          />
          {errors.confirm_password && (
            <p className="text-red-500 text-sm mt-1">
              {getErrorMessage(errors.confirm_password)}
            </p>
          )}
          {password !== confirmPassword && confirmPassword && (
            <p className="text-red-500 text-sm mt-1">Passwords don&apos;t match</p>
          )}
        </div>

        <motion.button
          type="submit"
          className="w-full bg-primary text-white p-2 rounded hover:bg-blue-700 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Create Account"}
        </motion.button>
      </form>

      <div className="my-6 flex items-center">
        <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
        <span className="px-4 text-gray-500 dark:text-gray-400">or</span>
        <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
      </div>

      <motion.button
        onClick={handleLoginWithGoogle}
        className="w-full bg-white text-gray-700 border border-gray-300 p-2 rounded hover:bg-gray-100 flex items-center justify-center gap-2 font-semibold shadow-sm transition-colors dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600 disabled:opacity-70"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        disabled={isLoading}
      >
        <FcGoogle size={20} />
        {isLoading ? "Processing..." : "Continue with Google"}
      </motion.button>

      <p className="mt-6 text-center text-gray-600 dark:text-gray-300">
        Already have an account?{" "}
        <Link
          className="text-primary font-medium hover:underline"
          href="/authentication/studentLogin"
        >
          Sign In
        </Link>
      </p>
      <p className="text-[12px] text-gray-500 dark:text-gray-400 text-center mt-4">
        <span className="text-red-500 font-bold">Note:</span> The email you use
        to register will be verified before you can proceed.
      </p>
    </div>
  );
};

export default SignUpFormStudent;
