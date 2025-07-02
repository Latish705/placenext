"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { BackendUrl } from "@/utils/constants";
import { FaUserTie, FaUniversity, FaMapMarkerAlt, FaEnvelope, FaPhoneAlt, FaGraduationCap, FaBuilding } from "react-icons/fa";

interface ICollege {
  _id: string;
  coll_name: string;
  coll_address: string;
  coll_no_employs: number;
  coll_website: string;
  coll_location: string;
  colLcontact_no: string;
  coll_affiliated_to: string;
  coll_departments: string[];
  coll_no_of_stud: number;
  coll_courses_offered: string[];
  googleId: string;
}

interface IFaculty {
  _id: string;
  faculty_name: string;
  faculty_email: string;
  faculty_contact_no: string;
  faculty_college_id: string;
  role: string;
  googleId: string;
}

export default function FacultyProfile() {
  const [faculty, setFaculty] = useState<IFaculty | null>(null);
  const [college, setCollege] = useState<ICollege | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BackendUrl}/api/faculty/getProfile`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response.data && response.data.faculty && response.data.college) {
          setFaculty(response.data.faculty);
          setCollege(response.data.college);
        }
      } catch (err) {
        console.error("Error fetching faculty/college data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="text-center py-10 text-lg">Loading...</div>;
  if (!faculty || !college) return <div className="text-center text-red-600 py-10">Failed to load data.</div>;

  return (
    <div className="bg-gradient-to-tr from-slate-100 to-gray-200 min-h-screen p-4 sm:p-8">
      {/* Hero Section */}
      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">{faculty.faculty_name}</h1>
        <p className="text-gray-500 text-lg">Role: <span className="text-blue-600 font-semibold">{faculty.role}</span></p>
        <p className="text-sm text-gray-400 mt-1">Google ID: {faculty.googleId}</p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">

        {/* Faculty Info */}
        <Card title="Faculty Details" icon={<FaUserTie className="text-xl" />}>
          <Info label="Email" value={faculty.faculty_email} icon={<FaEnvelope />} />
          <Info label="Contact" value={faculty.faculty_contact_no} icon={<FaPhoneAlt />} />
          <Info label="College ID" value={faculty.faculty_college_id} icon={<FaUniversity />} />
        </Card>

        {/* College Info */}
        <Card title="College Info" icon={<FaUniversity className="text-xl" />}>
          <Info label="Name" value={college.coll_name} />
          <Info label="Website" value={<a href={college.coll_website} target="_blank" className="text-blue-600 underline">{college.coll_website}</a>} />
          <Info label="Location" value={college.coll_location} icon={<FaMapMarkerAlt />} />
          <Info label="Address" value={college.coll_address} />
          <Info label="Contact" value={college.colLcontact_no} icon={<FaPhoneAlt />} />
          <Info label="Affiliated To" value={college.coll_affiliated_to} />
          <Info label="No. of Employees" value={college.coll_no_employs.toString()} />
          <Info label="No. of Students" value={college.coll_no_of_stud.toString()} />
        </Card>

        {/* Departments */}
        <Card title="Departments" icon={<FaBuilding className="text-xl" />} full>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            {college.coll_departments.map((dept, i) => (
              <li key={i}>{dept}</li>
            ))}
          </ul>
        </Card>

        {/* Courses Offered */}
        <Card title="Courses Offered" icon={<FaGraduationCap className="text-xl" />} full>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            {college.coll_courses_offered.map((course, i) => (
              <li key={i}>{course}</li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}

// 🔹 Card Component
function Card({ title, children, icon, full = false }: { title: string; children: React.ReactNode; icon?: React.ReactNode; full?: boolean }) {
  return (
    <div className={`bg-white p-6 rounded-2xl shadow-md transition hover:shadow-lg ${full ? "md:col-span-2" : ""}`}>
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
        {icon} {title}
      </h2>
      {children}
    </div>
  );
}

// 🔹 Info Row Component
function Info({ label, value, icon }: { label: string; value: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <p className="text-gray-700 mb-2 flex items-center gap-2">
      {icon && <span className="text-gray-500">{icon}</span>}
      <span className="font-medium">{label}:</span> {value}
    </p>
  );
}
