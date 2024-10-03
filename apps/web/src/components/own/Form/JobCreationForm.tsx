"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { BackendUrl } from "@/utils/constants";

interface College {
  id: string;
  name: string;
}

const JobCreationForm: React.FC = () => {
  const [colleges, setColleges] = useState<College[]>([]);

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const response = await axios.get(`${BackendUrl}/api/student/colleges`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        console.log(response.data);
        if (response.data.success) {
          setColleges(response.data.colleges);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchColleges(); // Call the function to fetch colleges
  }, []);

  const [formData, setFormData] = useState({
    job_title: "",
    job_type: "",
    job_location: "",
    job_salary: "",
    job_description: "",
    job_requirements: [] as string[], // Initialize as an empty array
    job_posted_date: "",
    yr_of_exp_req: "",
    job_timing: "",
    status: "",
    college: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
    index?: number,
    field?: string
  ) => {
    const { name, value } = e.target;
    if (index !== undefined && field) {
      //@ts-ignore
      const updatedArray = [...formData[field as keyof typeof formData]];
      updatedArray[index] = value;
      setFormData({ ...formData, [field]: updatedArray });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addField = (field: string) => {
    setFormData({
      ...formData,
      //@ts-ignore
      [field]: [...formData[field as keyof typeof formData], ""],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log(formData);
      const response = await axios.post(
        `${BackendUrl}/api/college/create_job`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(response.data);
      // Handle success (e.g., show a success message)
    } catch (error) {
      console.error(error);
      // Handle error (e.g., show an error message)
    }
  };

  return (
    <div className="w-full mx-auto mt-12 p-5 rounded-lg bg-transparent flex-col gap-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Job Creation Form</h2>
      <div className="bg-[#f0f4f8] p-8 rounded-lg shadow-md">
        <form onSubmit={handleSubmit}>
          <h1 className="text-2xl font-bold mb-6">Job Information:</h1>

          <div className="flex flex-wrap gap-4 justify-between">
            <div className="mb-4 w-full lg:w-72 xl:w-96">
              <label className="block mb-1">Job Title</label>
              <input
                type="text"
                name="job_title"
                value={formData.job_title}
                onChange={handleChange}
                placeholder="Enter job title"
                className="w-full p-2 border border-blue-500 rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                required
              />
            </div>

            <div>
              <label className="block mb-1">College</label>
              <select
                name="college"
                value={formData.college}
                onChange={handleChange}
                className="w-full p-2 border border-blue-500 rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                required
              >
                <option value="">Select College</option>
                {colleges.map((college) => (
                  <option key={college.id} value={college.id}>
                    {college.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4 w-full lg:w-72 xl:w-96">
              <label className="block mb-1">Job Type</label>
              <input
                type="text"
                name="job_type"
                value={formData.job_type}
                onChange={handleChange}
                placeholder="Enter job type (e.g., Full-time, Part-time)"
                className="w-full p-2 border border-blue-500 rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                required
              />
            </div>

            <div className="mb-4 w-full lg:w-72 xl:w-96">
              <label className="block mb-1">Location</label>
              <input
                type="text"
                name="job_location"
                value={formData.job_location}
                onChange={handleChange}
                placeholder="Enter job location"
                className="w-full p-2 border border-blue-500 rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                required
              />
            </div>

            <div className="mb-4 w-full lg:w-72 xl:w-96">
              <label className="block mb-1">Salary</label>
              <input
                type="number"
                name="job_salary"
                value={formData.job_salary}
                onChange={handleChange}
                placeholder="Enter salary"
                className="w-full p-2 border border-blue-500 rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Year of Experience Required</label>
              <input
                type="number"
                name="yr_of_exp_req"
                value={formData.yr_of_exp_req}
                onChange={handleChange}
                placeholder="Enter year of experience required"
                className="w-full p-2 border border-blue-500 rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                required
              />
            </div>

            <div className="mb-4 w-full lg:w-72 xl:w-96">
              <label className="block mb-1">Posted Date</label>
              <input
                type="date"
                name="job_posted_date"
                value={formData.job_posted_date}
                onChange={handleChange}
                className="w-full p-2 border border-blue-500 rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                required
              />
            </div>

            <div className="mb-4 w-full lg:w-72 xl:w-96">
              <label className="block mb-1">Job Timing</label>
              <input
                type="text"
                name="job_timing"
                value={formData.job_timing}
                onChange={handleChange}
                placeholder="Enter job timing (e.g., 9 AM - 5 PM)"
                className="w-full p-2 border border-blue-500 rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                required
              />
            </div>

            <div className="mb-4 w-full lg:w-72 xl:w-96">
              <label className="block mb-1">Status</label>
              <input
                type="text"
                name="status"
                value={formData.status}
                onChange={handleChange}
                placeholder="Enter job status (e.g., Open, Closed)"
                className="w-full p-2 border border-blue-500 rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                required
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4 justify-between">
            <div className="mb-4 w-full lg:w-72 xl:w-96">
              <label className="block mb-1">Job Description</label>
              <textarea
                name="job_description"
                value={formData.job_description}
                onChange={handleChange}
                placeholder="Enter job description"
                className="w-full p-2 border border-blue-500 rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                required
              />
            </div>

            <div className="mb-4 w-full lg:w-72 xl:w-96">
              <h3 className="text-xl font-semibold">Job Requirements</h3>
              {formData.job_requirements.map((requirement, index) => (
                <div key={index} className="flex mb-2">
                  <input
                    type="text"
                    value={requirement}
                    onChange={(e) => handleChange(e, index, "job_requirements")}
                    placeholder="Enter job requirement"
                    className="w-full p-2 border border-blue-500 rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                    required
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() => addField("job_requirements")}
                className="text-blue-500 hover:underline"
              >
                Add Requirement
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded shadow-lg hover:bg-blue-700"
          >
            Create Job
          </button>
        </form>
      </div>
    </div>
  );
};

export default JobCreationForm;
