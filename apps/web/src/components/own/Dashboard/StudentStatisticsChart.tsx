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
import ChartDataLabels from "chartjs-plugin-datalabels"; // Import the data labels plugin
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { BackendUrl } from "@/utils/constants";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  ChartDataLabels // Register the data labels plugin
);

const StudentStatisticsChart: React.FC = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await axios.get(
          `${BackendUrl}/api/college/get_students_statistics`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.data.success) {
          const stats = response.data;

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
        } else {
          toast.error(response.data.msg);
        }
      } catch (error) {
        console.error("Failed to fetch statistics:", error);
        toast.error("Failed to fetch statistics");
      }
    };

    fetchStatistics();
  }, []);

  if (!data) {
    return <div>Loading...</div>; // Loading state
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
          const percentage = ((value / data.totalStudents) * 100).toFixed(2);
          return `${value} (${percentage}%)`; // Display count and percentage
        },
      },
    },
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-lg font-bold mb-6">Student Placement Statistics</h1>

      <div className="flex flex-col">
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Overall Statistics</h2>
          <Bar data={data.barData} options={barOptions} />
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-4">Students by Department</h2>
          <Pie data={data.pieData} options={pieOptions} />
        </div>
      </div>
    </div>
  );
};

export default StudentStatisticsChart;
