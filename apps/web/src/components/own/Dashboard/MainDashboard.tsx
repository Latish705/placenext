import Sidebar from "../Sidebar";

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
    <div className="flex flex-row">
      <div className="fix top-2 left-2">
        <Sidebar />
      </div>
      <div className="pt-4">
        <div className="flex flex-row justify-between items-center">
          <div>
            <input
              placeholder="Search"
              className="border-2 rounded-lg px-2 py-1"
            />
          </div>
          <div>icon 1 icon 2 icnon 3</div>
        </div>
        <div>
          {StudentInfo.map((student: any, index: any) => (
            <div key={index} className="flex flex-row items-center ">
              <div>
                icon
                {student.name}
              </div>
              <div>{student.description}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
