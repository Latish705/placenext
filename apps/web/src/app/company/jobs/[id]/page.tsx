'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { BackendUrl } from '@/utils/constants';

interface Division {
  _id: string;
  dept_name: string;
}

interface Student {
  student_id: string;
  name: string;
  division: Division;
  selected?: boolean;
}

interface Round {
  _id: string;
  round_type: string;
  round_number: number;
  student_list: Student[];
}

interface JobDetail {
  _id: string;
  job_title: string;
  job_description: string;
  job_location: string;
  job_salary: number;
  job_type?: string;
  job_requirements?: string[];
  min_CGPI?: number;
  yr_of_exp_req?: number;
  branch_allowed?: string[];
  status: string;
  rounds: Round[];
}

export default function JobDetail() {
  const params = useParams();
  const router = useRouter();
  const [job, setJob] = useState<JobDetail | null>(null);
  const [activeRound, setActiveRound] = useState<Round | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchJobDetails();
  }, [params.id]);

  const fetchJobDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/authentication/companyLogin');
        return;
      }

      console.log('Fetching job details for ID:', params.id);
      const response = await axios.get(
        `${BackendUrl}/api/job/getjobdetail/${params.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Job details response:', response.data);

      if (response.data.success) {
        setJob(response.data.data);
        if (response.data.data.rounds.length > 0) {
          setActiveRound(response.data.data.rounds[0]);
        }
      } else {
        setError('Failed to load job details');
      }
    } catch (err: any) {
      console.error('Error fetching job details:', err);
      setError(err.response?.data?.message || 'Failed to fetch job details');
    } finally {
      setLoading(false);
    }
  };

  const handlePromoteStudent = async (roundId: string, studentId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await axios.post(
        `${BackendUrl}/api/round/promote-student`,
        {
          round_id: roundId,
          student_id: studentId
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        // Refresh job details to get updated rounds
        await fetchJobDetails();
        alert('Student promoted to next round successfully!');
      } else {
        alert(response.data.message || 'Failed to promote student');
      }
    } catch (err: any) {
      console.error('Error promoting student:', err);
      alert(err.response?.data?.message || 'Failed to promote student');
    }
  };

  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  if (error || !job) {
    return <div className="container mx-auto p-4 text-red-500">{error || 'Job not found'}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="mb-4 text-blue-600 hover:text-blue-800 flex items-center gap-2"
        >
          ← Back to Jobs
        </button>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{job.job_title}</h1>
              <div className="flex flex-wrap gap-4 text-gray-600">
                <span className="flex items-center gap-1">
                  📍 {job.job_location}
                </span>
                <span className="flex items-center gap-1">
                  💰 ₹{job.job_salary.toLocaleString()}/year
                </span>
                {job.job_type && (
                  <span className="flex items-center gap-1">
                    🏢 {job.job_type}
                  </span>
                )}
                {job.yr_of_exp_req !== undefined && (
                  <span className="flex items-center gap-1">
                    👔 {job.yr_of_exp_req} years experience
                  </span>
                )}
              </div>
            </div>
            
            <div className={`px-4 py-2 rounded-full text-sm font-medium ${
              job.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              job.status === 'accepted' ? 'bg-green-100 text-green-800' :
              'bg-red-100 text-red-800'
            }`}>
              {/* {job.status.charAt(0).toUpperCase() + job.status.slice(1)} */}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Job Description</h3>
              <p className="text-gray-600 leading-relaxed">{job.job_description}</p>
            </div>
            
            <div className="space-y-4">
              {job.job_requirements && job.job_requirements.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Requirements:</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    {job.job_requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {job.branch_allowed && job.branch_allowed.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Allowed Branches:</h4>
                  <div className="flex flex-wrap gap-2">
                    {job.branch_allowed.map((branch, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                        {branch}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {job.min_CGPI && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-1">Minimum CGPI:</h4>
                  <p className="text-gray-600">{job.min_CGPI}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Interview Rounds Management</h2>
        
        {job.rounds && job.rounds.length > 0 ? (
          <>
            {/* Round Navigation */}
            <div className="flex flex-wrap gap-2 mb-6">
              {job.rounds.map((round) => (
                <button
                  key={round._id}
                  onClick={() => setActiveRound(round)}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    activeRound?._id === round._id 
                      ? 'bg-blue-500 text-white border-blue-500' 
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-center">
                    <div className="font-medium">{round.round_type}</div>
                    <div className="text-xs opacity-75">Round {round.round_number}</div>
                  </div>
                </button>
              ))}
            </div>

            {/* Student List */}
            {activeRound && (
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  Students in {activeRound.round_type} (Round {activeRound.round_number})
                </h3>
                
                {activeRound.student_list && activeRound.student_list.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="border border-gray-200 p-3 text-left font-medium text-gray-700">Student Name</th>
                          <th className="border border-gray-200 p-3 text-left font-medium text-gray-700">Department</th>
                          <th className="border border-gray-200 p-3 text-left font-medium text-gray-700">Status</th>
                          <th className="border border-gray-200 p-3 text-left font-medium text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeRound.student_list.map((student) => (
                          <tr key={student.student_id} className="hover:bg-gray-50">
                            <td className="border border-gray-200 p-3">{student.name}</td>
                            <td className="border border-gray-200 p-3">{student.division.dept_name}</td>
                            <td className="border border-gray-200 p-3">
                              <span className={`px-2 py-1 rounded text-sm ${
                                student.selected 
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {student.selected ? 'Promoted' : 'Pending'}
                              </span>
                            </td>
                            <td className="border border-gray-200 p-3">
                              <button
                                className={`px-4 py-2 rounded transition-colors ${
                                  student.selected 
                                    ? 'bg-gray-400 text-white cursor-not-allowed'
                                    : 'bg-blue-500 text-white hover:bg-blue-600'
                                }`}
                                onClick={() => handlePromoteStudent(activeRound._id, student.student_id)}
                                disabled={student.selected}
                              >
                                {student.selected ? 'Already Promoted' : 'Promote to Next Round'}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <div className="mb-4">
                      <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No students in this round</h4>
                    <p className="text-gray-500">Students will appear here once they apply and are promoted to this round.</p>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <div className="mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No interview rounds configured</h3>
            <p className="text-gray-500 mb-4">Set up interview rounds to manage the recruitment process for this job.</p>
            <button
              onClick={() => router.push(`/company/job_application`)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Create New Job with Rounds
            </button>
          </div>
        )}
      </div>
    </div>
  );
}