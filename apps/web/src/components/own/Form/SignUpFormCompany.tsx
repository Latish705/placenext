"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SignValidation } from "@/utils/validations/SignValidation";
import { useRouter } from "next/navigation";

import axios from "axios";

import { BackendUrl } from "@/utils/constants";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { signInWithGoogle } from "@/config/firebase-config";
import firebase from "firebase/compat/app";
import { useEffect, useState } from "react";
import { IoLogoApple } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";

const SignUpFormCompany = () => {
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
      const token: any = await signInWithGoogle();
      console.log(token);
      const isNewUser = token.additionalUserInfo?.isNewUser;
      if (isNewUser) {
        console.log(token.additionalUserInfo);
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const handleAppleLogin = () => {
    // Add Apple OAuth login logic here
    console.log("Apple login clicked");
  };

  const handleLogout = async () => {
    try {
      await firebase.auth().signOut();
      console.log("User signed out");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(SignValidation),
  });

  const onSubmit = async (data: any) => {
    try {
      const res = await axios.post(`${BackendUrl}/api/customers/signup`, data);
      // @ts-ignore

      // @ts-ignore
      if (res.data.success) navigator("/email-sent");
    } catch (error: any) {
      console.error("Signup error:", error.message);
    }
  };

  const getErrorMessage = (error: any) => {
    if (error?.message) {
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
        <button
          onClick={handleAppleLogin}
          className="w-full bg-[#000000] text-white p-2 rounded hover:bg-gray-800 mt-2 flex items-center justify-center gap-2"
        >
          <IoLogoApple size={20} />
          Login with Apple
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

export default SignUpFormCompany;