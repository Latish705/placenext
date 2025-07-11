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

const LoginForm = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((currentUser) => {
      //@ts-ignore
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

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

  const inputStyle = `
    w-full p-2 border rounded 
    focus:outline-none focus:ring-2 
    bg-white dark:bg-gray-800 
    border-gray-300 dark:border-gray-600
    text-gray-900 dark:text-white
    placeholder-gray-500 dark:placeholder-gray-400
    focus:ring-primary focus:border-primary
  `;

  return (
    <div className="p-2 rounded-lg w-full max-w-md">
      <div className="p-4 rounded shadow-lg max-w-md mx-auto mt-8 bg-white dark:bg-gray-800 md:p-6 flex flex-col gap-4 border border-gray-100 dark:border-gray-700">
        <h2 className="text-xl md:text-2xl font-bold mb-4 text-primary dark:text-white text-center">
          Student Login
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="min-w-40 md:min-w-60 lg:min-w-80">
            <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
              Email Address
            </label>
            <input
              id="email"
              {...register("email")}
              placeholder="Enter your email"
              type="text"
              className={inputStyle}
              disabled={isLoading}
              autoComplete="email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {getErrorMessage(errors.email)}
              </p>
            )}
          </div>
          <div className="min-w-40 md:min-w-60 lg:min-w-80">
            <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
              Password
            </label>
            <input
              id="password"
              type="password"
              {...register("password")}
              placeholder="Enter your password"
              className={inputStyle}
              disabled={isLoading}
              autoComplete="current-password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {getErrorMessage(errors.password)}
              </p>
            )}
          </div>
          <div className="flex justify-end">
            <Link href="/authentication/forgot-password" className="text-sm text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <motion.button
            type="submit"
            className="w-full bg-primary text-white p-3 rounded-md hover:bg-blue-700 transition-all duration-200 disabled:opacity-70 font-medium"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </span>
            ) : (
              "Login"
            )}
          </motion.button>
        </form>
        <div className="my-5 flex items-center">
          <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
          <span className="px-4 text-gray-500 dark:text-gray-400 text-sm">or continue with</span>
          <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
        </div>
        <button
          onClick={handleLoginWithGoogle}
          className="w-full bg-white text-gray-700 border border-gray-300 p-3 rounded-md hover:bg-gray-50 flex items-center justify-center gap-2 font-medium shadow-sm transition-colors dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
          disabled={isLoading}
        >
          <FcGoogle size={20} />
          {isLoading ? "Processing..." : "Google"}
        </button>
        <div className="mt-5 text-center">
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Don&apos;t have an account?{" "}
            <Link
              className="text-primary font-medium hover:underline"
              href="/authentication/studentSignup"
            >
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
