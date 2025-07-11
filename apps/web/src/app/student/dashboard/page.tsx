"use client";

import AppliedJobs from "@/components/own/Dashboard/AppliedJobs";
import CompanyStatsChart from "@/components/own/Dashboard/CompanyStatsChart";
import JobEligibilityPieChart from "@/components/own/Dashboard/JobEligibilityPieChart";
import MainDashboard from "@/components/own/Dashboard/MainDashboard";
import RecommendedJob from "@/components/own/Dashboard/RecommendedJobs";
import { BackendUrl } from "@/utils/constants";
import {
  fetchStudentData,
  StudentCacheKeys,
  clearStudentCache
} from "@/config/services/cache_service";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import useLoadingStore from "@/store/loadingStore";
import React from "react";
import StudentStatisticsChart from "@/components/own/Dashboard/StudentStatisticsChart";
import StudentProfileWithCache from "@/components/own/Dashboard/Student/ProfileWithCache";

// Define types for our API responses
interface StudentStatisticsResponse {
  companiesCameToCollege: any[];
  appliedJobs: any[];
  success: boolean;
}

interface JobStatisticsResponse {
  success: boolean;
  eligibleCount: number;
  notEligibleCount: number;
}

export default function Dashboard() {
  const { setLoading } = useLoadingStore();

  const [companiesCameToCollege, setCompaniesCameToCollege] = useState(0);
  const [companiesAppliedTo, setCompaniesAppliedTo] = useState(0);
  const [eligibleCount, setEligibleCount] = useState(0);
  const [ineligibleCount, setIneligibleCount] = useState(0);

  const [refreshing, setRefreshing] = useState(false);
  
  // Function to fetch dashboard data with proper caching
  const fetchData = async (forceRefresh = false) => {
    try {
      setLoading(true);
      if (forceRefresh) {
        setRefreshing(true);
        // Clear all relevant dashboard caches when forcing refresh
        clearStudentCache(StudentCacheKeys.DASHBOARD_STATS);
        clearStudentCache(StudentCacheKeys.ELIGIBILITY);
        clearStudentCache(StudentCacheKeys.APPLICATIONS);
      }
      
      // Fetch Student Statistics using our cache-aware fetcher
      const statisticsRes = await fetchStudentData<StudentStatisticsResponse>(
        `${BackendUrl}/api/student/statistics`,
        StudentCacheKeys.DASHBOARD_STATS,
        {
          expirationMs: 300000, // 5 minutes cache for dashboard stats
          fetchOptions: {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        }
      );
      
      if (statisticsRes && statisticsRes.success) {
        setCompaniesCameToCollege(
          statisticsRes.companiesCameToCollege?.length || 0
        );
        setCompaniesAppliedTo(statisticsRes.appliedJobs?.length || 0);
      }

      // Fetch Job Statistics with cache
      const jobStatisticsRes = await fetchStudentData<JobStatisticsResponse>(
        `${BackendUrl}/api/student/job_statistics`,
        StudentCacheKeys.ELIGIBILITY,
        {
          expirationMs: 1800000, // 30 minutes cache for eligibility data
          fetchOptions: {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        }
      );
      
      if (jobStatisticsRes && jobStatisticsRes.success) {
        setEligibleCount(jobStatisticsRes.eligibleCount);
        setIneligibleCount(jobStatisticsRes.notEligibleCount);
      }

      // Fetch Applied Jobs with shorter cache time as these change more frequently
      await fetchStudentData(
        `${BackendUrl}/api/student/applied_jobs`,
        StudentCacheKeys.APPLICATIONS,
        {
          expirationMs: 60000, // 1 minute cache for applications
          fetchOptions: {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        }
      );
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Function to refresh all dashboard data
  const refreshDashboardData = async () => {
    try {
      await fetchData(true);
      toast.success("Dashboard data refreshed");
    } catch (error) {
      console.error("Error refreshing dashboard data:", error);
      toast.error("Failed to refresh dashboard data");
    }
  };

  useEffect(() => {
    fetchData();
  }, [setLoading]);

  return (
    <div className="mt-20 h-full w-full scroll-smooth p-10 flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Student Dashboard</h1>
        <button
          onClick={refreshDashboardData}
          disabled={refreshing}
          className={`px-4 py-2 rounded-md flex items-center gap-2 ${
            refreshing 
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {refreshing ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Refreshing...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh Data
            </>
          )}
        </button>
      </div>
      
      <MainDashboard />
      
      <div className="flex flex-col md:flex-row h-full items-center justify-between">
        <CompanyStatsChart
          companiesCame={companiesCameToCollege}
          companiesApplied={companiesAppliedTo}
        />
        <JobEligibilityPieChart
          eligibleCount={eligibleCount}
          notEligibleCount={ineligibleCount}
        />
      </div>
      
      <AppliedJobs />
      <RecommendedJob />
      
      <div className="container mx-auto p-4 space-y-8">
        {/* Use the cached profile component */}
        <StudentProfileWithCache />
        
        {/* Already updated statistics chart */}
        <StudentStatisticsChart />
        
        {/* Other dashboard components... */}
      </div>
    </div>
  )}