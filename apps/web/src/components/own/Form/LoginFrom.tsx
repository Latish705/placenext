"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoginValidation } from "@/utils/validations/LoginValidatons";
import axios from "axios";
import { BackendUrl } from "@/utils/constants";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { IoLogoApple } from "react-icons/io5";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import firebase, {
  signInWithGoogle,
  signUpAndVerifyEmail,
} from "@/config/firebase-config";
const LoginForm = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((currentUser) => {
      //@ts-ignore
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLoginWithGoogle = async () => {
    try {
      const { token, refreshToken } = await signInWithGoogle();

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
        console.log("ID Token:", token);
        const response = await axios.post(
          `${BackendUrl}/api/student/google_login`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (signCheckResponse.data.success === true) {
          if (signCheckResponse.data.isFirstSignIn) {
            router.push("/student/applicationform");
          }
        }

        if (response.data.success === true) {
          console.log("User logged in successfully");
          router.push("/student/dashboard");
        }
      }
    } catch (error) {
      console.error("Error during login:", error);
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
    localStorage.setItem("email", data.email);
    localStorage.setItem("password", data.password);
    await signUpAndVerifyEmail(data.email, data.password).then(
      (refreshToken) => {
        localStorage.setItem("token", refreshToken);
        router.push("/student/verifyemail");
      }
    );
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
    <div className="max-w-md mx-auto mt-12 p-2 rounded-lg bg-transparent md:p-5 flex flex-col gap-4">
      <h2 className="text-2xl font-bold mb-6">Login</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4 min-w-40 md:min-w-60 lg:min-w-80">
          <input
            {...register("email")}
            placeholder="Email"
            type="text"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#56B280]"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">
              {getErrorMessage(errors.email)}
            </p>
          )}
        </div>
        <div className="mb-4 min-w-40 md:min-w-60 lg:min-w-80">
          <input
            type="password"
            {...register("password")}
            placeholder="Password"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#56B280]"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {getErrorMessage(errors.password)}
            </p>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-[#56B280] text-white p-2 rounded hover:bg-green-700"
        >
          Submit
        </button>
      </form>
      <div className="mt-4">
        <button
          onClick={handleLoginWithGoogle}
          className="w-full bg-white text-gray-700 border border-gray-300 p-2 rounded hover:bg-gray-100 flex items-center justify-center gap-2 font-semibold shadow-sm"
        >
          <FcGoogle size={20} />
          Login with Google
        </button>
      </div>
      <p>
        Don&apos;t have an Account?
        <Link className="text-[#56B280] px-2" href="/signup">
          Sign Up
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;
