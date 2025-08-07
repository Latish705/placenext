"use client"
import { BackendUrl } from '@/utils/constants';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

type TabStatus = 'Pending' | 'Accepted' | 'Rejected';

interface Job {
  _id: string;
  title: string;
  // add more fields here if needed
}

export default function JobApplicationStatus() {
  const [activeTab, setActiveTab] = useState<TabStatus>('Pending');
  const [jobRequests, setJobRequests] = useState<Record<TabStatus, Job[]>>({
    Pending: [],
    Accepted: [],
    Rejected: [],
  });

  const tabOptions: TabStatus[] = ['Pending', 'Accepted', 'Rejected'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const payload = { company_name: 'xyz' }; // Replace "xyz" with dynamic value if needed

        const [pending, accepted, rejected] = await Promise.all([
          axios.post(`${BackendUrl}/api/company/pending_jobs`, payload, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }),
          axios.post(`${BackendUrl}/api/company/accepted_jobs`, payload, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }),
          axios.post(`${BackendUrl}/api/company/rejected_jobs`, payload, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }),
        ]);

        setJobRequests({
          Pending: pending.data.jobs,
          Accepted: accepted.data.jobs,
          Rejected: rejected.data.jobs,
        });
      } catch (error: any) {
        console.error('Error fetching job requests:', error.message);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Job Application Status</h2>

      {/* Tab Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '20px' }}>
        {tabOptions.map((status) => (
          <button
            key={status}
            onClick={() => setActiveTab(status)}
            style={{
              padding: '10px 20px',
              border: '1px solid #007bff',
              backgroundColor: activeTab === status ? '#007bff' : '#fff',
              color: activeTab === status ? '#fff' : '#007bff',
              cursor: 'pointer',
              borderRadius: '4px',
              transition: '0.3s',
            }}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Job List */}
      <div>
        {jobRequests[activeTab].length === 0 ? (
          <p style={{ color: '#888' }}>No {activeTab.toLowerCase()} job requests.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {jobRequests[activeTab].map((job) => (
              <li key={job._id} style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                {job.title}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
