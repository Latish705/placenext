"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SignValidation } from "@/utils/validations/SignValidation";
import { useRouter } from "next/navigation";

import axios from "axios";

import { BackendUrl } from "@/utils/constants";
import Link from "next/link";
import { useForm } from "react-hook-form";
import firebase, {
  signInWithGoogle,
  signInWithEmail,
  onAuthStateChange,
} from "@/config/firebase-config";

import { useEffect, useState } from "react";
import { IoLogoApple } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { onAuthStateChanged } from "firebase/auth";

const SignUpFormCollege = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((currentUser) => {
      //@ts-ignore
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLoginWithGoogle = async () => {
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
      console.log(
        "Sign check response:",
        signCheckResponse.data,
        signCheckResponse.data.success,
        signCheckResponse.data.isFirstSignIn
      );

      if (token) {
        console.log("ID Token:", token);
        const response = await axios.post(
          `${BackendUrl}/api/college/google_login`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (
          signCheckResponse.data.success == true &&
          signCheckResponse.data.isFirstSignIn
        ) {
          router.push("/forms/selectCollege");
        } else if (response.data.success === true) {
          console.log("User logged in successfully");
          router.push("/college/dashboard");
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
    resolver: zodResolver(SignValidation),
  });

  const onSubmit = async (data: any) => {
    try {
        if(data.password!==data.confirmPassword){
            alert("Passwords do not match.");
      return;
        }
      const res = await axios.post(
        `${BackendUrl}/api/college/is_first_signin_with_email`,
        data
      );

      // @ts-ignore
      if (res.data.success) navigator("/college/verifyemail");
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
      <h2 className="text-2xl font-bold mb-6 text-primary">Faculty Login</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4 min-w-40 md:min-w-60 lg:min-w-80">
          <input
            {...register("email")}
            placeholder="Email"
            type="text"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-700"
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
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-700"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {getErrorMessage(errors.password)}
            </p>
          )}
        </div>
        <div className="mb-4 min-w-40 md:min-w-60 lg:min-w-80">
          <input
            type="password"
            {...register("confirm_password")}
            placeholder="confirm Password"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-700"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {getErrorMessage(errors.password)}
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

      <p>
        Already have an account?
        <Link className="text-primary px-2" href="/authentication/facultyLogin">
          Sign In
        </Link>
      </p>
      <p className="text-[12px]">
        <span className="text-red-500 font-bold">Note:</span> that the email you
        are using to register college will be the admin email.
      </p>
    </div>
  );
};

export default SignUpFormCollege;
