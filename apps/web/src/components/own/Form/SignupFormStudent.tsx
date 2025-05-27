"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignValidation } from "@/utils/validations/SignValidation";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";

import firebase, {
  signInWithGoogle,
  signUpAndVerifyEmail,
} from "@/config/firebase-config";
import { BackendUrl } from "@/utils/constants";

const SignUpFormStudent = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(SignValidation),
  });

  const getErrorMessage = (error: any) => {
    return error?.message || "Invalid value";
  };

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((currentUser) => {
      //@ts-ignore
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const onSubmit = async (data: any) => {
    const { email, password } = data;
    try {
      const token = await signUpAndVerifyEmail(email, password);
      localStorage.setItem("token", token);
      localStorage.setItem("email", email);
      localStorage.setItem("password", password);

      // Call your backend signup API
      const response = await axios.post(
        `${BackendUrl}/api/student/signup_with_email`,
        { email }
      );

      if (response.data.success) {
        router.push("/student/verifyemail");
      }
    } catch (error: any) {
      console.error("Signup error:", error.message);
    }
  };

  const handleLoginWithGoogle = async () => {
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
        router.push("/student/applicationform");
      } else if (response.data.success) {
        router.push("/student/dashboard");
      }
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-2 rounded-lg bg-transparent md:p-5 flex flex-col gap-4">
      <h2 className="text-2xl font-bold mb-6">Student Signup</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <input
            {...register("email")}
            placeholder="Email"
            type="email"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-700"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">
              {getErrorMessage(errors.email)}
            </p>
          )}
        </div>
        <div className="mb-4">
          <input
            type="password"
            {...register("password")}
            placeholder="Password"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-700"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {getErrorMessage(errors.password)}
            </p>
          )}
        </div>
        <div className="mb-4">
          <input
            type="password"
            {...register("confirm_password")}
            placeholder="Confirm Password"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-700"
          />
          {errors.confirm_password && (
            <p className="text-red-500 text-sm mt-1">
              {getErrorMessage(errors.confirm_password)}
            </p>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-primary text-white p-2 rounded hover:bg-blue-700"
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

      <p className="mt-4">
        Already have an account?
        <Link className="text-primary px-2" href="/signin">
          Sign In
        </Link>
      </p>
      <p className="text-[12px]">
        <span className="text-red-500 font-bold">Note:</span> The email you use
        to register will be verified before you can proceed.
      </p>
    </div>
  );
};

export default SignUpFormStudent;
