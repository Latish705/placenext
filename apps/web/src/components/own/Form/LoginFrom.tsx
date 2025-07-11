import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginValidation } from "@/utils/validations/LoginValidatons";
import axios from "axios";
import { BackendUrl } from "@/utils/constants";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import firebase, {
  signInWithGoogle,
  signInWithEmailPassword
} from "@/config/firebase-config";
import { toast } from "react-toastify";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";

const LoginForm = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((currentUser) => {
      //@ts-ignore
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLoginWithGoogle = async () => {
    setIsLoading(true);
    setLoginError("");
    
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

      if (token) {
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
          router.push("/student/applicationform");
          toast.success("Welcome! Please complete your profile");
        } else if (response.data.success) {
          toast.success("Login successful!");
          router.push("/student/dashboard");
        }
      }
    } catch (error) {
      console.error("Error during login:", error);
      setLoginError("Google login failed. Please try again or use email login.");
      toast.error("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(LoginValidation),
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setLoginError("");
    
    try {
      const { token, refreshToken } = await signInWithEmailPassword(data.email, data.password);
      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);
      
      const response = await axios.post(
        `${BackendUrl}/api/student/login_with_email`,
        { email: data.email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      const userCheck = await axios.get(
        `${BackendUrl}/api/student/is_first_signin`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (userCheck.data.isFirstSignIn) {
        toast.success("Welcome! Please complete your profile");
        router.push("/student/applicationform");
      } else {
        toast.success("Login successful!");
        router.push("/student/dashboard");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setLoginError(error.message || "Invalid email or password. Please try again.");
      toast.error(error.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const getErrorMessage = (error: any) => {
    if (typeof error === "string") {
      return error;
    }
    if (error && error.message) {
      return error.message;
    }
    return "Invalid value";
  };

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700"
      >
        <div className="mb-8 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Student Login</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Welcome back! Please enter your details</p>
        </div>
        
        {loginError && (
          <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400 text-sm flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {loginError}
            </p>
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-1">
            <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <FiMail size={18} />
              </div>
              <input
                id="email"
                {...register("email")}
                type="email"
                placeholder="name@example.com"
                className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                disabled={isLoading}
                autoComplete="email"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {getErrorMessage(errors.email)}
              </p>
            )}
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <Link 
                href="/authentication/forgot-password" 
                className="text-xs font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <FiLock size={18} />
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                disabled={isLoading}
                autoComplete="current-password"
              />
              <div 
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </div>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {getErrorMessage(errors.password)}
              </p>
            )}
          </div>
          
          <motion.button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg shadow-sm transition-all duration-200 disabled:opacity-70"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
            ) : (
              "Sign in"
            )}
          </motion.button>
        </form>
        
        <div className="mt-8 mb-6 flex items-center">
          <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
          <span className="px-4 text-sm text-gray-500 dark:text-gray-400">or continue with</span>
          <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
        </div>
        
        <motion.button
          onClick={handleLoginWithGoogle}
          className="w-full flex items-center justify-center gap-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg py-3 px-4 font-medium text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200 shadow-sm"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          disabled={isLoading}
        >
          <FcGoogle size={20} />
          {isLoading ? "Please wait..." : "Continue with Google"}
        </motion.button>
        
        <p className="mt-8 text-center text-gray-600 dark:text-gray-400 text-sm">
          Don&apos;t have an account?{" "}
          <Link
            href="/authentication/studentSignup"
            className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            Create an account
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginForm;
