import Vector from "../assets/MobileLogin.svg";
import ApplicationForm from "@/components/own/Form/ApplicationFrom";

const SignUp = () => {
  return (
    <div className="flex flex-col-reverse md:flex-row w-full min-h-screen item-center justify-center">
      <div className=" flex items-center justify-center w-full">
        <ApplicationForm />
      </div>
    </div>
  );
};

export default SignUp;
