"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { BackendUrl } from "@/utils/constants";
import { useRouter } from 'next/navigation';

interface Company {
  _id: string;
  comp_name: string;
  [key: string]: any;
}

interface JobInfo {
  _id: string;
  job_title: string;
  company_name: Company;
  job_salary: number;
  [key: string]: any;
}

interface Job {
  _id: string;
  job_info: JobInfo;
  status: string;
  [key: string]: any;
}

const statusColors: Record<string, string> = {
  accepted: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  pending: "bg-yellow-100 text-yellow-700",
};

const statusLabels: Record<string, string> = {
  accepted: "Accepted",
  rejected: "Rejected",
  pending: "Pending",
};

const filters = [
  { label: "All", value: "all" },
  { label: "Accepted", value: "accepted" },
  { label: "Rejected", value: "rejected" },
  { label: "Pending", value: "pending" },
];

export default function FacultyJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchJobs();
  }, []);

  // Helper to get token
  const getToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  };

  // Fetch all jobs (approved + pending + rejected)
  const fetchJobs = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const res = await axios.get(`${BackendUrl}/api/college/jobs/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Jobs fetched all:", res.data.jobs);
      setJobs(res.data.jobs || []);
    } catch (e) {
      setJobs([]);
    }
    setLoading(false);
  };

  // Accept/Reject job
  const handleAction = async (jobId: string, action: "approve" | "reject") => {
    setActionLoading(jobId + action);
    try {
      console.log(`Handling action: ${action} for jobId: ${jobId}`);
      const token = getToken();
      const res = await axios.post(
        `${BackendUrl}/api/college/jobs/manage`,
        { jobId, actions: action },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Action response:", res.data);
      fetchJobs();
    } catch (e) {
      // handle error
      console.error(`Error handling action ${action} for jobId ${jobId}:`, e);
    }
    setActionLoading(null);
  };

  const filteredJobs =
    filter === "all"
      ? jobs
      : jobs.filter((job) => job.status === filter);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Jobs</h1>
      <div className="flex gap-2 mb-6">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              filter === f.value
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
      {loading ? (
        <div>Loading jobs...</div>
      ) : filteredJobs.length === 0 ? (
        <div>No jobs found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            
            
          <button onClick={()=>{router.push(`/college/jobs/${job.job_info._id}`)}}>
            <div
              key={job._id}
              className="bg-white rounded-lg shadow p-6 flex flex-col gap-2"
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">{job.job_info.job_title}</h2>
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    statusColors[job.status] || "bg-gray-100 text-gray-700"
                  }`}
                >
                  {statusLabels[job.status] || job.status}
                </span>
              </div>
              {/* <div className="text-gray-600">Company: {job.job_info.company_name.comp_name}</div> */}
              <div className="text-gray-600">Salary: {job.job_info.job_salary}</div>
              <div className="flex gap-2 mt-2">
                <button
                  disabled={job.status === "accepted" || actionLoading === job._id + "approve"}
                  onClick={() => handleAction(job._id, "approve")}
                  className={`px-3 py-1 rounded bg-green-500 text-white disabled:bg-green-200 disabled:cursor-not-allowed`}
                >
                  {actionLoading === job._id + "approve" ? "Accepting..." : "Accept"}
                </button>
                <button
                  disabled={job.status === "rejected" || actionLoading === job._id + "reject"}
                  onClick={() => handleAction(job._id, "reject")}
                  className={`px-3 py-1 rounded bg-red-500 text-white disabled:bg-red-200 disabled:cursor-not-allowed`}
                >
                  {actionLoading === job._id + "reject" ? "Rejecting..." : "Reject"}
                </button>
              </div>
            </div>
          </button>
          ))}
        </div>
      )}
    </div>
  );
}
