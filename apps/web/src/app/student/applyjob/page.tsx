import ApplicationCards from "@/components/own/Dashboard/ApplicationCards";

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
      <ApplicationCards />
      <ApplicationCards />
    </div>
  );
}
