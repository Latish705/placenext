"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { BackendUrl } from "@/utils/constants";
import { useForm } from "react-hook-form";
import { StudentDetailFormValidations } from "@/utils/validations/StudentDetailFormValidations";
import { useState } from "react";

const ApplicationForm = () => {
  const [step, setStep] = useState(0); // Track current step
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(StudentDetailFormValidations),
  });

  const onSubmit = async (data: any) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const response = await axios.post(
          `${BackendUrl}/api/student/google_login`,
          { data },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data);
      }
    } catch (error: any) {
      console.error("Signup error:", error.message);
    }
  };

  const DocumentUpload = () => {
    const [uploadedDocuments, setUploadedDocuments] = useState<string[]>([]);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files ? event.target.files[0] : null;
      if (file) {
        setSelectedFile(file);
        // You can add logic to upload the file and then update the document list
        setUploadedDocuments((prevDocs) => [...prevDocs, file.name]);
      }
    }
  };

    const getErrorMessage = (error: any) => {
      if (error?.message) {
        return error.message;
      }
      return "Invalid value";
    };

    const nextStep = () => {
      setStep((prev) => Math.min(prev + 1, 3)); // Move to next step
    };

    const prevStep = () => {
      setStep((prev) => Math.max(prev - 1, 0)); // Move to previous step
    };

  return (
    <div className="w-full mx-auto mt-12 p-5 rounded-lg bg-transparent flex-col gap-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Student Detail Form</h2>
      <hr />
      <hr />
      <hr />
      <div className="bg-[#f0f4f8] p-8 rounded-lg shadow-md">
      <form onSubmit={handleSubmit(onSubmit)}>
        {step === 0 && (
          <div>
            <h1 className="text-2xl font-bold mb-6">Personal Details :</h1>
            <hr />
            <hr />
            <div className="flex flex-wrap gap-4 justify-between">
              <div className="mb-4 w-68 lg:w-72 xl:w-96">
                <label className="block mb-1">First Name</label>
                <input
                  {...register("firstName")}
                  placeholder="Enter First Name"
                  className="w-full p-2 border border-blue-500 rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">
                    {getErrorMessage(errors.firstName)}
                  </p>
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
                  <p className="text-red-500 text-sm mt-1">
                    {getErrorMessage(errors.middleName)}
                  </p>
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
                  <p className="text-red-500 text-sm mt-1">
                    {getErrorMessage(errors.lastName)}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-4 justify-between">
            <div className="mb-4 w-68 lg:w-72 xl:w-96">
                <label className="block mb-1">Gender</label>
                <input
                  {...register("gender")}
                  placeholder="Enter Gender"
                  className="w-full p-2 border border-blue-500 rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                {errors.gender && (
                  <p className="text-red-500 text-sm mt-1">
                    {getErrorMessage(errors.gender)}
                  </p>
                )}
              </div>

              <div className="mb-4 w-68 lg:w-72 xl:w-96">
                <label className="block mb-1">Father Name</label>
                <input
                  {...register("fatherName")}
                  placeholder="Enter Father's Name"
                  className="w-full p-2 border border-blue-500 rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                {errors.fatherName && (
                  <p className="text-red-500 text-sm mt-1">
                    {getErrorMessage(errors.fatherName)}
                  </p>
                )}
              </div>
              <div className="mb-4 w-68 lg:w-72 xl:w-96">
                <label className="block mb-1">Mother Name</label>
                <input
                  {...register("motherName")}
                  placeholder="Enter Mother's Name"
                  className="w-full p-2 border border-blue-500 rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                {errors.motherName && (
                  <p className="text-red-500 text-sm mt-1">
                    {getErrorMessage(errors.motherName)}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-4 justify-between">
              
            </div>
            <div className="flex flex-wrap gap-4 justify-between">
              <div className="mb-4 w-68 lg:w-72 xl:w-96">
                <label className="block mb-1">Roll Number</label>
                <input
                  {...register("rollNumber")}
                  placeholder="Enter Roll Number"
                  className="w-full p-2 border border-blue-500 rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                {errors.rollNumber && (
                  <p className="text-red-500 text-sm mt-1">
                    {getErrorMessage(errors.rollNumber)}
                  </p>
                )}
              </div>
              <div className="mb-4 w-68 lg:w-72 xl:w-96">
                <label className="block mb-1">Division</label>
                <input
                  {...register("division")}
                  placeholder="Enter Division"
                  className="w-full p-2 border border-blue-500 rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                {errors.division && (
                  <p className="text-red-500 text-sm mt-1">
                    {getErrorMessage(errors.division)}
                  </p>
                )}
              </div>

              <div className="mb-4 w-68 lg:w-72 xl:w-96">
                <label className="block mb-1">Date Of Birth</label>
                <input
                  type="date"
                  {...register("dateOfBirth")}
                  placeholder="Enter Date Of Birth"
                  className="w-full p-2 border border-blue-500 rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                />

                {errors.dateOfBirth && (
                  <p className="text-red-500 text-sm mt-1">
                    {getErrorMessage(errors.dateOfBirth)}
                  </p>
                )}
              </div>
              
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <h1 className="text-2xl font-bold mb-6">Contact Details</h1>
            <hr />
            <hr />
            <div className="flex flex-wrap gap-4 justify-between">
              <div className="mb-4 w-68 lg:w-72 xl:w-96">
                <label className="block mb-1">Email</label>
                <input
                  {...register("email")}
                  placeholder="Enter Email"
                  className="w-full p-2 border border-blue-500 rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                {errors.alternateEmail && (
                  <p className="text-red-500 text-sm mt-1">
                    {getErrorMessage(errors.email)}
                  </p>
                )}
              </div>
              <div className="mb-4 w-68 lg:w-72 xl:w-96">
                <label className="block mb-1">Alternate Email</label>
                <input
                  {...register("alternateEmail")}
                  placeholder="Enter Alternate Email"
                  className="w-full p-2 border border-blue-500 rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                {errors.alternateEmail && (
                  <p className="text-red-500 text-sm mt-1">
                    {getErrorMessage(errors.alternateEmail)}
                  </p>
                )}
              </div>
              {/* Aadhar Number */}
            <div className="mb-4 w-68 lg:w-72 xl:w-96">
              <label className="block mb-1">Aadhar Number</label>
              <input
                {...register("aadharNumber")}
                placeholder="Enter Aadhar Number"
                className="w-full p-2 border border-blue-500 rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              {errors.aadharNumber && (
                <p className="text-red-500 text-sm mt-1">
                  {getErrorMessage(errors.aadharNumber)}
                </p>
              )}
            </div>
            <div className="flex flex-wrap gap-4 justify-between">
              <div className="mb-4 w-68 lg:w-72 xl:w-96">
                <label className="block mb-1">Phone Number</label>
                <input
                  {...register("phoneNumber")}
                  placeholder="Enter Phone Number"
                  className="w-full p-2 border border-blue-500 rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                {errors.phoneNumber && (
                  <p className="text-red-500 text-sm mt-1">
                    {getErrorMessage(errors.phoneNumber)}
                  </p>
                )}
              </div>
              <div className="mb-4 w-68 lg:w-72 xl:w-96">
                <label className="block mb-1">Alternate Phone No</label>
                <input
                  {...register("alternatePhoneNo")}
                  placeholder="Enter Alternate Phone No"
                  className="w-full p-2 border border-blue-500 rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                {errors.alternatePhoneNo && (
                  <p className="text-red-500 text-sm mt-1">
                    {getErrorMessage(errors.alternatePhoneNo)}
                  </p>
                )}
              </div>
              {/* PAN Number */}
            <div className="mb-4 w-68 lg:w-72 xl:w-96">
              <label className="block mb-1">PAN Number</label>
              <input
                {...register("panNumber")}
                placeholder="Enter PAN Number"
                className="w-full p-2 border border-blue-500 rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              {errors.panNumber && (
                <p className="text-red-500 text-sm mt-1">
                  {getErrorMessage(errors.panNumber)}
                </p>
              )}
            </div>
            </div>
            </div>
            
            
            <div className="flex flex-wrap gap-4 justify-between">
              <div className="mb-4 w-68 lg:w-72 xl:w-96">
                <label className="block mb-1">Address</label>
                <input
                  {...register("address")}
                  placeholder="Enter Address"
                  className="w-full p-2 border border-blue-500 rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">
                    {getErrorMessage(errors.address)}
                  </p>
                )}
              </div>
              <div className="mb-4 w-68 lg:w-72 xl:w-96">
                <label className="block mb-1">State</label>
                <input
                  {...register("state")}
                  placeholder="Enter State"
                  className="w-full p-2 border border-blue-500 rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                {errors.state && (
                  <p className="text-red-500 text-sm mt-1">
                    {getErrorMessage(errors.state)}
                  </p>
                )}
              </div>
              <div className="mb-4 w-68 lg:w-72 xl:w-96">
                <label className="block mb-1">Country</label>
                <input
                  {...register("country")}
                  placeholder="Enter Country"
                  className="w-full p-2 border border-blue-500 rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                {errors.country && (
                  <p className="text-red-500 text-sm mt-1">
                    {getErrorMessage(errors.country)}
                  </p>
                )}
              </div>
              <div className="mb-4 w-68 lg:w-72 xl:w-96">
                <label className="block mb-1">Pincode</label>
                <input
                  {...register("pincode")}
                  placeholder="Enter Pincode"
                  className="w-full p-2 border border-blue-500 rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                {errors.pincode && (
                  <p className="text-red-500 text-sm mt-1">
                    {getErrorMessage(errors.pincode)}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h1 className="text-2xl font-bold mb-6">Academic Details</h1>
            <hr />
            <hr />
            <div className="flex flex-wrap gap-4 justify-between">
            <div className="mb-4 w-68 lg:w-72 xl:w-96">
                <label className="block mb-1">Course Type</label>
                <input
                  {...register("courseType")}
                  placeholder="Enter Course Type"
                  className="w-full p-2 border border-blue-500 rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                {errors.courseType && (
                  <p className="text-red-500 text-sm mt-1">
                    {getErrorMessage(errors.courseType)}
                  </p>
                )}
              </div>
              <div className="mb-4 w-68 lg:w-72 xl:w-96">
                <label className="block mb-1">Admission Year</label>
                <input
                  {...register("admissionYear")}
                  placeholder="Enter Admission Year"
                  className="w-full p-2 border border-blue-500 rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                {errors.admissionYear && (
                  <p className="text-red-500 text-sm mt-1">
                    {getErrorMessage(errors.admissionYear)}
                  </p>
                )}
              </div>
              <div className="mb-4 w-68 lg:w-72 xl:w-96">
                <label className="block mb-1">Department Name</label>
                <input
                  {...register("departmentName")}
                  placeholder="Enter Department Name"
                  className="w-full p-2 border border-blue-500 rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                {errors.departmentName && (
                  <p className="text-red-500 text-sm mt-1">
                    {getErrorMessage(errors.departmentName)}
                  </p>
                )}
              </div>
              <div className="mb-4 w-68 lg:w-72 xl:w-96">
                <label className="block mb-1">Tenth Percentage</label>
                <input
                  {...register("tenthPercentage")}
                  placeholder="Enter Tenth Percentage"
                  className="w-full p-2 border border-blue-500 rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                {errors.tenthPercentage && (
                  <p className="text-red-500 text-sm mt-1">
                    {getErrorMessage(errors.tenthPercentage)}
                  </p>
                )}
              </div>
              <div className="mb-4 w-68 lg:w-72 xl:w-96">
                <label className="block mb-1">hscBoard</label>
                <input
                  {...register("hscBoard")}
                  placeholder="Enter HSC Board,"
                  className="w-full p-2 border border-blue-500 rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                {errors.hscBoard && (
                  <p className="text-red-500 text-sm mt-1">
                    {getErrorMessage(errors.hscBoard)}
                  </p>
                )}
              </div>
              <div className="mb-4 w-68 lg:w-72 xl:w-96">
                <label className="block mb-1">Twelfth Percentage</label>
                <input
                  {...register("twelfthPercentage")}
                  placeholder="Enter Twelfth Percentage"
                  className="w-full p-2 border border-blue-500 rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                {errors.twelfthPercentage && (
                  <p className="text-red-500 text-sm mt-1">
                    {getErrorMessage(errors.twelfthPercentage)}
                  </p>
                )}
              </div>
              {/* SSC Board */}
            <div className="mb-4 w-68 lg:w-72 xl:w-96">
              <label className="block mb-1">SSC Board</label>
              <input
                {...register("sscBoard")}
                placeholder="Enter SSC Board"
                className="w-full p-2 border border-blue-500 rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              {errors.sscBoard && (
                <p className="text-red-500 text-sm mt-1">
                  {getErrorMessage(errors.sscBoard)}
                </p>
              )}
            </div>
              <div className="mb-4 w-68 lg:w-72 xl:w-96">
                <label className="block mb-1">CET Percentile</label>
                <input
                  {...register("cetPercentile")}
                  placeholder="Enter CET Percentile"
                  className="w-full p-2 border border-blue-500 rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                {errors.jeePercentile && (
                  <p className="text-red-500 text-sm mt-1">
                    {getErrorMessage(errors.jeePercentile)}
                  </p>
                )}
              </div>

              <div className="mb-4 w-68 lg:w-72 xl:w-96">
                <label className="block mb-1">JEE Percentile</label>
                <input
                  {...register("jeePercentile")}
                  placeholder="Enter JEE Percentile"
                  className="w-full p-2 border border-blue-500 rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                {errors.jeePercentile && (
                  <p className="text-red-500 text-sm mt-1">
                    {getErrorMessage(errors.jeePercentile)}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 justify-between">
              <div className="mb-4 w-68 lg:w-72 xl:w-96">
                <label className="block mb-1">Admission Year</label>
                <input
                  {...register("admissionYear")}
                  placeholder="Enter Admission Year"
                  className="w-full p-2 border border-blue-500 rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                {errors.admissionYear && (
                  <p className="text-red-500 text-sm mt-1">
                    {getErrorMessage(errors.admissionYear)}
                  </p>
                )}
              </div>
              <div className="mb-4 w-68 lg:w-72 xl:w-96">
                <label className="block mb-1">Admission Category</label>
                <input
                  {...register("admissionCategory")}
                  placeholder="Enter Admission Category"
                  className="w-full p-2 border border-blue-500 rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                {errors.admissionCategory && (
                  <p className="text-red-500 text-sm mt-1">
                    {getErrorMessage(errors.admissionCategory)}
                  </p>
                )}
              </div>
              <div className="mb-4 w-68 lg:w-72 xl:w-96">
                <label className="block mb-1">Gap In Education</label>
                <input
                  {...register("gapInEducation")}
                  placeholder="Enter Gap In Education"
                  className="w-full p-2 border border-blue-500 rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                {errors.gapInEducation && (
                  <p className="text-red-500 text-sm mt-1">
                    {getErrorMessage(errors.gapInEducation)}
                  </p>
                )}
              </div>
            </div>
            {/* SGPI, Live KT, Dead KT for Semesters 1 to 8 */}
            {[...Array(8)].map((_, i) => (
              <div key={i}>
                <div className="flex flex-wrap gap-4 justify-between">
                <div className="mb-4 w-68 lg:w-72 xl:w-96">
                  <label className="block mb-1">SGPI Sem {i + 1}</label>
                  <input
                    {...register(`sem${i + 1}Sgpi`)}
                    placeholder={`Enter SGPI for Sem ${i + 1}`}
                    className="w-full p-2 border border-blue-500 rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                  {errors[`sem${i + 1}Sgpi`] && (
                    <p className="text-red-500 text-sm mt-1">
                      {getErrorMessage(errors[`sem${i + 1}Sgpi`])}
                    </p>
                  )}
                </div>

                <div className="mb-4 w-68 lg:w-72 xl:w-96">
                  <label className="block mb-1">Live KT Sem {i + 1}</label>
                  <input
                    {...register(`sem${i + 1}LiveKt`)}
                    placeholder={`Enter Live KT for Sem ${i + 1}`}
                    className="w-full p-2 border border-blue-500 rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                  {errors[`sem${i + 1}LiveKt`] && (
                    <p className="text-red-500 text-sm mt-1">
                      {getErrorMessage(errors[`sem${i + 1}LiveKt`])}
                    </p>
                  )}
                </div>

                <div className="mb-4 w-68 lg:w-72 xl:w-96">
                  <label className="block mb-1">Dead KT Sem {i + 1}</label>
                  <input
                    {...register(`sem${i + 1}DeadKt`)}
                    placeholder={`Enter Dead KT for Sem ${i + 1}`}
                    className="w-full p-2 border border-blue-500 rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                  {errors[`sem${i + 1}DeadKt`] && (
                    <p className="text-red-500 text-sm mt-1">
                      {getErrorMessage(errors[`sem${i + 1}DeadKt`])}
                    </p>
                  )}
                </div>
              </div>
              </div>
            ))}

            
<div className="flex flex-wrap gap-4 justify-between">
            {/* Diploma */}
            <div className="mb-4 w-68 lg:w-72 xl:w-96">
              <label className="block mb-1">Diploma</label>
              <input
                {...register("diploma")}
                placeholder="Enter Diploma"
                className="w-full p-2 border border-blue-500 rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              {errors.diploma && (
                <p className="text-red-500 text-sm mt-1">
                  {getErrorMessage(errors.diploma)}
                </p>
              )}
            </div>

            {/* Diploma Board */}
            <div className="mb-4 w-68 lg:w-72 xl:w-96">
              <label className="block mb-1">Diploma Board</label>
              <input
                {...register("diplomaBoard")}
                placeholder="Enter Diploma Board"
                className="w-full p-2 border border-blue-500 rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              {errors.diplomaBoard && (
                <p className="text-red-500 text-sm mt-1">
                  {getErrorMessage(errors.diplomaBoard)}
                </p>
              )}
            </div>

            {/* Diploma Stream */}
            <div className="mb-4 w-68 lg:w-72 xl:w-96">
              <label className="block mb-1">Diploma Stream</label>
              <input
                {...register("diplomaStream")}
                placeholder="Enter Diploma Stream"
                className="w-full p-2 border border-blue-500 rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              {errors.diplomaStream && (
                <p className="text-red-500 text-sm mt-1">
                  {getErrorMessage(errors.diplomaStream)}
                </p>
              )}
            </div>
            </div>

            <div className="flex flex-wrap gap-4 justify-between">
              <div className="mb-4 w-68 lg:w-72 xl:w-96">
                <label className="block mb-1">Aggregate CGPI</label>
                <input
                  {...register("aggregateCgpi")}
                  placeholder="Enter Aggregate CGPI"
                  className="w-full p-2 border border-blue-500 rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                {errors.aggregateCgpi && (
                  <p className="text-red-500 text-sm mt-1">
                    {getErrorMessage(errors.aggregateCgpi)}
                  </p>
                )}
              </div>
              <div className="mb-4 w-68 lg:w-72 xl:w-96">
                <label className="block mb-1">Live KT</label>
                <input
                  {...register("liveKt")}
                  placeholder="Enter Live KT"
                  className="w-full p-2 border border-blue-500 rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                {errors.liveKt && (
                  <p className="text-red-500 text-sm mt-1">
                    {getErrorMessage(errors.liveKt)}
                  </p>
                )}
              </div>
              <div className="mb-4 w-68 lg:w-72 xl:w-96">
                <label className="block mb-1">Dead KT</label>
                <input
                  {...register("deadKt")}
                  placeholder="Enter Dead KT"
                  className="w-full p-2 border border-blue-500 rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                {errors.deadKt && (
                  <p className="text-red-500 text-sm mt-1">
                    {getErrorMessage(errors.deadKt)}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
        {step === 3 && (
          <div>
            <h1 className="text-2xl font-bold mb-6">Upload Documents</h1>
            <hr />
            <hr />
            <div className="flex flex-wrap gap-4 justify-between">
            {/* <!-- 1st Column: Select Document Dropdown and Browse Button --> */}
            <div className="mb-4 w-full lg:w-1/2 xl:w-1/2">
              <label className="block mb-1">Select Document</label>
              <select
                {...register("selectedDocument")}
                className="w-full p-2 border border-blue-500 rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <option value="stud_resume">Resume</option>
                <option value="stud_sem1">Semester 1</option>
                <option value="stud_sem2">Semester 2</option>
                <option value="stud_sem3">Semester 3</option>
                <option value="stud_sem4">Semester 4</option>
                <option value="stud_sem5">Semester 5</option>
                <option value="stud_sem6">Semester 6</option>
                <option value="stud_sem7">Semester 7</option>
                <option value="stud_sem8">Semester 8</option>
                <option value="stud_cet">CET</option>
                <option value="stud_jee">JEE</option>
                <option value="stud_hsc">HSC</option>
                <option value="stud_ssc">SSC</option>
                <option value="stud_diploma">Diploma</option>
                <option value="stud_capAllotment">CAP Allotment</option>
                <option value="stud_photoWithSignature">Photo with Signature</option>
                <option value="stud_gapCertificate">Gap Certificate</option>
                <option value="stud_aadhar">Aadhar</option>
                <option value="stud_pan">PAN</option>
                <option value="handcap_cert">Handicap Certificate</option>
              </select>
              <button
                type="button"
                className="mt-4 p-2 bg-primary text-white rounded hover:bg-green-600"
                onClick={() => {
                  const fileInput = document.getElementById('fileInput') as HTMLInputElement | null;
                  if (fileInput) {
                    fileInput.click();
                    
                  }
                }}
              >
                Browse
              </button>

              <input
                type="file"
                id="fileInput"
                style={{ display: 'none' }}
                {...register("fileUpload")}
              />
            </div>

            {/* <!-- 2nd Column: List of Uploaded Documents --> */}
            {/* <div className="mb-4 w-full lg:w-1/2 xl:w-1/2"> */}
              {/* <label className="block mb-1">Uploaded Documents</label>
              <ul className="list-disc pl-5">
                {uploadedDocuments.map((doc, index) => (
                    <li key={index} className="mb-2">
                    {doc}
                    </li>
                ))}
                </ul>
            </div> */}
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
