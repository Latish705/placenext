//user ki sare details dikhane hai
"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { BackendUrl } from "@/utils/constants";
import { headers } from "next/headers";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { fetchStudentData, StudentCacheKeys, clearStudentCache } from "@/config/services/cache_service";

import useLoadingStore from "@/store/loadingStore";

export interface Job {
  _id: string; // MongoDB IDs are typically strings
  job_title: string;
  job_type: string;
  company_name: string;
  job_location: string;
  job_salary: number;
  job_description: string;
  max_no_dead_kt: number;
  max_no_live_kt: number;
  min_CGPI: number;
  branch_allowed: string[];
  passing_year: number[];
  job_requirements: string[];
  job_posted_date: string;
  yr_of_exp_req: number;
  job_timing: string;
  status: string;
  isEligible: boolean;
}

const FinalApplication = () => {
  const { setLoading } = useLoadingStore();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const { job_id } = useParams();
  // Fetch job details with cache
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        
        // Use cache service to fetch job details
        const jobData = await fetchStudentData<{job: Job}>(
          `${BackendUrl}/api/student/company/${job_id}`,
          StudentCacheKeys.JOBS,
          {
            expirationMs: 300000, // 5 minutes cache for job details
            fetchOptions: {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            },
          }
        );
        
        setJob(jobData.job);
      } catch (error) {
        console.error("Error fetching job details:", error);
        toast.error("Failed to load job details");
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [job_id]);
  // Handle checkbox change
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  // Handle CV file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCvFile(e.target.files[0]);
    }
  };

  // Handle the Apply button click
  const handleApplyClick = async () => {
    if (!isChecked) {
      toast.error("Please review your resume before applying", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    if (!job?.isEligible) {
      toast.error("You are not eligible for this job", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (!cvFile) {
      alert("Please upload your CV before applying.");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("app_cover_letter", cvFile);
      formData.append("app_job_id", job_id as string);

      const response = await axios.post(
        `${BackendUrl}/api/student/apply_job`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.success) {
        toast.success("Application submitted successfully", {
          position: "top-right",
          autoClose: 3000,
        });
        router.push("/student/dashboard");
      } else {
        toast.error(response.data.msg, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error("Failed to apply for the job. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
      console.log("Error applying for job:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!job) {
    return <div>Loading job details...</div>;
  }

  return (
    <div className=" mx-auto mt-20 w-full p-5 bg-white rounded shadow-md dark:bg-dark_main_background">
      <h2 className="text-2xl font-bold mb-4 md:text-3xl lg:text-4xl">
        {job.job_title} - {job.job_type}
      </h2>
      <button className="mt-4 px-4 py-2 bg-light_primary_background text-white rounded hover:bg-[#00749a]">
        {job.isEligible === true ? "Yes" : "No"}
      </button>
      <h3 className="text-lg font-semibold mb-2 md:text-xl lg:text-2xl">
        {job.company_name}
      </h3>
      <p className="text-gray-800 mb-2 dark:text-slate-200 font-semibold">
        {job.job_description}
      </p>
      <p className="text-gray-800 dark:text-slate-200 font-medium">
        Location: {job.job_location}
      </p>
      <p className="text-gray-800 dark:text-slate-200 font-medium">
        Salary: ${job.job_salary.toLocaleString()}
      </p>
      <p className="text-gray-800 dark:text-slate-200 font-medium">
        Posted on: {new Date(job.job_posted_date).toLocaleDateString()}
      </p>
      <p className="text-gray-800 dark:text-slate-200 font-medium">
        Deadline: 2024-09-30
      </p>{" "}
      {/* You can add deadline if available */}
      <p className="text-gray-800 dark:text-slate-200 font-medium">
        Working Hours: {job.job_timing}
      </p>
      {/* Eligibility Criteria */}
      <h4 className="font-semibold mt-4 dark:text-slate-200">
        Eligibility Criteria:
      </h4>
      <p className="text-gray-600 dark:text-slate-200">
        Max Dead KTs: {job.max_no_dead_kt}
      </p>
      <p className="text-gray-600 dark:text-slate-200">
        Max Live KTs: {job.max_no_live_kt}
      </p>
      <p className="text-gray-600 dark:text-slate-200">
        Minimum CGPI: {job.min_CGPI}
      </p>
      <p className="text-gray-600 dark:text-slate-200">
        Passing Year: {job.passing_year.join(", ")}
      </p>
      <p className="text-gray-600 dark:text-slate-200">
        Branches Allowed: {job.branch_allowed.join(", ")}
      </p>
      <h4 className="font-semibold mt-4 dark:text-slate-200">
        Job Requirements:
      </h4>
      <ul className="list-disc list-inside mb-4">
        {job.job_requirements.map((req, index) => (
          <li key={index} className="text-gray-600 dark:text-slate-200">
            {req}
          </li>
        ))}
      </ul>
      {/* CV Upload Section */}
      <div className="mt-4">
        <label className="block mb-2 font-semibold text-gray-700 dark:text-slate-200">
          Upload your CV:
        </label>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          className="block w-full text-gray-700 border border-gray-300 rounded-md shadow-sm"
        />
      </div>
      <div className="flex items-center mt-4">
        <input
          type="checkbox"
          id="disclaimer"
          checked={isChecked}
          onChange={handleCheckboxChange}
          className="mr-2 leading-tight"
        />
        <label
          htmlFor="disclaimer"
          className="text-gray-700 dark:text-slate-200"
        >
          I have reviewed my resume before applying.
        </label>
      </div>
      <div className="flex items-center justify-between mt-4">
        <button
          className="mt-4 px-4 py-2 bg-light_primary_background text-white rounded hover:bg-[#00749a]"
          onClick={handleApplyClick}
        >
          Apply
        </button>
        <Button
          onClick={() => router.back()}
          className="text-black bg-gray-200 hover:bg-gray-300"
        >
          {" "}
          Back
        </Button>
      </div>
    </div>
  );
};

export default FinalApplication;
