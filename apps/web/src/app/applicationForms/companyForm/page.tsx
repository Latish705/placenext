"use client";

import React, { useState } from "react";
import axios from "axios";
import { BackendUrl } from "@/utils/constants";
import { useRouter } from "next/navigation";

const ApplicationForm: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    comp_name: "",
    comp_start_date: "",
    comp_contact_person: "",
    comp_email: "",
    comp_industry: "",
    com_positions_offered: [""],
    comp_address: "",
    comp_jobs_offered: [""],
    comp_no_employs: "",
    comp_website: "",
    comp_location: "",
    comp_contact_no: "",
    comp_departments: [""],
    comp_no_of_stud: "",
    comp_courses_offered: [""],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index?: number,
    field?: string
  ) => {
    const { name, value } = e.target;
    if (index !== undefined && field) {
      const updatedArray = [...(formData as any)[field]];
      updatedArray[index] = value;
      setFormData({ ...formData, [field]: updatedArray });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addField = (field: string) => {
    setFormData({ ...formData, [field]: [...(formData as any)[field], ""] });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);

    try {
      const response = await axios.post(
        `${BackendUrl}/api/company/applicationForm`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.success) {
        router.push("/company/dashboard");
      }
    } catch (error) {
      console.error(error); // Handle error response
    }
  };

  return (
    <div className="w-full mx-auto mt-12 p-5 rounded-lg bg-transparent flex-col gap-4">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Company Registration Form
      </h2>
      <div className="bg-[#f0f4f8] p-8 rounded-lg shadow-md">
        <form onSubmit={handleSubmit}>
          <h1 className="text-2xl font-bold mb-6">Company Information:</h1>

          <div className="flex flex-wrap gap-4 justify-between">
            <div className="mb-4 w-full lg:w-72 xl:w-96">
              <label className="block mb-1">Company Name</label>
              <input
                type="text"
                name="comp_name"
                value={formData.comp_name}
                onChange={handleChange}
                placeholder="Enter company name"
                className="w-full p-2 border border-blue-500 rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>

            <div className="mb-4 w-full lg:w-72 xl:w-96">
              <label className="block mb-1">Company Start Date</label>
              <input
                type="date"
                name="comp_start_date"
                value={formData.comp_start_date}
                onChange={handleChange}
                className="w-full p-2 border border-blue-500 rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>

            <div className="mb-4 w-full lg:w-72 xl:w-96">
              <label className="block mb-1">Contact Person</label>
              <input
                type="text"
                name="comp_contact_person"
                value={formData.comp_contact_person}
                onChange={handleChange}
                placeholder="Enter contact person's name"
                className="w-full p-2 border border-blue-500 rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>

            <div className="mb-4 w-full lg:w-72 xl:w-96">
              <label className="block mb-1">Email</label>
              <input
                type="email"
                name="comp_email"
                value={formData.comp_email}
                onChange={handleChange}
                placeholder="Enter company email"
                className="w-full p-2 border border-blue-500 rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>

            <div className="mb-4 w-full lg:w-72 xl:w-96">
              <label className="block mb-1">Industry</label>
              <input
                type="text"
                name="comp_industry"
                value={formData.comp_industry}
                onChange={handleChange}
                placeholder="Enter industry type"
                className="w-full p-2 border border-blue-500 rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>

            <div className="mb-4 w-full lg:w-72 xl:w-96">
              <label className="block mb-1">Website</label>
              <input
                type="text"
                name="comp_website"
                value={formData.comp_website}
                onChange={handleChange}
                placeholder="Enter company website"
                className="w-full p-2 border border-blue-500 rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4 justify-between">
            <div className="mb-4 w-full lg:w-72 xl:w-96">
              <h3 className="text-xl font-semibold">Departments</h3>
              {formData.comp_departments.map((department, index) => (
                <div key={index} className="flex mb-2">
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => handleChange(e, index, "comp_departments")}
                    className="w-full p-2 border border-blue-500 rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() => addField("comp_departments")}
                className="text-blue-500 underline mt-2"
              >
                Add Department
              </button>
            </div>

            <div className="mb-4 w-full lg:w-72 xl:w-96">
              <h3 className="text-xl font-semibold">Positions Offered</h3>
              {formData.com_positions_offered.map((position, index) => (
                <div key={index} className="flex mb-2">
                  <input
                    type="text"
                    value={position}
                    onChange={(e) =>
                      handleChange(e, index, "com_positions_offered")
                    }
                    className="w-full p-2 border border-blue-500 rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() => addField("com_positions_offered")}
                className="text-blue-500 underline mt-2"
              >
                Add Position
              </button>
            </div>

            <div className="mb-4 w-full lg:w-72 xl:w-96">
              <h3 className="text-xl font-semibold">Jobs Offered</h3>
              {formData.comp_jobs_offered.map((job, index) => (
                <div key={index} className="flex mb-2">
                  <input
                    type="text"
                    value={job}
                    onChange={(e) =>
                      handleChange(e, index, "comp_jobs_offered")
                    }
                    className="w-full p-2 border border-blue-500 rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() => addField("comp_jobs_offered")}
                className="text-blue-500 underline mt-2"
              >
                Add Job
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 justify-between">
            <div className="mb-4 w-full lg:w-72 xl:w-96">
              <label className="block mb-1">Number of Employees</label>
              <input
                type="number"
                name="comp_no_employs"
                value={formData.comp_no_employs}
                onChange={handleChange}
                placeholder="Enter number of employees"
                className="w-full p-2 border border-blue-500 rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>

            <div className="mb-4 w-full lg:w-72 xl:w-96">
              <label className="block mb-1">Location</label>
              <input
                type="text"
                name="comp_location"
                value={formData.comp_location}
                onChange={handleChange}
                placeholder="Enter company location"
                className="w-full p-2 border border-blue-500 rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>

            <div className="mb-4 w-full lg:w-72 xl:w-96">
              <label className="block mb-1">Headquarter Address</label>
              <input
                name="comp_address"
                type="text"
                value={formData.comp_address}
                onChange={handleChange}
                placeholder="Enter company address"
                className="w-full p-2 border border-blue-500 rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4 justify-between">
            <div className="mb-4 w-full lg:w-72 xl:w-96">
              <label className="block mb-1">Contact Number</label>
              <input
                type="text"
                name="comp_contact_no"
                value={formData.comp_contact_no}
                onChange={handleChange}
                placeholder="Enter company contact number"
                className="w-full p-2 border border-blue-500 rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>

            <div className="mb-4 w-full lg:w-72 xl:w-96">
              <label className="block mb-1">Number of Students Hired</label>
              <input
                type="number"
                name="comp_no_of_stud"
                value={formData.comp_no_of_stud}
                onChange={handleChange}
                placeholder="Enter number of students hired"
                className="w-full p-2 border border-blue-500 rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>

            <div className="mb-4 w-full lg:w-72 xl:w-96">
              <label className="block mb-1">Courses Offered</label>
              {formData.comp_courses_offered.map((course, index) => (
                <div key={index} className="flex mb-2">
                  <input
                    type="text"
                    value={course}
                    placeholder="Courses Offered"
                    onChange={(e) =>
                      handleChange(e, index, "comp_courses_offered")
                    }
                    className="w-full p-2 border border-blue-500 rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() => addField("comp_courses_offered")}
                className="text-blue-500 underline mt-2"
              >
                Add Course
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApplicationForm;
