import SignInFormCollege from "@/components/own/Form/FacultiyLoginForm";

export default function FacultyLogin() {
  return (
    <div className="flex flex-col mt-28 md:mt-0 md:flex-row w-full min-h-screen ">
      <div className="mt-4 md:w-1/2 flex items-center justify-center">
        <SignInFormCollege />
      </div>
      <div className="hidden md:w-1/2 bg-[#F2F2F2] md:h-auto lg:h-screen md:flex md:items-center md:justify-center">
        {/* <img src={Vector} alt="" /> */}
      </div>
    </div>
  );
}
