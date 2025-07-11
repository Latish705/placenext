"use client";

import { BackendUrl } from "@/utils/constants";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface DashboardStats {
  totalJobs: number;
  pendingJobs: number;
  acceptedJobs: number;
  rejectedJobs: number;
  totalApplications: number;
}

interface RecentJob {
  _id: string;
  job_title: string;
  job_location: string;
  status?: string;
  created_at?: string;
}

export default function CompanyDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalJobs: 0,
    pendingJobs: 0,
    acceptedJobs: 0,
    rejectedJobs: 0,
    totalApplications: 0,
  });
  const [recentJobs, setRecentJobs] = useState<RecentJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/authentication/companyLogin");
        return;
      }

      // Fetch different types of jobs with error handling for each
      const fetchJobsByStatus = async (status: string) => {
        try {
          const response = await axios.get(`${BackendUrl}/api/job/${status}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          return response.data.success ? response.data.data : [];
        } catch (error) {
          console.error(`Error fetching ${status} jobs:`, error);
          return [];
        }
      };

      const [pendingJobs, acceptedJobs, rejectedJobs] = await Promise.all([
        fetchJobsByStatus('pending'),
        fetchJobsByStatus('accepted'),
        fetchJobsByStatus('rejected')
      ]);

      setStats({
        totalJobs: pendingJobs.length + acceptedJobs.length + rejectedJobs.length,
        pendingJobs: pendingJobs.length,
        acceptedJobs: acceptedJobs.length,
        rejectedJobs: rejectedJobs.length,
        totalApplications: 0, // This would need a separate API call
      });

     const extractRecentJobs = (jobs: any[]) => {
  return jobs
    .filter(job => job.job_info) // only if job_info exists
    .slice(0, 5)
    .map(job => ({
      _id: job.job_info._id,
      job_title: job.job_info.job_title,
      job_location: job.job_info.job_location,
      status: job.status,
      created_at: job.job_info.created_at
    }));
};

if (pendingJobs.length > 0) {
  setRecentJobs(extractRecentJobs(pendingJobs));
} else if (acceptedJobs.length > 0) {
  setRecentJobs(extractRecentJobs(acceptedJobs));
} else if (rejectedJobs.length > 0) {
  setRecentJobs(extractRecentJobs(rejectedJobs));
}

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      // Set default empty state
      setStats({
        totalJobs: 0,
        pendingJobs: 0,
        acceptedJobs: 0,
        rejectedJobs: 0,
        totalApplications: 0,
      });
      setRecentJobs([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  console.log("job:- ",recentJobs);
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Company Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <h3 className="text-lg font-semibold text-gray-700">Total Jobs</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.totalJobs}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
          <h3 className="text-lg font-semibold text-gray-700">Pending Jobs</h3>
          <p className="text-3xl font-bold text-yellow-600">{stats.pendingJobs}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <h3 className="text-lg font-semibold text-gray-700">Accepted Jobs</h3>
          <p className="text-3xl font-bold text-green-600">{stats.acceptedJobs}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
          <h3 className="text-lg font-semibold text-gray-700">Rejected Jobs</h3>
          <p className="text-3xl font-bold text-red-600">{stats.rejectedJobs}</p>
        </div>
      </div>

      {/* Recent Jobs */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Jobs</h2>
        {recentJobs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Job Title</th>
                  <th className="text-left py-2">Location</th>
                  <th className="text-left py-2">Status</th>
                  <th className="text-left py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentJobs.map((job) => (
                  <tr key={job._id} className="border-b hover:bg-gray-50">
                    <td className="py-3">{job.job_title}</td>
                    <td className="py-3">{job.job_location}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded text-sm ${
                        job.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        job.status === 'accepted' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {job.status ? job.status.charAt(0).toUpperCase() + job.status.slice(1) : 'Unknown'}
                      </span>
                    </td>
                    <td className="py-3">
                      <button
                        onClick={() => router.push(`/company/jobs/${job._id}`)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No recent jobs found.</p>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          onClick={() => router.push('/company/job_application')}
          className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <h3 className="font-semibold">Post New Job</h3>
          <p className="text-sm opacity-90">Create a new job posting</p>
        </button>
        
        <button
          onClick={() => router.push('/company/jobs')}
          className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition-colors"
        >
          <h3 className="font-semibold">View All Jobs</h3>
          <p className="text-sm opacity-90">Manage your job postings</p>
        </button>
        
        <button
          onClick={() => router.push('/company/application')}
          className="bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700 transition-colors"
        >
          <h3 className="font-semibold">Company Profile</h3>
          <p className="text-sm opacity-90">Update company information</p>
        </button>
      </div>
    </div>
  );
}
