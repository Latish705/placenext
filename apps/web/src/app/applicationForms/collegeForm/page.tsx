"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";

export default function ApplicationForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any) => {
    console.log(data);
  };

  const getErrorMessage = (error: any) => {
    if (typeof error === "string") {
      return error;
    }
    if (error && error.message) {
      return error.message;
    }
    return "Invalid value";
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 rounded-lg shadow-lg bg-white">
      <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
        College Application Form
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-6"
      >
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            College Name
          </label>
          <input
            {...register("collegeName")}
            placeholder="Enter College Name"
            type="text"
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          {errors.collegeName && (
            <p className="text-red-500 text-sm mt-1">
              {getErrorMessage(errors.collegeName)}
            </p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            College Website URL
          </label>
          <input
            type="url"
            {...register("collegeWebsite")}
            placeholder="https://example.com"
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          {errors.collegeWebsite && (
            <p className="text-red-500 text-sm mt-1">
              {getErrorMessage(errors.collegeWebsite)}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Number of Students
            </label>
            <input
              type="number"
              {...register("collegeNoOfStudents")}
              placeholder="e.g., 2000"
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.collegeNoOfStudents && (
              <p className="text-red-500 text-sm mt-1">
                {getErrorMessage(errors.collegeNoOfStudents)}
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              College Contact No
            </label>
            <input
              type="text"
              {...register("collegeContactNo")}
              placeholder="e.g., +1-123-456-7890"
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.collegeContactNo && (
              <p className="text-red-500 text-sm mt-1">
                {getErrorMessage(errors.collegeContactNo)}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            College Location
          </label>
          <input
            type="text"
            {...register("collegeLocation")}
            placeholder="Enter Location"
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          {errors.collegeLocation && (
            <p className="text-red-500 text-sm mt-1">
              {getErrorMessage(errors.collegeLocation)}
            </p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            College Address
          </label>
          <input
            type="text"
            {...register("collegeAddress")}
            placeholder="Enter Full Address"
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          {errors.collegeAddress && (
            <p className="text-red-500 text-sm mt-1">
              {getErrorMessage(errors.collegeAddress)}
            </p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Affiliation
          </label>
          <input
            type="text"
            {...register("collegeAffiliation")}
            placeholder="e.g., AICTE, UGC"
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          {errors.collegeAffiliation && (
            <p className="text-red-500 text-sm mt-1">
              {getErrorMessage(errors.collegeAffiliation)}
            </p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Courses Offered
          </label>
          <input
            type="text"
            {...register("collegeCoursesOffered")}
            placeholder="e.g., B.Tech, MBA"
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          {errors.collegeCoursesOffered && (
            <p className="text-red-500 text-sm mt-1">
              {getErrorMessage(errors.collegeCoursesOffered)}
            </p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Departments
          </label>
          <input
            type="text"
            {...register("collegeDepartment")}
            placeholder="e.g., Engineering, Arts"
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          {errors.collegeDepartment && (
            <p className="text-red-500 text-sm mt-1">
              {getErrorMessage(errors.collegeDepartment)}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-green-500 text-white p-3 rounded-md hover:bg-green-600 transition duration-300"
        >
          Submit Application
        </button>
      </form>

      <p className="mt-6 text-center text-gray-700">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-green-500 font-semibold">
          Sign Up
        </Link>
      </p>
    </div>
  );
}
