"use client";

import axios from "axios";
import { BackendUrl } from "@/utils/constants";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface College {
  id: string;
  name: string;
}

const ApplicationForm = () => {
  const [colleges, setColleges] = useState<College[]>([]); // Array to store college data from API
  const [department, setDepartment] = useState([]); // Array to store department data from API
  const router = useRouter(); // Use Next.js router for navigation

  // Fetch the token from localStorage and if not present, redirect user to login
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
    const fetchColleges = async () => {
      try {
        const response = await axios.get(`${BackendUrl}/api/student/colleges`, {
          headers: {
            Authorization: `Bearer ${token}`, // Pass token in headers
          },
        });
        console.log(response.data);
        if (response.data.success) {
          setColleges(response.data.colleges); // Set the fetched college data
        }
      } catch (error: any) {
        console.error("Error fetching colleges", error.message);
      }
    };
    fetchColleges();
  });

  // State to store form data
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    gender: "",
    fatherName: "",
    motherName: "",
    rollNumber: "",
    division: "",
    dateOfBirth: "",
    email: "",
    alternateEmail: "",
    aadharNumber: "",
    phoneNumber: "",
    alternatePhoneNo: "",
    panNumber: "",
    address: "",
    state: "",
    country: "",
    pincode: "",
    courseType: "",
    admissionYear: "",
    departmentName: "",
    tenthPercentage: "",
    hscBoard: "",
    twelfthPercentage: "",
    sscBoard: "",
    cet: "",
    sem1CGPI: "",
    sem2CGPI: "",
    sem3CGPI: "",
    sem4CGPI: "",
    sem5CGPI: "",
    sem6CGPI: "",
    sem7CGPI: "",
    sem8CGPI: "",
    college: "",
    githubLink: "",
    linkedInLink: "",
    locationPreference: "",
    deadBacklogs: "",
    liveBacklogs: "",
    prn: "",
    aggregateCGPI: "",
  });

  // State to store document files
  const [documents, setDocuments] = useState({
    sem1Marksheet: null,
    sem2Marksheet: null,
    sem3Marksheet: null,
    sem4Marksheet: null,
    sem5Marksheet: null,
    sem6Marksheet: null,
    sem7Marksheet: null,
    sem8Marksheet: null,
    resume: null, // Added field for resume in PDF format
  });

  // Steps for the multi-step form
  const [step, setStep] = useState(0); // Track the form step
  const [errors, setErrors] = useState({}); // Error handling state

  // Handle form input changes
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file input changes
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: string
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocuments((prev) => ({ ...prev, [key]: file }));
    }
  };

  // Validate the form (for now it returns true)
  const validateForm = () => {
    const newErrors = {};
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit form data
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    const data = new FormData();
    // Append formData to FormData object
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });
    // Append documents to FormData object
    Object.entries(documents).forEach(([key, file]) => {
      if (file) data.append(key, file);
    });

    //@ts-ignore
    for (const pair of data.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    try {
      const token = localStorage.getItem("token");
      const refreshToken = localStorage.getItem("refreshToken");
      if (token) {
        const response = await axios.post(
          `${BackendUrl}/api/student/register/applicationform`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Token in headers
              "x-refresh-token": refreshToken, // Refresh token for session
              "Content-Type": "multipart/form-data", // Handle file upload
            },
          }
        );
        if (response.data.success) {
          toast.success(response.data.message);
          router.push("/student/dashboard"); // Redirect on success
        }
      }
    } catch (error: any) {
      console.error("Signup error:", error.message);
    }
  };

  // Proceed to next step in the form
  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
  // Go back to previous step
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));

  return (
    <div className="w-full mx-auto  p-5 rounded-lg bg-transparent flex-col gap-4">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Student Detail Form
      </h2>
      <div className="bg-[#f0f4f8] p-8 rounded-lg shadow-md">
        <form onSubmit={onSubmit}>
          {step === 0 && (
            <div>
              <h1 className="text-2xl font-bold mb-6">Personal Details :</h1>
              <div className="flex flex-wrap gap-4 justify-between">
                {[
                  "firstName",
                  "middleName",
                  "lastName",
                  "gender",
                  "fatherName",
                  "motherName",
                  "rollNumber",
                  "division",
                  "dateOfBirth",
                ].map((field) => (
                  <div key={field} className="mb-4 w-68 lg:w-72 xl:w-96">
                    <label className="block mb-1">
                      {field
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase())}
                    </label>
                    <input
                      type={field === "dateOfBirth" ? "date" : "text"}
                      name={field}
                      //@ts-ignore
                      value={formData[field]}
                      onChange={handleChange}
                      placeholder={`Enter ${field.replace(/([A-Z])/g, " $1")}`}
                      className="w-full p-2 border border-blue-500 rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <h1 className="text-2xl font-bold mb-6">Contact Details</h1>
              <div className="flex flex-wrap gap-4 justify-between">
                {[
                  "email",
                  "alternateEmail",
                  "aadharNumber",
                  "phoneNumber",
                  "alternatePhoneNo",
                  "panNumber",
                  "address",
                  "state",
                  "country",
                  "pincode",
                ].map((field) => (
                  <div key={field} className="mb-4 w-68 lg:w-72 xl:w-96">
                    <label className="block mb-1">
                      {field
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase())}
                    </label>
                    <input
                      type="text"
                      name={field}
                      //@ts-ignore
                      value={formData[field]}
                      onChange={handleChange}
                      placeholder={`Enter ${field.replace(/([A-Z])/g, " $1")}`}
                      className="w-full p-2 border border-blue-500 rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h1 className="text-2xl font-bold mb-6">Academic Details</h1>
              <div className="flex flex-wrap gap-4 justify-between">
                <div>
                  <label className="block mb-1">College</label>
                  <select
                    name="college"
                    onChange={handleChange}
                    value={formData.college}
                    className="w-72 lg:w-72 xl:w-96 p-2 border border-blue-500 rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    <option value="" disabled>
                      Select College
                    </option>
                    {colleges.map((college: any) => (
                      <option key={college._id} value={college.id}>
                        {college.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-1">Department Name</label>
                  <select
                    onClick={async () => {
                      if (formData.college === "") {
                        toast.error("Please select a college first");
                        return;
                      }
                      if (department.length !== 0) return;
                      const res = await axios.post(
                        `${BackendUrl}/api/student/department`,
                        {
                          collegeId: colleges[0].id,
                        },
                        {
                          headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                          },
                        }
                      );
                      setDepartment(res.data.departments);
                    }}
                    name="departmentName"
                    onChange={handleChange}
                    value={formData.departmentName}
                    className="w-72 lg:w-72 xl:w-96 p-2 border border-blue-500 rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    <option value="" disabled>
                      Select Department
                    </option>
                    {department.map((department: any, index) => (
                      <option key={index} value={department}>
                        {department}
                      </option>
                    ))}
                  </select>
                </div>

                {[
                  "courseType",
                  "admissionYear",
                  "tenthPercentage",
                  "hscBoard",
                  "twelfthPercentage",
                  "sscBoard",
                  "cet",
                  "prn",
                  "deadBacklogs",
                  "liveBacklogs",
                  "aggregateCGPI",
                  "sem1CGPI",
                  "sem2CGPI",
                  "sem3CGPI",
                  "sem4CGPI",
                  "sem5CGPI",
                  "sem6CGPI",
                  "sem7CGPI",
                  "sem8CGPI",
                ].map((field) => (
                  <div key={field} className="mb-4 w-68 lg:w-72 xl:w-96">
                    <label className="block mb-1">
                      {field
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase())}
                    </label>
                    <input
                      type="text"
                      name={field}
                      //@ts-ignore
                      value={formData[field]}
                      onChange={handleChange}
                      placeholder={`Enter ${field.replace(/([A-Z])/g, " $1")}`}
                      className="w-full p-2 border border-blue-500 rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h1 className="text-2xl font-bold mb-6">Documents Upload</h1>
              <div className="flex flex-wrap gap-4 justify-between">
                {[
                  "sem1Marksheet",
                  "sem2Marksheet",
                  "sem3Marksheet",
                  "sem4Marksheet",
                  "sem5Marksheet",
                  "sem6Marksheet",
                  "sem7Marksheet",
                  "sem8Marksheet",
                ].map((field) => (
                  <div key={field} className="mb-4 w-68 lg:w-72 xl:w-96">
                    <label className="block mb-1">
                      Upload {field.replace(/([A-Z])/g, " $1")}
                    </label>
                    <input
                      type="file"
                      name={field}
                      onChange={(e) => handleFileChange(e, field)}
                      className="w-full p-2 border border-blue-500 rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Step for GitHub, LinkedIn, Resume, and Location Preference */}
          {step === 4 && (
            <div>
              <h1 className="text-2xl font-bold mb-6">
                Additional Professional Details
              </h1>
              <div className="flex flex-wrap gap-4 justify-between">
                <div className="mb-4 w-68 lg:w-72 xl:w-96">
                  <label className="block mb-1">Upload Resume</label>
                  <input
                    type="file"
                    name="document"
                    onChange={(e) => handleFileChange(e, "resume")}
                    className="w-full p-2 border border-blue-500 rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>
                {["githubLink", "linkedInLink", "locationPreference"].map(
                  (field) => (
                    <div key={field} className="mb-4 w-68 lg:w-72 xl:w-96">
                      <label className="block mb-1">
                        {field
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (str) => str.toUpperCase())}
                      </label>
                      <input
                        type="text"
                        name={field}
                        //@ts-ignore
                        value={formData[field]}
                        onChange={handleChange}
                        placeholder={`Enter ${field.replace(/([A-Z])/g, " $1")}`}
                        className="w-full p-2 border border-blue-500 rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                      />
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between mt-8">
            {step > 0 && (
              <button
                type="button"
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg"
                onClick={prevStep}
              >
                Previous
              </button>
            )}
            {step < 4 ? (
              <button
                type="button"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                onClick={nextStep}
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded-lg"
              >
                Submit
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationForm;
