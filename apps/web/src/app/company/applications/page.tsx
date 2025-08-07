"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { BackendUrl } from '@/utils/constants';

interface Student {
    _id: string;
    name: string;
    email: string;
    student_id: string;
    division?: {
        dept_name: string;
        year: string;
    };
    cgpi?: number;
    phone?: string;
    resume_url?: string;
}

interface Application {
    _id: string;
    student: Student;
    job: {
        _id: string;
        job_title: string;
        job_location: string;
    };
    status: 'pending' | 'accepted' | 'rejected';
    applied_at: string;
    current_round?: {
        round_type: string;
        round_number: number;
    };
}

export default function CompanyApplications() {
    const router = useRouter();
    const [applications, setApplications] = useState<Application[]>([]);
    const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchApplications();
    }, [fetchApplications]);

    useEffect(() => {
        filterApplications();
    }, [filterApplications]);

    const fetchApplications = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/authentication/companyLogin');
                return;
            }

            const response = await axios.get(
                `${BackendUrl}/api/application/company-applications`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.data.success) {
                setApplications(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching applications:', error);
            // For now, let's set some mock data to demonstrate the UI
            const mockApplications: Application[] = [
                {
                    _id: '1',
                    student: {
                        _id: 'student1',
                        name: 'John Doe',
                        email: 'john.doe@example.com',
                        student_id: 'STU001',
                        division: {
                            dept_name: 'Computer Science',
                            year: '2024'
                        },
                        cgpi: 8.5,
                        phone: '+1234567890'
                    },
                    job: {
                        _id: 'job1',
                        job_title: 'Software Engineer',
                        job_location: 'New York'
                    },
                    status: 'pending',
                    applied_at: new Date().toISOString(),
                    current_round: {
                        round_type: 'Technical Interview',
                        round_number: 1
                    }
                },
                {
                    _id: '2',
                    student: {
                        _id: 'student2',
                        name: 'Jane Smith',
                        email: 'jane.smith@example.com',
                        student_id: 'STU002',
                        division: {
                            dept_name: 'Information Technology',
                            year: '2024'
                        },
                        cgpi: 9.0,
                        phone: '+1234567891'
                    },
                    job: {
                        _id: 'job2',
                        job_title: 'Data Analyst',
                        job_location: 'San Francisco'
                    },
                    status: 'accepted',
                    applied_at: new Date(Date.now() - 86400000).toISOString()
                }
            ];
            setApplications(mockApplications);
        } finally {
            setLoading(false);
        }
    }, [router]);

    const filterApplications = useCallback(() => {
        let filtered = applications;

        if (activeFilter !== 'all') {
            filtered = filtered.filter(app => app.status === activeFilter);
        }

        if (searchTerm) {
            filtered = filtered.filter(app => 
                app.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                app.student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                app.job.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                app.student.student_id.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredApplications(filtered);
    }, [applications, activeFilter, searchTerm]);

    const handleApplicationAction = async (applicationId: string, action: 'accept' | 'reject') => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await axios.patch(
                `${BackendUrl}/api/application/${applicationId}/${action}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.data.success) {
                // Update local state
                setApplications(prev => 
                    prev.map(app => 
                        app._id === applicationId 
                            ? { ...app, status: action === 'accept' ? 'accepted' : 'rejected' }
                            : app
                    )
                );
                alert(`Application ${action}ed successfully!`);
            }
        } catch (error) {
            console.error(`Error ${action}ing application:`, error);
            alert(`Failed to ${action} application`);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto p-4">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
                    <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-24 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Student Applications</h1>

            {/* Search and Filter */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Search by name, email, job title, or student ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="flex gap-2">
                    {['all', 'pending', 'accepted', 'rejected'].map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter as typeof activeFilter)}
                            className={`px-4 py-2 rounded capitalize ${
                                activeFilter === filter
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 hover:bg-gray-300'
                            }`}
                        >
                            {filter} ({applications.filter(app => filter === 'all' || app.status === filter).length})
                        </button>
                    ))}
                </div>
            </div>

            {/* Applications List */}
            <div className="space-y-4">
                {filteredApplications.length > 0 ? (
                    filteredApplications.map((application) => (
                        <div
                            key={application._id}
                            className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow"
                        >
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-800">
                                                {application.student.name}
                                            </h3>
                                            <p className="text-gray-600">
                                                {application.student.email} | ID: {application.student.student_id}
                                            </p>
                                            {application.student.division && (
                                                <p className="text-gray-600">
                                                    {application.student.division.dept_name} - {application.student.division.year}
                                                </p>
                                            )}
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                                            application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                            application.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <h4 className="font-medium text-gray-700">Applied for:</h4>
                                            <p className="text-gray-600">{application.job.job_title}</p>
                                            <p className="text-gray-500 text-sm">📍 {application.job.job_location}</p>
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-700">Application Details:</h4>
                                            <p className="text-gray-600">
                                                Applied: {new Date(application.applied_at).toLocaleDateString()}
                                            </p>
                                            {application.student.cgpi && (
                                                <p className="text-gray-600">CGPI: {application.student.cgpi}</p>
                                            )}
                                            {application.current_round && (
                                                <p className="text-gray-600">
                                                    Current Round: {application.current_round.round_type} (Round {application.current_round.round_number})
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {application.student.phone && (
                                        <p className="text-gray-600 mb-4">
                                            📞 {application.student.phone}
                                        </p>
                                    )}
                                </div>

                                <div className="flex flex-col gap-2 min-w-[200px]">
                                    <button
                                        onClick={() => router.push(`/company/jobs/${application.job._id}`)}
                                        className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                    >
                                        View Job Details
                                    </button>
                                    
                                    {application.student.resume_url && (
                                        <a
                                            href={application.student.resume_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-center"
                                        >
                                            View Resume
                                        </a>
                                    )}

                                    {application.status === 'pending' && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleApplicationAction(application._id, 'accept')}
                                                className="flex-1 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
                                            >
                                                Accept
                                            </button>
                                            <button
                                                onClick={() => handleApplicationAction(application._id, 'reject')}
                                                className="flex-1 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                            <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
                        <p className="text-gray-500">
                            {searchTerm || activeFilter !== 'all' 
                                ? 'Try adjusting your filters or search terms.'
                                : 'Students haven\'t applied to your jobs yet.'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
