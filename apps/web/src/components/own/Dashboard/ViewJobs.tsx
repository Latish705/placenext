import Sidebar from "../StudentSidebar";
import JobList from "./ViewJobCard";
import ViewJobCards from "./ViewJobCards";

const StudentInfo = [
  {
    name: "Mrunal",
    description: "A student of vesit",
  },
  {
    name: "Verma",
    description: "A student of vesit",
  },
];

export default function MainDashboard() {
  return (
    <div className="bg-primary_background h-full">
     <ViewJobCards />
      <ViewJobCards />
    </div>
  );
}
