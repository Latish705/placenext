"use client";

import axios from "axios";
import { BackendUrl } from "@/utils/constants";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const ApplicationForm = () => {
  const [colleges, setColleges] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
    const fetchColleges = async () => {
      try {
        const response = await axios.get(`${BackendUrl}/api/student/colleges`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data);
        if (response.data.success) {
          setColleges(response.data.colleges);
        }
      } catch (error: any) {
        console.error("Error fetching colleges", error.message);
      }
    };
    fetchColleges();
  }, []);

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
  });

  const [documents, setDocuments] = useState({
    sem1Marksheet: null,
    sem2Marksheet: null,
    sem3Marksheet: null,
    sem4Marksheet: null,
    sem5Marksheet: null,
    sem6Marksheet: null,
    sem7Marksheet: null,
    sem8Marksheet: null,
  });

  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: string
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocuments((prev) => ({ ...prev, [key]: file }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });
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
              Authorization: `Bearer ${token}`,
              "x-refresh-token": refreshToken,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response.data.success) {
          toast.success(response.data.message);
          router.push("/student/dashboard");
        }
      }
    } catch (error: any) {
      console.error("Signup error:", error.message);
    }
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
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
                    {/* {errors[field] && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors[field]}
                      </p>
                    )} */}
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
                    {/* {errors[field] && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors[field]}
                      </p>
                    )} */}
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
                    <option value="">Select College</option>
                    {colleges.map((college: any) => (
                      <option key={college._id} value={college._id}>
                        {college.name}
                      </option>
                    ))}
                    <option>66edbf3b7298265cb469ca2d</option>
                  </select>
                </div>
                {[
                  "courseType",
                  "admissionYear",
                  "departmentName",
                  "tenthPercentage",
                  "hscBoard",
                  "twelfthPercentage",
                  "sscBoard",
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
                    {/* {errors[field] && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors[field]}
                      </p>
                    )} */}
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h1>Fill your CGPI</h1>
              <div className="flex flex-wrap gap-4 justify-between">
                {[
                  "sem1CGPI",
                  "sem2CGPI",
                  "sem3CGPI",
                  "sem4CGPI",
                  "sem5CGPI",
                  "sem6CGPI",
                  "sem7CGPI",
                  "sem8CGPI",
                ].map((key) => (
                  <div key={key} className="mb-4 w-72 lg:w-72 xl:w-96">
                    <label className="block mb-1">
                      {key
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase())}
                    </label>
                    <input
                      type="text"
                      name={key}
                      //@ts-ignore
                      value={formData[key]}
                      onChange={handleChange}
                      placeholder={`Enter ${key.replace(/([A-Z])/g, " $1")}`}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                ))}
              </div>
              <h1 className="text-2xl font-bold mb-6">
                Upload Semester Marksheet
              </h1>
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
                ].map((key) => (
                  <div key={key} className="mb-4 w-72 lg:w-72 xl:w-96">
                    <label className="block mb-1">
                      {key
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase())}
                    </label>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => handleFileChange(e, key)}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                ))}
              </div>
              <div className="mb-4 w-72 lg:w-72 xl:w-96">
                <label className="block mb-1">CET Score</label>
                <input
                  type="text"
                  name="cet"
                  value={formData.cet}
                  onChange={handleChange}
                  placeholder="Enter CET Score"
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />

                {/* {
                //@ts-ignore
                errors.cet && (
                  <p className="text-red-500 text-sm mt-1">{errors.cet}</p>
                )} */}
              </div>
            </div>
          )}

          <div className="flex justify-between mt-4">
            {step > 0 && (
              <button
                type="button"
                onClick={prevStep}
                className="bg-gray-300 text-black p-2 rounded hover:bg-gray-400"
              >
                Previous
              </button>
            )}
            {step < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="bg-primary text-white p-2 rounded hover:bg-green-700"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="bg-primary text-white p-2 rounded hover:bg-green-700"
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
