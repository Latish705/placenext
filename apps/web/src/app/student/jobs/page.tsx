"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BackendUrl } from "@/utils/constants";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import useLoadingStore from "@/store/loadingStore";
import { fetchStudentData, StudentCacheKeys, clearStudentCache } from "@/config/services/cache_service";

interface Job {
  _id: string;
  job_title: string;
  company_name: string;
  company_logo?: string;
  job_description: string;
  job_location: string;
  job_salary: number;
  job_type: string;
  isEligible?: boolean;
}

export default function JobListingPage() {
  const router = useRouter();
  const { setLoading } = useLoadingStore();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // Function to fetch jobs with caching
  const fetchJobs = async () => {
    try {
      setLoading(true);
      
      const jobsData = await fetchStudentData<{success: boolean, jobs: Job[]}>(
        `${BackendUrl}/api/student/get_all_jobs`,
        StudentCacheKeys.JOBS,
        {
          expirationMs: 180000, // 3 minutes cache for job listings
          fetchOptions: {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        }
      );
      
      if (jobsData.success) {
        setJobs(jobsData.jobs);
      } else {
        toast.error("Failed to load job listings");
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("An error occurred while loading jobs");
    } finally {
      setLoading(false);
    }
  };
  
  // Function to refresh data and clear cache
  const refreshData = async () => {
    setRefreshing(true);
    try {
      // Clear cache for jobs
      clearStudentCache(StudentCacheKeys.JOBS);
      
      // Fetch fresh data
      await fetchJobs();
      toast.success("Job listings refreshed");
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  });

  return (
    <div className="container mx-auto p-4 pt-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Available Jobs</h1>
        
        {/* Refresh Button */}
        <button
          onClick={refreshData}
          disabled={refreshing}
          className={`inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-3
            ${refreshing 
              ? 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
            }`}
          aria-label="Refresh job listings"
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <div
              key={job._id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm overflow-hidden"
            >
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                      
                      <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-3">
                        <span className="text-lg font-medium text-gray-500 dark:text-gray-400">
                          {job.company_name.charAt(0).toUpperCase()}
                        </span>
                      </div>

                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {job.job_title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {job.company_name}
                      </p>
                    </div>
                  </div>
                  <span 
                    className={`text-xs font-medium px-2.5 py-0.5 rounded-full 
                      ${job.isEligible 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}
                  >
                    {job.isEligible ? 'Eligible' : 'Not Eligible'}
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm">
                    <svg className="w-4 h-4 mr-1 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    <span className="text-gray-600 dark:text-gray-300">{job.job_location}</span>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <svg className="w-4 h-4 mr-1 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span className="text-gray-600 dark:text-gray-300">₹{job.job_salary.toLocaleString()}/year</span>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <svg className="w-4 h-4 mr-1 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                    <span className="text-gray-600 dark:text-gray-300">{job.job_type}</span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                  {job.job_description}
                </p>

                <Button 
                  className="w-full" 
                  onClick={() => router.push(`/student/jobs/${job._id}`)}
                  disabled={!job.isEligible}
                >
                  {job.isEligible ? 'View Job' : 'Not Eligible'}
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full flex justify-center items-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-center">
              No jobs available at this time. Check back later!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
