"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";

// State Management
import useLoadingStore from "@/store/loadingStore";

// Services & Utils
import { BackendUrl } from "@/utils/constants";
import {
  fetchStudentData,
  StudentCacheKeys,
  clearStudentCache,
} from "@/config/services/cache_service";

// Child Components
import AppliedJobs from "@/components/own/Dashboard/AppliedJobs";
import CompanyStatsChart from "@/components/own/Dashboard/CompanyStatsChart";
import JobEligibilityPieChart from "@/components/own/Dashboard/JobEligibilityPieChart";
import MainDashboard from "@/components/own/Dashboard/MainDashboard";
import RecommendedJob from "@/components/own/Dashboard/RecommendedJobs";
import StudentStatisticsChart from "@/components/own/Dashboard/StudentStatisticsChart";
import StudentProfileWithCache from "@/components/own/Dashboard/Student/ProfileWithCache";

// Define TypeScript types for API responses
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
  // State Management
  const { setLoading } = useLoadingStore();
  const [companiesCameToCollege, setCompaniesCameToCollege] = useState(0);
  const [companiesAppliedTo, setCompaniesAppliedTo] = useState(0);
  const [eligibleCount, setEligibleCount] = useState(0);
  const [ineligibleCount, setIneligibleCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  
  // ADDED: State to safely hold the user's name from localStorage
  const [userName, setUserName] = useState<string>("Student");

  // Data fetching logic wrapped in useCallback for performance
  const fetchData = useCallback(async (forceRefresh = false) => {
    // This check prevents any data fetching attempts on the server
    if (typeof window === "undefined") {
      return;
    }
    
    setLoading(true);
    if (forceRefresh) {
      setRefreshing(true);
      clearStudentCache(StudentCacheKeys.DASHBOARD_STATS);
      clearStudentCache(StudentCacheKeys.ELIGIBILITY);
    }
    
    const token = localStorage.getItem("token"); // This is now safe to call

    try {
      // Fetch statistics in parallel for better performance
      const [statisticsRes, jobStatisticsRes] = await Promise.all([
        fetchStudentData<StudentStatisticsResponse>(
          `${BackendUrl}/api/student/statistics`,
          StudentCacheKeys.DASHBOARD_STATS,
          {
            expirationMs: 300000, // 5 minutes cache
            fetchOptions: { headers: { Authorization: `Bearer ${token}` } },
          }
        ),
        fetchStudentData<JobStatisticsResponse>(
          `${BackendUrl}/api/student/job_statistics`,
          StudentCacheKeys.ELIGIBILITY,
          {
            expirationMs: 1800000, // 30 minutes cache
            fetchOptions: { headers: { Authorization: `Bearer ${token}` } },
          }
        ),
      ]);

      if (statisticsRes?.success) {
        setCompaniesCameToCollege(statisticsRes.companiesCameToCollege?.length || 0);
        setCompaniesAppliedTo(statisticsRes.appliedJobs?.length || 0);
      }

      if (jobStatisticsRes?.success) {
        setEligibleCount(jobStatisticsRes.eligibleCount);
        setIneligibleCount(jobStatisticsRes.notEligibleCount);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data. Please try refreshing.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [setLoading]);

  // Handler to manually refresh data
  const refreshDashboardData = useCallback(async () => {
    toast.info("Refreshing dashboard data...");
    await fetchData(true);
  }, [fetchData]);

  // This useEffect hook runs only on the client-side after the component mounts
  useEffect(() => {
    // Safely get the user's name from localStorage and update the state
    const storedName = localStorage.getItem("name");
    if (storedName) {
      setUserName(storedName.split(" ")[0]);
    }
    
    // Fetch initial data for the dashboard
    fetchData();
  }, [fetchData]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 lg:p-6 mt-14">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Welcome Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {/* FIXED: Use the 'userName' state here instead of directly calling localStorage */}
                Welcome back, {userName}! 👋
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Here&apos;s what&apos;s happening with your placement journey today.
              </p>
            </div>
            <button
              onClick={refreshDashboardData}
              disabled={refreshing}
              className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
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
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh Data
                </>
              )}
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Companies Visited Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex items-center">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                </div>
                <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Companies Visited</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{companiesCameToCollege}</p>
                </div>
            </div>
            {/* Applications Sent Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex items-center">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Applications Sent</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{companiesAppliedTo}</p>
                </div>
            </div>
            {/* Eligible Jobs Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex items-center">
                <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Eligible Jobs</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{eligibleCount}</p>
                </div>
            </div>
            {/* Ineligible Jobs Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex items-center">
                <div className="flex-shrink-0 w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Ineligible Jobs</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{ineligibleCount}</p>
                </div>
            </div>
        </div>

        {/* Main Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <StudentProfileWithCache />
            <AppliedJobs />
          </div>
          <div className="space-y-6">
            <JobEligibilityPieChart eligibleCount={eligibleCount} ineligibleCount={ineligibleCount} />
            <RecommendedJob />
          </div>
        </div>

      </div>
    </div>
  );
}