"use client";
import LoginForm from "@/components/own/Form/LoginFrom";
import Vector from "/assets/Fingerprint-amico.svg";
import Image from "next/image";
import useThemeStore from "@/store/store";
import LogoText from "@/components/own/LogoText";
import SignUpFormStudent from "@/components/own/Form/SignupFormStudent";

export default function StudentRegister() {
  const { darkMode, toggleDarkMode }: any = useThemeStore();
  return (
    <div className="flex flex-col md:mt-0 md:flex-row w-full h-full fixed">
      <div className="fixed top-20 flex flex-row justify-between items-center w-full px-20 "></div>
      <div className=" absolute top  top-10 left-8 flex flex-row  items-center gap-2 ">
        <LogoText />
      </div>
      <div className=" md:w-1/2 flex items-center w-full justify-center flex-col justify h-full">
        <SignUpFormStudent/>
      </div>
      <div className="hidden md:w-1/2 bg-dark_secondary_background md:h-auto lg:h-screen md:flex md:items-center md:justify-center">
        <Image
          src={
            darkMode === true
              ? "/assets/cool-background.png"
              : "/assets/cool-background-light.png"
          }
          height={1000}
          width={1000}
          alt="Mobile Login"
          className=" w-full h-full"
        />
      </div>
    </div>
  );
}
