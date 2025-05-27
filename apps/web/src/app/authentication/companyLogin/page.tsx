import SignInFormCompany from "@/components/own/Form/CompanyLoginForm";

// import Vector from "../assets/Authentication.svg";

export default function CompanyLogin() {
  return (
    <div className="flex flex-col mt-28 md:mt-0 md:flex-row w-full min-h-screen ">
      <div className="mt-4 md:w-1/2 flex items-center justify-center">
        <SignInFormCompany />
      </div>
      <div className="hidden md:w-1/2 bg-[#F2F2F2] md:h-auto lg:h-screen md:flex md:items-center md:justify-center">
        {/* <img src={Vector} alt="" /> */}
      </div>
    </div>
  );
}
