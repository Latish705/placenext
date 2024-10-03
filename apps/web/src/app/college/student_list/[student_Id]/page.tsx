"use client";

import { BackendUrl } from "@/utils/constants";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";

// Updated Student interface
interface Student {
  stud_name: string;
  stud_email: string;
  stud_phone: string;
  stud_dob: string;
  stud_address: string;
  stud_course: string;
  stud_department: string;
  stud_year: number;
  isSystemVerified: boolean;
  isCollegeVerified: boolean;
  stud_info_id: {
    stud_addmission_year: string;
    stud_sem1_grade: string;
    stud_sem2_grade: string;
    stud_sem3_grade: string;
    stud_sem4_grade: string;
    stud_sem5_grade: string;
    stud_sem6_grade: string;
    stud_sem7_grade: string;
    stud_sem8_grade: string;
    stud_sem1_marksheet: string;
    stud_sem2_marksheet: string;
    stud_sem3_marksheet: string;
    stud_sem4_marksheet: string;
    stud_sem5_marksheet: string;
    stud_sem6_marksheet: string;
    stud_sem7_marksheet: string;
    stud_sem8_marksheet: string;
  };
}

export default function StudentById() {
  const router = useRouter();
  const { student_Id } = useParams();
  const [student, setStudent] = useState<Student | null>(null);

  useEffect(() => {
    const fetchStudentById = async () => {
      try {
        const res = await axios.get(
          `${BackendUrl}/api/college/get_student/${student_Id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (res.data.success) {
          setStudent(res.data.student);
        }
      } catch (err) {
        console.error("Failed to fetch student:", err);
      }
    };

    if (student_Id) {
      fetchStudentById();
    }
  }, [student_Id]);

  const handleAccept = async () => {
    try {
      const res = await axios.post(
        `${BackendUrl}/api/college/accept_student`,
        {
          student_Id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        router.push("/college/student_list");
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error("Failed to accept student:", err);
    }
  };

  const handleReject = async () => {
    try {
      const res = await axios.post(
        `${BackendUrl}/api/college/reject_student`,
        {
          student_Id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        router.back();
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error("Failed to reject student:", err);
    }
  };

  if (!student) {
    return <div>Loading...</div>; // Loading state
  }

  return (
    <div className="container mx-auto py-2 px-2 md:px-8">
      <h1 className="text-3xl font-bold text-center mb-8">Student Profile</h1>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p>
            <strong>Name:</strong> {student.stud_name || "N/A"}
          </p>
          <p>
            <strong>Email:</strong> {student.stud_email || "N/A"}
          </p>
          <p>
            <strong>Phone:</strong> {student.stud_phone || "N/A"}
          </p>
          <p>
            <strong>Date of Birth:</strong>{" "}
            {student.stud_dob
              ? new Date(student.stud_dob).toDateString()
              : "N/A"}
          </p>
          <p>
            <strong>Address:</strong> {student.stud_address || "N/A"}
          </p>
          <p>
            <strong>Course:</strong> {student.stud_course || "N/A"}
          </p>
          <p>
            <strong>Department:</strong> {student.stud_department || "N/A"}
          </p>
          <p>
            <strong>Year:</strong> {student.stud_year || "N/A"}
          </p>
        </div>
      </div>

      {/* Highlighted Verification Section */}
      <div className="bg-yellow-100 shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Verification Status
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p className="flex items-center">
            <strong>System Verified:</strong>{" "}
            {student.isSystemVerified ? (
              <span className="text-green-600 ml-2 flex items-center">
                <CheckCircleIcon className="h-6 w-6" />
                <span className="ml-1">Yes</span>
              </span>
            ) : (
              <span className="text-red-600 ml-2 flex items-center">
                <XCircleIcon className="h-6 w-6" />
                <span className="ml-1">No</span>
              </span>
            )}
          </p>
          <p className="flex items-center">
            <strong>College Verified:</strong>{" "}
            {student.isCollegeVerified ? (
              <span className="text-green-600 ml-2 flex items-center">
                <CheckCircleIcon className="h-6 w-6" />
                <span className="ml-1">Yes</span>
              </span>
            ) : (
              <span className="text-red-600 ml-2 flex items-center">
                <XCircleIcon className="h-6 w-6" />
                <span className="ml-1">No</span>
              </span>
            )}
          </p>
        </div>
      </div>

      {student.stud_info_id && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Academic Information</h2>
          <p>
            <strong>Admission Year:</strong>{" "}
            {student.stud_info_id.stud_addmission_year || "N/A"}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(8)].map((_, index) => {
              const gradeKey =
                `stud_sem${index + 1}_grade` as keyof Student["stud_info_id"];
              return (
                <p key={index}>
                  <strong>{`Semester ${index + 1} Grade:`}</strong>{" "}
                  {student.stud_info_id[gradeKey] || "N/A"}
                </p>
              );
            })}
          </div>
          <h3 className="text-xl font-semibold mt-4">Marksheet Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            {[...Array(8)].map((_, index) => {
              const marksheetKey =
                `stud_sem${index + 1}_marksheet` as keyof Student["stud_info_id"];
              return (
                <a
                  href={student.stud_info_id[marksheetKey]}
                  key={index}
                  className="text-blue-500 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {`Semester ${index + 1} Marksheet`}
                </a>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between mt-4">
        <Button onClick={() => router.back()} className="mb-4 md:mb-0">
          Back
        </Button>
        <div className="flex space-x-4">
          <Button onClick={handleAccept} className="bg-green-500">
            Accept
          </Button>
          <Button onClick={handleReject} className="bg-red-500">
            Reject
          </Button>
        </div>
      </div>
    </div>
  );
}
