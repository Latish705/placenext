'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { BackendUrl } from '@/utils/constants';

interface Job {
    _id: string;
    job_title?: string;
    job_location?: string;
    job_salary?: number;
    status: string;
    job_info?: {
        _id: string;
        job_title: string;
        job_location: string;
        job_salary: number;
    };
    college?: {
        coll_name: string;
    };
}

export default function JobsOverview() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('pending');
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchJobs(activeTab);
    }, []);

    const fetchJobs = async (status: string) => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/authentication/companyLogin'); // Fixed redirect path
                return;
            }

            const response = await axios.get(
                `${BackendUrl}/api/job/${status}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.data.success) {
                console.log('Jobs data received:', response.data.data);
                setJobs(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (status: string) => {
        setActiveTab(status);
        fetchJobs(status);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Job Management</h1>

            {/* Tab Navigation */}
            <div className="flex gap-4 mb-6">
                <button
                    onClick={() => handleTabChange('pending')}
                    className={`px-4 py-2 rounded ${
                        activeTab === 'pending' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                    }`}
                >
                    Pending Jobs
                </button>
                <button
                    onClick={() => handleTabChange('accepted')}
                    className={`px-4 py-2 rounded ${
                        activeTab === 'accepted' ? 'bg-green-500 text-white' : 'bg-gray-200'
                    }`}
                >
                    Accepted Jobs
                </button>
                <button
                    onClick={() => handleTabChange('rejected')}
                    className={`px-4 py-2 rounded ${
                        activeTab === 'rejected' ? 'bg-red-500 text-white' : 'bg-gray-200'
                    }`}
                >
                    Rejected Jobs
                </button>
            </div>

            {loading ? (
                <div className="text-center py-8">Loading...</div>
            ) : (
                <>
                    {/* Jobs Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {jobs.map((job) => (
                            <div
                                key={job._id}
                                className="border rounded-lg p-4 hover:shadow-lg cursor-pointer"
                                onClick={() => {
                                    console.log('Navigating to job:', job._id);
                                    if (job.job_info) {
                                        router.push(`/company/jobs/${job.job_info._id}`);
                                    }
                                }}
                            >
                                <h2 className="text-xl font-semibold mb-2">
                                    {job.job_info?.job_title || job.job_title || 'Untitled Job'}
                                </h2>
                                <p className="text-xs text-gray-400 mb-1">ID: {job._id}</p>
                                <p className="text-gray-600 mb-2">
                                    {job.job_info?.job_location || job.job_location || 'No location'}
                                </p>
                                <p className="text-gray-800">
                                    ₹{(job.job_info?.job_salary || job.job_salary || 0).toLocaleString()}/year
                                </p>
                                <p className="text-gray-600 mb-2">
                                    College: {job.college?.coll_name || 'No college'}
                                </p>
                                <div className={`mt-2 inline-block px-2 py-1 rounded text-sm ${
                                    job.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    job.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                    'bg-red-100 text-red-800'
                                }`}>
                                    {job.status}
                                </div>
                            </div>
                        ))}
                    </div>

                    {jobs.length === 0 && (
                        <div className="text-center text-gray-500 mt-8">
                            No {activeTab} jobs found
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
