// components/StudentStatisticsChart.tsx
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
import { RefreshCw } from "lucide-react";
import { fetchStudentData, StudentCacheKeys, clearStudentCache } from "@/config/services/cache_service";

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
  totalStudents: number;
  totalPlaced: number;
  totalNotPlaced: number;
  studentsByDepartment: Record<string, number>;
}

interface ChartData {
  barData: any;
  pieData: any;
  totalStudents: number;
}

const StudentStatisticsChart: React.FC = () => {
  const [data, setData] = useState<ChartData | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Define fetchStatistics outside useEffect so it can be reused
  const fetchStatistics = async (forceRefresh = false) => {
    setLoading(true);
    try {
      // Clear cache if forced refresh
      if (forceRefresh) {
        clearStudentCache(StudentCacheKeys.DASHBOARD_STATS);
      }
      
      // Use cache service to fetch statistics
      const response = await fetchStudentData<{success: boolean, studentsData: StudentStatistics, msg?: string}>(
        `${BackendUrl}/api/college/get_students_statistics`,
        StudentCacheKeys.DASHBOARD_STATS,
        {
          expirationMs: 3600000,
          fetchOptions: {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
          // Cache for 1 hour
        }
      );
      
      if (response.success && response.studentsData) {
        const stats = response.studentsData;
        console.log(stats);

        const totalStudents = stats.totalStudents;
        const barData = {
          labels: ["Total Students", "Total Placed", "Total Not Placed"],
          datasets: [
            {
              label: "Student Placement Statistics",
              data: [totalStudents, stats.totalPlaced, stats.totalNotPlaced],
              backgroundColor: [
                "rgba(75, 192, 192, 0.6)",
                "rgba(153, 102, 255, 0.6)",
                "rgba(255, 99, 132, 0.6)",
              ],
            },
          ],
        };

        const pieData = {
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
                "rgba(255, 159, 64, 0.6)",
              ],
            },
          ],
        };

        setData({ barData, pieData, totalStudents });
      } else if (response.msg) {
        toast.error(response.msg);
      }
    } catch (error) {
      console.error("Error fetching student statistics:", error);
      toast.error("Failed to fetch statistics");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Function to refresh data and clear cache
  const refreshData = async () => {
    setRefreshing(true);
    try {
      await fetchStatistics(true);
      toast.success("Statistics data refreshed");
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast.error("Failed to refresh data");
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  if (loading && !data) {
    return (
      <div className="p-6 rounded-lg border border-gray-200 shadow-sm bg-white">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded w-3/4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // Custom tooltip for Bar chart
  const barOptions: ChartOptions<"bar"> = {
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const value = tooltipItem.raw as number;
            return `${tooltipItem.label}: ${value}`;
          },
        },
      },
      legend: {
        display: true,
      },
      datalabels: {
        display: true,
        align: "end",
        anchor: "end",
        formatter: (value: number) => {
          return `${value}`; // Display count
        },
      },
    },
  };

  // Custom tooltip for Pie chart
  const pieOptions: ChartOptions<"pie"> = {
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            if (!data) return "";
            const value = tooltipItem.raw as number;
            const percentage = ((value / data.totalStudents) * 100).toFixed(2);
            return `${tooltipItem.label}: ${value} (${percentage}%)`;
          },
        },
      },
      legend: {
        display: true,
      },
      datalabels: {
        display: true,
        formatter: (value: number, context: any) => {
          if (!data) return "";
          const percentage = ((value / data.totalStudents) * 100).toFixed(2);
          return `${value} (${percentage}%)`; // Display count and percentage
        },
      },
    },
  };

  return (
    <div className="mx-auto overflow-hidden p-2 md:px-20 lg:px-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-lg font-bold">Student Placement Statistics</h1>
        <button
          onClick={refreshData}
          disabled={refreshing}
          className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-md"
        >
          <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-between">
        <div className="mb-8 w-full lg:w-[600px]">
          <h2 className="text-lg font-semibold mb-4">Overall Statistics</h2>
          {data && (
            <Bar
              style={{ width: "100%" }}
              data={data.barData}
              options={barOptions}
            />
          )}
        </div>
        <div className="w-full lg:w-[600px]">
          <h2 className="text-lg font-semibold mb-4">Students by Department</h2>
          {data && (
            <Pie
              style={{ width: "100%" }}
              data={data.pieData}
              options={pieOptions}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentStatisticsChart;
