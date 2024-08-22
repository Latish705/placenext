import SignUpForm from "@/components/own/Form/SignUpForm";
import Vector from "../assets/MobileLogin.svg";
import ApplicationForm from "@/components/own/Form/ApplicationFrom";

const SignUp = () => {
  return (
    <div className="flex flex-col-reverse md:flex-row w-full min-h-screen item-center justify-center">
      <div className=" flex items-center justify-center">
        <h1>Form</h1>
        <ApplicationForm />
      </div>
      {/* <div className="hidden  md:w-1/2 bg-[#F2F2F2] md:h-auto lg:h-screen md:flex md:items-center md:justify-self-center">
        <img src={Vector} alt="" />
      </div> */}
    </div>
  );
};

export default SignUp;
