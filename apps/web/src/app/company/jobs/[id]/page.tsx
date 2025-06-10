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
        router.push('/login');
        return;
      }

      const response = await axios.get(
        `${BackendUrl}/api/job/getjobdetail/${params.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        setJob(response.data.data);
        if (response.data.data.rounds.length > 0) {
          setActiveRound(response.data.data.rounds[0]);
        }
      }
    } catch (err: any) {
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
      <h1 className="text-3xl font-bold mb-4">{job.job_title}</h1>
      <div className="mb-6">
        <p className="text-gray-600">{job.job_location}</p>
        <p className="text-xl font-semibold">₹{job.job_salary.toLocaleString()}/year</p>
        <p className="mt-4">{job.job_description}</p>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Interview Rounds</h2>
        
        {/* Round Navigation */}
        <div className="flex gap-2 mb-4">
          {job.rounds.map((round) => (
            <button
              key={round._id}
              onClick={() => setActiveRound(round)}
              className={`px-3 py-1 rounded ${
                activeRound?._id === round._id 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200'
              }`}
            >
              {round.round_type}
              <br/>
              Round {round.round_number}
            </button>
          ))}
        </div>

        {/* Student List */}
        {activeRound && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Department</th>
                  <th className="p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {activeRound.student_list.map((student) => (
                  <tr key={student.student_id}>
                    <td className="p-2">{student.name}</td>
                    <td className="p-2">{student.division.dept_name}</td>
                    <td className="p-2">
                      <button
                        className={`px-3 py-1 rounded ${
                          student.selected 
                            ? 'bg-green-500 text-white'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                        onClick={() => handlePromoteStudent(activeRound._id, student.student_id)}
                        disabled={student.selected}
                      >
                        {student.selected ? 'Promoted' : 'Promote to Next Round'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!activeRound && (
          <div className="text-gray-500">No rounds available</div>
        )}
      </div>
    </div>
  );
}