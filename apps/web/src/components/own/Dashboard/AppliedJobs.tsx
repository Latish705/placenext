"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { BackendUrl } from "@/utils/constants";
import { Button, Card, CardContent, Typography } from "@mui/material";
import useThemeStore from "@/store/store";
import { fetchStudentData, StudentCacheKeys, clearStudentCache } from "@/config/services/cache_service";

interface Job {
  _id: string;
  job_title: string;
  company_name: string;
  job_location: string;
  job_salary: number;
  job_description: string;
  job_timing: string;
}

interface AppliedJob {
  _id: string;
  app_cover_letter: string;
  app_status: string;
  app_job_id: Job;
}

const AppliedJobs = () => {
  const [appliedJobs, setAppliedJobs] = useState<AppliedJob[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const { darkMode }: any = useThemeStore();

  // Function to fetch applied jobs with caching
  const fetchAppliedJobs = async () => {
    try {
      // Use fetchStudentData for caching with appropriate cache key
      const response = await fetchStudentData<{success: boolean, appliedJobs: AppliedJob[]}>(
        `${BackendUrl}/api/student/applied_jobs`,
        StudentCacheKeys.APPLICATIONS,
        {
          expirationMs: 180000, // 3 minutes cache for applications
          fetchOptions: {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        }
      );
      
      if (response.success) {
        setAppliedJobs(response.appliedJobs);
      }
    } catch (error) {
      console.error("Error fetching applied jobs:", error);
    }
  };

  // Function to refresh data and clear cache
  const refreshData = async () => {
    setRefreshing(true);
    try {
      // Clear cache keys related to applications
      clearStudentCache(StudentCacheKeys.APPLICATIONS);
      
      // Fetch fresh data
      await fetchAppliedJobs();
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAppliedJobs();
  }, []);

  return (
    <div
      className={`w-full mx-auto h-full py-6 ${appliedJobs.length === 0 ? "hidden" : ""} my-2`}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Applied Jobs</h2>
        
        {/* Refresh Button */}
        <button
          onClick={refreshData}
          disabled={refreshing}
          className={`inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-3
            ${refreshing 
              ? 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
            }`}
          aria-label="Refresh applications data"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className={`mr-1 ${refreshing ? 'animate-spin' : ''}`}
          >
            <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
          </svg>
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
      {darkMode}
      <div className="max-h-[500px] space-y-4">
        {appliedJobs.map((appliedJob) => (
          <Card
            sx={{
              backgroundColor: "transparent",
              color: darkMode ? "white" : "black",
              border: "1px solid #E5E5E5",
              ...(darkMode && {
                border: "1px solid #06AED5",
              }),
              ":hover": {
                border: "1px solid #06AED5",
              },
            }}
            key={appliedJob._id}
            variant="outlined"
          >
            <CardContent>
              <Typography variant="h6" component="div">
                {appliedJob.app_job_id.job_title}
              </Typography>
              <Typography color="text.secondary">
                {appliedJob.app_job_id.company_name} -{" "}
                {appliedJob.app_job_id.job_location}
              </Typography>
              <Typography variant="body2" className="my-2">
                {appliedJob.app_job_id.job_description}
              </Typography>
              <Typography variant="body2">
                <strong>Salary: </strong> ₹{appliedJob.app_job_id.job_salary}
              </Typography>
              <Typography variant="body2">
                <strong>Working Hours: </strong>{" "}
                {appliedJob.app_job_id.job_timing}
              </Typography>
              <Typography variant="body2" className="my-2">
                <strong>Status: </strong> {appliedJob.app_status}
              </Typography>

              <Button
                variant="contained"
                color="primary"
                component={Link}
                href={appliedJob.app_cover_letter}
                target="_blank"
              >
                View Cover Letter
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AppliedJobs;
