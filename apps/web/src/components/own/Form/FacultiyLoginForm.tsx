"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SignValidation } from "@/utils/validations/SignValidation";
import { useRouter } from "next/navigation";
import axios from "axios";
import { BackendUrl } from "@/utils/constants";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { signInWithGoogle, signInWithEmail, onAuthStateChange } from "@/config/firebase-config";
import { useEffect, useState } from "react";
import { IoLogoApple } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";
import { User } from "firebase/auth";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";

const SignInFormCollege = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChange((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLoginWithGoogle = async () => {
    setIsLoading(true);
    setLoginError("");
    
    try {
      const { token } = await signInWithGoogle();
      localStorage.setItem("token", token);

      const signCheckResponse = await axios.get(
        `${BackendUrl}/api/college/is_first_signin`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Sign check response:", signCheckResponse.data);

      if (token) {
        const response = await axios.post(
          `${BackendUrl}/api/college/google_login`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (signCheckResponse.data.success && signCheckResponse.data.isFirstSignIn) {
          toast.success("Welcome! Please complete your college registration.");
          router.push("/forms/selectCollege");
        } else if (response.data.success) {
          // Store user info in localStorage
          localStorage.setItem("email", response.data.user?.email || "");
          localStorage.setItem("name", response.data.user?.name || "");
          localStorage.setItem("refreshToken", response.data.refreshToken || "");
          
          toast.success("Login successful!");
          router.push("/college/dashboard");
        } else {
          throw new Error(response.data.message || "Login failed");
        }
      }
    } catch (error: any) {
      console.error("Error during Google login:", error);
      const errorMessage = error.response?.data?.message || error.message || "Google login failed. Please try again.";
      setLoginError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(SignValidation),
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setLoginError("");
    
    try {
      // First check if it's a first-time sign-in
      const signCheckResponse = await axios.post(
        `${BackendUrl}/api/college/is_first_signin_with_email`,
        { email: data.email }
      );

      if (signCheckResponse.data.success && signCheckResponse.data.isFirstSignIn) {
        toast.info("Please verify your email first.");
        router.push("/college/verifyemail");
        return;
      }

      // Proceed with Firebase email login
      const { token } = await signInWithEmail(data.email, data.password);
      localStorage.setItem("token", token);

      // Login with backend
      const response = await axios.post(
        `${BackendUrl}/api/college/email_login`,
        { email: data.email, password: data.password },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        // Store user info in localStorage
        localStorage.setItem("email", response.data.user?.email || data.email);
        localStorage.setItem("name", response.data.user?.name || "");
        localStorage.setItem("refreshToken", response.data.refreshToken || "");
        
        toast.success("Login successful!");
        router.push("/college/dashboard");
      } else {
        throw new Error(response.data.message || "Login failed");
      }
    } catch (error: any) {
      console.error("Error during email login:", error);
      const errorMessage = error.response?.data?.message || error.message || "Login failed. Please check your credentials.";
      setLoginError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getErrorMessage = (error: any) => {
    if (error?.message) {
      return error.message;
    }
    return "Invalid value";
  };

  return (
    <motion.div 
      className="max-w-md mx-auto p-6 rounded-xl bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Faculty Login</h2>
        <p className="text-gray-600 dark:text-gray-400">Access your TPO dashboard</p>
      </div>

      {loginError && (
        <motion.div 
          className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <p className="text-red-600 dark:text-red-400 text-sm">{loginError}</p>
        </motion.div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiMail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              {...register("email")}
              type="email"
              placeholder="Enter your email"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {getErrorMessage(errors.email)}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiLock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? (
                <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {getErrorMessage(errors.password)}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || isLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
        >
          {isSubmitting || isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Signing in...
            </div>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      <div className="my-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">Or continue with</span>
          </div>
        </div>
      </div>

      <button
        onClick={handleLoginWithGoogle}
        disabled={isLoading}
        className="w-full bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 font-medium shadow-sm hover:shadow-md transition-all duration-200"
      >
        <FcGoogle size={20} />
        {isLoading ? "Signing in..." : "Sign in with Google"}
      </button>

      <div className="mt-6 text-center space-y-2">
        <p className="text-gray-600 dark:text-gray-400">
          Don't have an account?{" "}
          <Link 
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors duration-200" 
            href="/authentication/facultySignup"
          >
            Sign Up
          </Link>
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          <span className="text-red-500 font-medium">Note:</span> The email you use to register will be the admin email for your college.
        </p>
      </div>
    </motion.div>
  );
};

export default SignInFormCollege;
