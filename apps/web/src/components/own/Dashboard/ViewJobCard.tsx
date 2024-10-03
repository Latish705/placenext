"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { BackendUrl } from "@/utils/constants";
import Link from "next/link";
import { JobPosting } from "./ApplicationCards";

const ApplicationCard = ({ job }: { job: JobPosting }) => {
  const router = useRouter();
  const [isApplied, setIsApplied] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isNotInterested, setIsNotInterested] = useState(false);

  const handleApply = async (jobId: string) => {
    try {
      const response = await axios.post(
        `${BackendUrl}/api/student/apply_job`,
        { jobId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        console.log("Application successful");
        setIsApplied(true);
      }
    } catch (error) {
      console.error("Error during application:", error);
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(true);
    console.log("Job bookmarked");
  };

  const handleNotInterested = () => {
    setIsNotInterested(true);
    console.log("Not interested in this job");
  };

  if (isNotInterested) return null; // Don't render the card if not interested

  return (
    <div className="max-w-sm mx-auto p-4 bg-white border border-primary shadow-md rounded-lg mb-4">
      <h3 className="text-lg font-bold">{job.title}</h3>
      <p className="text-gray-700">{job.company}</p>
      <p className="text-gray-500">{job.location}</p>
      <p className="text-sm text-gray-400 mt-2">Posted on: {job.postedDate}</p>
      <p className="text-sm text-red-500 mt-2">Deadline: {job.deadline}</p>
      <p className="text-sm text-green-600 mt-2">Salary: {job.salary}</p>
      <p className="text-sm text-blue-600 mt-2">
        Working Hours: {job.workingHours}
      </p>

      <div className="mt-4 flex gap-4">
        {isApplied ? (
          <button
            className="w-1/3 bg-primary text-white p-2 rounded cursor-not-allowed"
            disabled
          >
            Applied
          </button>
        ) : (
          <button
            onClick={() => handleApply(job.id)}
            className="w-32 h-12 bg-primary text-white p-2 rounded hover:bg-green-700"
          >
            Apply Now
          </button>
        )}

        <button
          onClick={handleBookmark}
          className={`w-32 h-12 p-2 rounded ${isBookmarked ? "bg-third_back text-third_text" : "text-third_text bg-third_back hover:bg-yellow-200"}`}
        >
          {isBookmarked ? "Bookmarked" : "Bookmark"}
        </button>

        <button
          onClick={handleNotInterested}
          className="w-32 h-12 bg-four_back text-four_text p-2 rounded hover:bg-four_text hover:text-white text-sm"
        >
          Not Interested
        </button>
      </div>
    </div>
  );
};

export default ApplicationCard;
