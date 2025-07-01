'use client';

import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { BackendUrl } from '@/utils/constants';
import axios from 'axios';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface StatisticsData {
  totalOffers: number;
  under6LPA: number;
  secondOfferAbove6LPA: number;
  offersBelow6LPA: number;
  offersAbove6LPA: number;
}

export default function StatisticsDashboard() {
  const [selectedMetric, setSelectedMetric] = useState('totalOffers');
  const [statisticsData, setStatisticsData] = useState<StatisticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Token:', token);
        if (!token) {
            console.error('No authentication token found');
            return;
        }

        const [
          totalOffersRes,
          under6LPARes,
          secondOfferAbove6LPARes,
          belowRes,
          aboveRes,
        ] = await Promise.all([
          axios(`${BackendUrl}/api/college/total_offers`, { headers: { Authorization: `Bearer ${token}` } }),
          axios(`${BackendUrl}/api/college/students_accepted_under_6lpa`, { headers: { Authorization: `Bearer ${token}` } }),
          axios(`${BackendUrl}/api/college/students_accepted_second_offer_above_6lpa`, { headers: { Authorization: `Bearer ${token}` } }),
          axios(`${BackendUrl}/api/college/offers_below_6lpa`, { headers: { Authorization: `Bearer ${token}` } }),
          axios(`${BackendUrl}/api/college/offers_above_6lpa`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        console.log('Total Offers:', totalOffersRes.data);
        console.log('Under 6 LPA:', under6LPARes.data);
        console.log('Second Offer Above 6 LPA:', secondOfferAbove6LPARes.data);
        console.log('Offers Below 6 LPA:', belowRes.data);
        

        setStatisticsData({
          totalOffers: totalOffersRes.data.totalOffers,
          under6LPA: under6LPARes.data.count,
          secondOfferAbove6LPA: secondOfferAbove6LPARes.data.count,
          offersBelow6LPA: belowRes.data,
          offersAbove6LPA: aboveRes.data,
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching statistics:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const barChartData = {
    labels: ['Total Offers', 'Under 6 LPA', 'Second Offer > 6 LPA', 'Below 6 LPA', 'Above 6 LPA'],
    datasets: [
      {
        label: 'Number of Students',
        data: statisticsData ? [
          statisticsData.totalOffers,
          statisticsData.under6LPA,
          statisticsData.secondOfferAbove6LPA,
          statisticsData.offersBelow6LPA,
          statisticsData.offersAbove6LPA,
        ] : [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const pieChartData = {
    labels: ['Below 6 LPA', 'Above 6 LPA'],
    datasets: [
      {
        data: statisticsData ? [
          statisticsData.offersBelow6LPA,
          statisticsData.offersAbove6LPA,
        ] : [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const metrics = [
    { id: 'totalOffers', label: 'Total Offers' },
    { id: 'salaryDistribution', label: 'Salary Distribution' },
    { id: 'under6LPA', label: 'Students Under 6 LPA' },
    { id: 'secondOfferAbove6LPA', label: 'Second Offers Above 6 LPA' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Placement Statistics Dashboard</h1>
      
      {/* Filters */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-4 justify-center">
          {metrics.map((metric) => (
            <button
              key={metric.id}
              onClick={() => setSelectedMetric(metric.id)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedMetric === metric.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {metric.label}
            </button>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Overall Statistics</h2>
          <div className="h-[400px]">
            <Bar
              data={barChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  },
                  title: {
                    display: true,
                    text: 'Placement Statistics Overview',
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Salary Distribution</h2>
          <div className="h-[400px]">
            <Pie
              data={pieChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  },
                  title: {
                    display: true,
                    text: 'Offers by Salary Range',
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-2">Total Offers</h3>
            <p className="text-3xl font-bold text-blue-500">
              {statisticsData?.totalOffers || 0}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-2">Students Under 6 LPA</h3>
            <p className="text-3xl font-bold text-green-500">
              {statisticsData?.under6LPA || 0}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-2">Second Offers Above 6 LPA</h3>
            <p className="text-3xl font-bold text-purple-500">
              {statisticsData?.secondOfferAbove6LPA || 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
