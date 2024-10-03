import Vector from "../assets/MobileLogin.svg";
import ApplicationForm from "@/components/own/Form/ApplicationFrom";
// import MessageList from  "@/components/own/Dashboard/MessageList"
// import MessageSidebar from  "@/components/own/Dashboard/MessageSidebar"
const SignUp = () => {
  return (
    <div className="flex flex-col-reverse md:flex-row w-full min-h-screen item-center justify-center">
      <div className=" flex items-center justify-center w-full">
        <ApplicationForm />
      </div>
      {/* <div className="hidden  md:w-1/2 bg-[#F2F2F2] md:h-auto lg:h-screen md:flex md:items-center md:justify-self-center">
        <img src={Vector} al-t="" />
      </div> */}
    </div>
    // <div className="min-h-screen flex">
    //   {/* Fixed Sidebar */}
    //   <div className="w-64 fixed h-full p-4">
    //     <MessageSidebar />
    //   </div>
    //   {/* Message List */}
    //   <div className="flex-1 ml-64 overflow-y-auto">
    //     <MessageList />
    //   </div>
    // </div>
  );
};

export default SignUp;
