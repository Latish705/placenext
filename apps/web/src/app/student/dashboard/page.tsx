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
      
        return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Welcome Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome back, {localStorage.getItem("name")?.split(" ")[0] || "Student"}! 👋
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Here's what's happening with your placement journey today.
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
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Companies Visited</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{companiesCameToCollege}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Applications Sent</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{companiesAppliedTo}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Eligible Jobs</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{eligibleCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Ineligible Jobs</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{ineligibleCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Components */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Component */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <StudentProfileWithCache />
          </div>
          
          {/* Statistics Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <StudentStatisticsChart />
          </div>
        </div>

        {/* Additional Dashboard Components */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <MainDashboard />
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <AppliedJobs />
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <RecommendedJob />
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <JobEligibilityPieChart eligibleCount={eligibleCount} ineligibleCount={ineligibleCount} />
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <CompanyStatsChart />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
    </div>
  )}