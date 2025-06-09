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
  signUpAndVerifyEmail,
} from "@/config/firebase-config";

import { useEffect, useState } from "react";
import { IoLogoApple } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";

const SignInFormCompany = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
  const unsubscribe = firebase.auth().onIdTokenChanged((currentUser) => {
    //@ts-ignore
    setUser(currentUser);
  });

  return () => unsubscribe();
}, []);


const handleLoginWithGoogle = async () => {
  try {
    await firebase.auth().signOut();
    await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);

    // Sign in with Google and get the token
    const { token } = await signInWithGoogle();
    localStorage.setItem("token", token);

    // Get current logged in user directly, no listeners inside this function
    const newUser = firebase.auth().currentUser;
    if (!newUser) {
      console.error("No user found after Google sign-in");
      return;
    }

    const idToken = await newUser.getIdToken();
    const email = newUser.email ?? "";

    localStorage.setItem("company_email", email);

    // Check if first sign-in
    const signCheckResponse = await axios.get(
      `${BackendUrl}/api/company/is_first_signin`,
      {
        headers: { Authorization: `Bearer ${idToken}` },
      }
    );

    if (signCheckResponse.data.success && signCheckResponse.data.isFirstSignIn) {
      // Redirect to application form
      router.push("/company/application");
      return;
    }

    // If not first sign-in, login normally
    const response = await axios.post(
      `${BackendUrl}/api/company/google_login`,
      { email },
      {
        headers: { Authorization: `Bearer ${idToken}` },
      }
    );

    if (response.data.success) {
      router.push("/company/dashboard");
    } else {
      console.error("Google login failed:", response.data.msg);
    }
  } catch (error) {
    console.error("Error during Google login:", error);
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
      const res = await axios.post(
        `${BackendUrl}/api/company/is_first_signin_with_email`,
        data
      );

      // @ts-ignore
      if (res.data.success) navigator("/company/verifyemail");
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
      <h2 className="text-2xl font-bold mb-6">Company SignIn</h2>
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
        Don&apos;t have an Account?
        <Link className="text-primary px-2" href="/authentication/companySignup">
          Sign Up
        </Link>
      </p>
      <p className="text-[12px]">
        <span className="text-red-500 font-bold">Note:</span> that the email you
        are using to register Company will be the admin email.
      </p>
    </div>
  );
};

export default SignInFormCompany;
