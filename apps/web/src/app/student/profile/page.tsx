"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BackendUrl } from "@/utils/constants";
import { StudentDetailFormValidations } from "@/utils/validations/StudentDetailFormValidations";

export default function ProfilePage() {
  const [applicationData, setApplicationData] = useState(null);

  // Fetch existing application data
  useEffect(() => {
    axios
      .get(`${BackendUrl}/application-data`)
      .then((response) => setApplicationData(response.data))
      .catch((error) => console.error("Error fetching application data", error));
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(StudentDetailFormValidations),
    defaultValues: applicationData,
  });

  const onSubmit = (data) => {
    axios
      .post(`${BackendUrl}/submit-application`, data)
      .then((response) => {
        console.log("Form submitted successfully:", response);
      })
      .catch((error) => {
        console.error("Error submitting the form", error);
      });
  };

  const getErrorMessage = (error) => {
    return error.message || "This field is required.";
  };

  return (
    <div className="w-full mx-auto mt-12 p-5 rounded-lg bg-transparent flex-col gap-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Edit Application Form</h2>
      <div className="bg-[#f0f4f8] p-8 rounded-lg shadow-md">
        <form onSubmit={handleSubmit(onSubmit)}>
          {applicationData ? (
            <>
              <h1 className="text-2xl font-bold mb-6">Personal Details:</h1>
              <div className="flex flex-wrap gap-4 justify-between">
                <div className="mb-4 w-68 lg:w-72 xl:w-96">
                  <label className="block mb-1">First Name</label>
                  <input
                    {...register("firstName")}
                    placeholder="Enter First Name"
                    className="w-full p-2 border border-blue-500 rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">{getErrorMessage(errors.firstName)}</p>
                  )}
                </div>

                <div className="mb-4 w-68 lg:w-72 xl:w-96">
                  <label className="block mb-1">Middle Name</label>
                  <input
                    {...register("middleName")}
                    placeholder="Enter Middle Name"
                    className="w-full p-2 border border-blue-500 rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                  {errors.middleName && (
                    <p className="text-red-500 text-sm mt-1">{getErrorMessage(errors.middleName)}</p>
                  )}
                </div>

                <div className="mb-4 w-68 lg:w-72 xl:w-96">
                  <label className="block mb-1">Last Name</label>
                  <input
                    {...register("lastName")}
                    placeholder="Enter Last Name"
                    className="w-full p-2 border border-blue-500 rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">{getErrorMessage(errors.lastName)}</p>
                  )}
                </div>
              </div>
              {/* Repeat similar fields for other sections */}
              <button type="submit" className="mt-4 p-3 bg-blue-500 text-white rounded shadow-lg">
                Submit
              </button>
            </>
          ) : (
            <p>Loading application data...</p>
          )}
        </form>
      </div>
    </div>
  );
}
