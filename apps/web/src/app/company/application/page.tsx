"use client";

import { useForm } from "react-hook-form";
import axios from "axios";
import { BackendUrl } from "@/utils/constants";
import { useRouter } from "next/navigation";

export default function CompanyApplicationForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: any) => {
    const payload = {
      ...data,
      com_positions_offered: data.com_positions_offered.split(",").map((s: string) => s.trim()),
      comp_jobs_offered: data.comp_jobs_offered.split(",").map((s: string) => s.trim()),
      comp_departments: data.comp_departments.split(",").map((s: string) => s.trim()),
      comp_courses_offered: data.comp_courses_offered.split(",").map((s: string) => s.trim()),
      comp_no_employs: Number(data.comp_no_employs),
      comp_no_of_stud: Number(data.comp_no_of_stud),
    };

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`${BackendUrl}/api/company/applicationForm`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.data.success) {
        alert("Company application form submitted successfully");
        router.push("/company/dashboard");
      } else {
        alert(res.data.msg || "Submission failed.");
      }
    } catch (error: any) {
      alert(error?.response?.data?.msg || "Something went wrong.");
    }
  };

  const getErrorMessage = (error: any) => {
    if (typeof error === "string") return error;
    if (error && error.message) return error.message;
    return "Invalid value";
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 p-6 rounded-lg shadow-lg bg-white">
      <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
        Company Application Form
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-6">
        {[ 
          { name: "comp_name", label: "Company Name", type: "text" },
          { name: "comp_start_date", label: "Start Date", type: "date" },
          { name: "comp_contact_person", label: "Contact Person", type: "text" },
          { name: "comp_industry", label: "Industry", type: "text" },
          { name: "comp_website", label: "Website", type: "url" },
          { name: "comp_no_employs", label: "No. of Employees", type: "number" },
          { name: "comp_contact_no", label: "Contact Number", type: "text" },
          { name: "comp_location", label: "Location", type: "text" },
          { name: "comp_no_of_stud", label: "No. of Students Required", type: "number" },
        ].map((field) => (
          <div key={field.name}>
            <label className="block text-gray-700 font-medium mb-1">{field.label}</label>
            <input
              type={field.type}
              {...register(field.name, { required: `${field.label} is required` })}
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors[field.name] && (
              <p className="text-red-500 text-sm mt-1">{getErrorMessage(errors[field.name])}</p>
            )}
          </div>
        ))}

        {[
          { name: "com_positions_offered", label: "Positions Offered (comma-separated)" },
          { name: "comp_jobs_offered", label: "Jobs Offered (comma-separated)" },
          { name: "comp_departments", label: "Departments (comma-separated)" },
          { name: "comp_courses_offered", label: "Courses Offered (comma-separated)" },
        ].map((field) => (
          <div key={field.name}>
            <label className="block text-gray-700 font-medium mb-1">{field.label}</label>
            <textarea
              {...register(field.name, { required: `${field.label} is required` })}
              rows={3}
              placeholder="E.g., Software Engineer, HR"
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors[field.name] && (
              <p className="text-red-500 text-sm mt-1">{getErrorMessage(errors[field.name])}</p>
            )}
          </div>
        ))}

        <div>
          <label className="block text-gray-700 font-medium mb-1">Address</label>
          <textarea
            {...register("comp_address", { required: "Address is required" })}
            rows={3}
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.comp_address && (
            <p className="text-red-500 text-sm mt-1">{getErrorMessage(errors.comp_address)}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition duration-300"
        >
          Submit Application
        </button>
      </form>
    </div>
  );
}
