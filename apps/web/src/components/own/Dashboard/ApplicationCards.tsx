"use client";

import Link from "next/link";
import ApplicationCard from "./ApplicationCard";
import { usePathname } from "next/navigation";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { BackendUrl } from "@/utils/constants";

export interface JobPosting {
  id: string;
  title: string;
  company: string;
  description: string;
  location: string;
  postedDate: string;
  deadline: string;
  salary: string;
  workingHours: string;
  basicRequirements: string[];
}

export const sampleJob: JobPosting = {
  id: "1",
  title: "Software Engineer",
  company: "TechCorp Inc.",
  description:
    "Join our dynamic team to develop innovative software solutions for global clients. Knowledge of React and Node.js required.",
  location: "San Francisco, CA",
  postedDate: "2024-09-05",
  deadline: "2024-09-30",
  salary: "$100,000 - $120,000 per year",
  workingHours: "9 AM - 5 PM, Monday to Friday",
  basicRequirements: [
    "Bachelor's degree in Computer Science or related field",
    "3+ years of experience in software development",
    "Proficiency in React, Node.js, and RESTful APIs",
  ],
};

const ApplicationCards = () => {
  const [jobs, setJobs] = useState([]);

  const pathname = usePathname();
  const currentPath = pathname;

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(`${BackendUrl}/api/college/get_jobs`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response.data.success) {
          setJobs(response.data.jobs);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchJobs();
  }, []);

  return (
    <div className="w-full mx-auto py-2">
      <h2 className="text-2xl font-bold mb-6">Job Postings</h2>
      {currentPath === "/college/jobs" && (
        <Button
          variant="contained"
          color="primary"
          href="/college/jobs/job_create"
        >
          Create Job
        </Button>
      )}

      <div className="flex flex-row overflow-auto gap-2">
        <ApplicationCard job={sampleJob} />
        <ApplicationCard job={sampleJob} />
        <ApplicationCard job={sampleJob} />
      </div>
      <div className="flex flex-row overflow-auto gap-2">
        <ApplicationCard job={sampleJob} />
        <ApplicationCard job={sampleJob} />
        <ApplicationCard job={sampleJob} />
      </div>
      <p className="mt-4">
        Looking for more jobs?
        <Link className="text-[#56B280] px-2" href="/job-search">
          Browse all jobs
        </Link>
      </p>
    </div>
  );
};

export default ApplicationCards;
