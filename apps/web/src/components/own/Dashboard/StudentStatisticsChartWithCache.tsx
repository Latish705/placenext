"use client";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  ChartOptions,
  Plugin,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { BackendUrl } from "@/utils/constants";
import { fetchWithLocalCache, clearCache } from "@/config/services/cache_service";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  ChartDataLabels
);

interface StudentStatistics {
  success: boolean;
  studentsData: {
    totalStudents: number;
    totalPlaced: number;
    totalNotPlaced: number;
    studentsByDepartment: Record<string, number>;
  };
  msg?: string;
}

const StudentStatisticsChart: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Function to fetch statistics with caching
  const fetchStatistics = async () => {
    try {
      const response = await fetchWithLocalCache<StudentStatistics>(
        `${BackendUrl}/api/college/get_students_statistics`,
        {
          expirationMs: 3600000, // 1 hour cache
          fetchOptions: {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        }
      );

      if (response.success) {
        const stats = response.studentsData;
        console.log(stats);

        const totalStudents = stats.totalStudents;

        // Set up data for the charts
        setData({
          overview: {
            labels: ["Total", "Placed", "Not Placed"],
            datasets: [
              {
                label: "Student Counts",
                data: [totalStudents, stats.totalPlaced, stats.totalNotPlaced],
                backgroundColor: [
                  "rgba(54, 162, 235, 0.6)",
                  "rgba(75, 192, 192, 0.6)",
                  "rgba(255, 99, 132, 0.6)",
                ],
                borderColor: [
                  "rgba(54, 162, 235, 1)",
                  "rgba(75, 192, 192, 1)",
                  "rgba(255, 99, 132, 1)",
                ],
                borderWidth: 1,
              },
            ],
          },
          byDepartment: {
            labels: Object.keys(stats.studentsByDepartment),
            datasets: [
              {
                label: "Students by Department",
                data: Object.values(stats.studentsByDepartment),
                backgroundColor: [
                  "rgba(255, 99, 132, 0.6)",
                  "rgba(54, 162, 235, 0.6)",
                  "rgba(255, 206, 86, 0.6)",
                  "rgba(75, 192, 192, 0.6)",
                  "rgba(153, 102, 255, 0.6)",
                ],
                borderColor: [
                  "rgba(255, 99, 132, 1)",
                  "rgba(54, 162, 235, 1)",
                  "rgba(255, 206, 86, 1)",
                  "rgba(75, 192, 192, 1)",
                  "rgba(153, 102, 255, 1)",
                ],
                borderWidth: 1,
              },
            ],
          },
        });
      } else if (response.msg) {
        toast.error(response.msg);
      }
    } catch (error) {
      console.error("Error fetching statistics:", error);
      toast.error("Failed to load student statistics");
    }
  };

  // Function to refresh data and clear cache
  const refreshData = async () => {
    setRefreshing(true);
    try {
      // Clear cache for statistics data
      clearCache(`${BackendUrl}/api/college/get_students_statistics`);
      
      // Fetch fresh data
      await fetchStatistics();
      toast.success("Statistics data refreshed");
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  const pieOptions: ChartOptions<"pie"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "white", // Adjust for dark mode compatibility
        },
      },
      title: {
        display: true,
        text: "Students by Placement Status",
        color: "white", // Adjust for dark mode compatibility
      },
      datalabels: {
        color: "#fff",
        formatter: (value, context) => {
          const dataset = context.chart.data.datasets[0];
          const total = dataset.data.reduce((acc, data) => (acc as number) + (data as number), 0) as number;
          const percentage = ((value as number / total) * 100).toFixed(1);
          return `${percentage}%`;
        },
      },
    },
  };

  const barOptions: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "white", // Adjust for dark mode compatibility
        },
      },
      title: {
        display: true,
        text: "Students by Department",
        color: "white", // Adjust for dark mode compatibility
      },
      datalabels: {
        color: "#fff",
        anchor: "end",
        align: "top",
        formatter: Math.round,
      },
    },
  };

  if (!data) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <div className="bg-gray-800 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white text-lg font-bold">Placement Overview</h3>
          
          {/* Refresh Button */}
          <button
            onClick={refreshData}
            disabled={refreshing}
            className={`inline-flex items-center justify-center rounded-md text-sm font-medium h-8 px-3
              ${refreshing 
                ? 'bg-gray-600 text-gray-400' 
                : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
            aria-label="Refresh statistics"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="14" 
              height="14" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className={`mr-1 ${refreshing ? 'animate-spin' : ''}`}
            >
              <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
            </svg>
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
        <div className="h-[300px] flex items-center justify-center">
          <Pie data={data.overview} options={pieOptions} />
        </div>
      </div>
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-white text-lg font-bold mb-4">Department Distribution</h3>
        <div className="h-[300px] flex items-center justify-center">
          <Bar data={data.byDepartment} options={barOptions} />
        </div>
      </div>
    </div>
  );
};

export default StudentStatisticsChart;
