'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { BackendUrl } from '@/utils/constants';
import React, { useState as useStateModal } from 'react';

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

interface Offer {
  _id: string;
  studentId: {
    _id: string;
    stud_name: string;
    stud_email: string;
    stud_department?: { dept_name: string };
  };
  status: string;
  package: number;
  createdAt: string;
}

interface OfferDetails {
  _id: string;
  jobId: any;
  studentId: any;
  status: string;
  package: number;
  createdAt: string;
  [key: string]: any;
}

export default function JobDetail() {
  const params = useParams();
  const router = useRouter();
  const [job, setJob] = useState<JobDetail | null>(null);
  const [activeRound, setActiveRound] = useState<Round | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [offersLoading, setOffersLoading] = useState(false);
  const [offerDetails, setOfferDetails] = useState<OfferDetails | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [offerFilter, setOfferFilter] = useState<'all' | 'accepted' | 'rejected' | 'offered'>('all');

  useEffect(() => {
    fetchJobDetails();
    fetchOffers(offerFilter);
  }, [params.id, offerFilter]);

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

  // Fetch offers for this job
  const fetchOffers = async (filter: 'all' | 'accepted' | 'rejected' | 'offered' = 'all') => {
    try {
      setOffersLoading(true);
      const token = localStorage.getItem('token');
      if (!token) return;

      let url = `${BackendUrl}/api/company/offer/list`;
      let data: any = { jobId: params.id };

      if (filter === 'accepted') url = `${BackendUrl}/api/company/offer/accepted`;
      else if (filter === 'rejected') url = `${BackendUrl}/api/company/offer/rejected`;
      else if (filter === 'offered') url = `${BackendUrl}/api/company/offer/offered`;

      const response = await axios.post(url, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.data.success) {
        setOffers(response.data.data);
      }
    } catch (err) {
      setOffers([]);
    } finally {
      setOffersLoading(false);
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

  const handleSendOffer = async (jobId: string, studentId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }
      const response = await axios.post(
        `${BackendUrl}/api/company/createOffer`,
        { jobId, studentId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.data.success) {
        alert('Offer letter sent successfully!');
      } else {
        alert(response.data.message || 'Failed to send offer letter');
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to send offer letter');
    }
  };

  // Fetch offer details by offerId
  const handleViewOfferDetails = async (offerId: string) => {
    try {
      setDetailsLoading(true);
      setShowModal(true);
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }
      const response = await axios.post(
        `${BackendUrl}/api/company/offer`,
        { offerId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.data.success) {
        setOfferDetails(response.data.data);
      } else {
        setOfferDetails(null);
      }
    } catch (err) {
      setOfferDetails(null);
    } finally {
      setDetailsLoading(false);
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
                          console.log("student:- ",student),
                          <tr key={student.student_id} className="hover:bg-gray-50">
                            <td className="border border-gray-200 p-3">{student.name}</td>
                            {/* <td className="border border-gray-200 p-3">{student.division.dept_name}</td> */}
                            <td className="border border-gray-200 p-3">
                              <span className={`px-2 py-1 rounded text-sm ${
                                student.selected 
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {student.selected ? 'Promoted' : 'Pending'}
                              </span>
                            </td>
                            <td className="border border-gray-200 p-3 flex gap-2">
                              {activeRound._id !== job.rounds[job.rounds.length - 1]._id ? (
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
                              ) : (
                                <button
                                  className="px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700"
                                  onClick={() => handleSendOffer(job._id, student.student_id)}
                                >
                                  Send Offer Letter
                                </button>
                              )}
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

      {/* Offers List Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mt-8">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Offers Given</h2>
        
        {/* Offer Filter Buttons */}
        <div className="flex gap-2 mb-4">
          {/* <button
            className={`px-3 py-1 rounded ${offerFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setOfferFilter('all')}
          >
            All
          </button> */}
          <button
            className={`px-3 py-1 rounded ${offerFilter === 'accepted' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setOfferFilter('accepted')}
          >
            Accepted
          </button>
          <button
            className={`px-3 py-1 rounded ${offerFilter === 'rejected' ? 'bg-red-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setOfferFilter('rejected')}
          >
            Rejected
          </button>
          <button
            className={`px-3 py-1 rounded ${offerFilter === 'offered' ? 'bg-blue-400 text-white' : 'bg-gray-200'}`}
            onClick={() => setOfferFilter('offered')}
          >
            Offered
          </button>
        </div>

        {offersLoading ? (
          <div>Loading offers...</div>
        ) : offers.length === 0 ? (
          <div className="text-gray-500">No offers have been given for this job yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border border-gray-200 p-3 text-left font-medium text-gray-700">Student Name</th>
                  <th className="border border-gray-200 p-3 text-left font-medium text-gray-700">Email</th>
                  <th className="border border-gray-200 p-3 text-left font-medium text-gray-700">Department</th>
                  <th className="border border-gray-200 p-3 text-left font-medium text-gray-700">Package</th>
                  <th className="border border-gray-200 p-3 text-left font-medium text-gray-700">Status</th>
                  <th className="border border-gray-200 p-3 text-left font-medium text-gray-700">Offered On</th>
                  <th className="border border-gray-200 p-3 text-left font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {offers.map((offer) => (
                  <tr key={offer._id} className="hover:bg-gray-50">
                    <td className="border border-gray-200 p-3">{offer.studentId?.stud_name || '-'}</td>
                    <td className="border border-gray-200 p-3">{offer.studentId?.stud_email || '-'}</td>
                    <td className="border border-gray-200 p-3">{offer.studentId?.stud_department?.dept_name || '-'}</td>
                    <td className="border border-gray-200 p-3">₹{offer.package?.toLocaleString() || '-'}</td>
                    <td className="border border-gray-200 p-3">
                      <span className={`px-2 py-1 rounded text-sm ${
                        offer.status === 'offered'
                          ? 'bg-blue-100 text-blue-800'
                          : offer.status === 'accepted'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
                      </span>
                    </td>
                    <td className="border border-gray-200 p-3">
                      {offer.createdAt ? new Date(offer.createdAt).toLocaleString() : '-'}
                    </td>
                    <td className="border border-gray-200 p-3">
                      <button
                        className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
                        onClick={() => handleViewOfferDetails(offer._id)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Offer Details Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>
            <h3 className="text-xl font-semibold mb-4">Offer Details</h3>
            {detailsLoading ? (
              <div>Loading...</div>
            ) : offerDetails ? (
              <div className="space-y-2">
                <div><strong>Student Name:</strong> {offerDetails.studentId?.stud_name || '-'}</div>
                <div><strong>Email:</strong> {offerDetails.studentId?.stud_email || '-'}</div>
                <div><strong>Department:</strong> {offerDetails.studentId?.stud_department?.dept_name || '-'}</div>
                <div><strong>Package:</strong> ₹{offerDetails.package?.toLocaleString() || '-'}</div>
                <div><strong>Status:</strong> {offerDetails.status}</div>
                <div><strong>Offered On:</strong> {offerDetails.createdAt ? new Date(offerDetails.createdAt).toLocaleString() : '-'}</div>
                <div><strong>Job Title:</strong> {offerDetails.jobId?.job_title || '-'}</div>
                {/* Add more fields as needed */}
              </div>
            ) : (
              <div className="text-red-500">Failed to load offer details.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}