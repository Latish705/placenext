"use client";

import { BackendUrl } from "@/utils/constants";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface StudentData {
  _id: string;
  stud_name: string;
  stud_department: string;
  stud_year: string;
  cgpa: number;
  isSystemVerified: boolean;
  isCollegeVerified: boolean;
}

export default function StudentList() {
  const router = useRouter();
  const [students, setStudents] = useState<StudentData[]>([]);
  const [placementStatus, setPlacementStatus] = useState<string[]>([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get(`${BackendUrl}/api/college/get_students`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (res.data.success) {
          setStudents(res.data.students);
          setPlacementStatus(res.data.placementStatus);
        } else {
          toast.error(res.data.message);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch student data.");
      }
    };

    fetchStudents();
  }, []);

  return (
    <div className="flex flex-col py-4 px-4 md:px-8">
      <h1 className="text-xl md:text-2xl font-bold mb-4 text-center">
        Student List
      </h1>

      {/* Filters Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex flex-col md:flex-row space-x-0 md:space-x-4 w-full">
          <div className="w-full md:w-auto">
            <label htmlFor="filterDate" className="block font-medium mb-1">
              Date
            </label>
            <select
              id="filterDate"
              className="w-full border border-gray-300 rounded-md p-2 focus:ring focus:border-blue-500"
            >
              <option value="">Select Date</option>
            </select>
          </div>
          <div className="w-full md:w-auto">
            <label htmlFor="orderType" className="block font-medium mb-1">
              Order Type
            </label>
            <select
              id="orderType"
              className="w-full border border-gray-300 rounded-md p-2 focus:ring focus:border-blue-500"
            >
              <option value="">Select Type</option>
            </select>
          </div>
          <div className="w-full md:w-auto">
            <label htmlFor="orderStatus" className="block font-medium mb-1">
              Order Status
            </label>
            <select
              id="orderStatus"
              className="w-full border border-gray-300 rounded-md p-2 focus:ring focus:border-blue-500"
            >
              <option value="">Select Status</option>
            </select>
          </div>
        </div>
        <div className="w-full md:w-auto">
          <button className="w-full md:w-auto bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600">
            Reset Filter
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full text-left border border-gray-200">
          <thead className="bg-gray-200">
            <tr className="text-center text-sm md:text-base">
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Branch</th>
              <th className="px-4 py-2 border">Year</th>
              <th className="px-4 py-2 border">CGPA</th>
              <th className="px-4 py-2 border">Placed</th>
              <th className="px-4 py-2 border">Verified</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr
                key={student._id}
                className="text-center hover:bg-gray-100 cursor-pointer text-sm md:text-base"
                onClick={() =>
                  router.push(`/college/student_list/${student._id}`)
                }
              >
                <td className="px-4 py-2 border truncate">{student._id}</td>
                <td className="px-4 py-2 border">{student.stud_name}</td>
                <td className="px-4 py-2 border">{student.stud_department}</td>
                <td className="px-4 py-2 border">{student.stud_year}</td>
                <td className="px-4 py-2 border">{student.cgpa}</td>
                <td
                  className={`px-4 py-2 border ${
                    placementStatus[index] === "true"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {placementStatus[index] === "true" ? "Yes" : "No"}
                </td>
                <td
                  className={`px-4 py-2 border ${
                    student.isSystemVerified && student.isCollegeVerified
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {student.isSystemVerified && student.isCollegeVerified
                    ? "Yes"
                    : "No"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
