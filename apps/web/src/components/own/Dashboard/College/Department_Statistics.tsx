"use client";
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { BackendUrl } from "@/utils/constants";
import { fetchWithLocalCache } from "@/config/services/cache_service";


// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DepartmentPlacementChart = ({ chartData }: any) => {
  const options = {
    plugins: {
      title: {
        display: true,
        text: "Department-Wise Placement Status",
      },
      legend: {
        display: true,
        position: "top" as const,
      },
    },
    responsive: true,
    scales: {
      x: {
        stacked: true, // Stack the bars on the x-axis
      },
      y: {
        stacked: true, // Stack the bars on the y-axis
        title: {
          display: true,
          text: "Number of Students",
        },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default function DepartmentStatistics() {
  const [chartData, setChartData] = useState<any>({
    labels: [],
    datasets: [],
  });
  const [years, setYears] = useState<number[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  useEffect(() => {
    const getYearsData = async () => {
      try {
        // Use fetchWithLocalCache for years data
        const yearsData = await fetchWithLocalCache<{years: number[]}>(`${BackendUrl}/api/college/get_years`, {
          expirationMs: 3600000, // 1 hour cache
          fetchOptions: {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        });
        
        setYears(yearsData.years);
        setSelectedYear(yearsData.years[0]); // Default to the first year
      } catch (error) {
        console.error("Error fetching years:", error);
      }
    };

    const getStatistics = async () => {
      try {
        // Use fetchWithLocalCache for statistics data
        const statsData = await fetchWithLocalCache<{years: number[], departments: any}>(
          `${BackendUrl}/api/college/get_department_statistics`,
          { expirationMs: 3600000 }
        );

        const { departments } = statsData;
        
        // Extract department names, placed, and not placed counts
        const labels = Object.keys(departments);
        const placedData = labels.map((dept) => departments[dept].placed);
        const notPlacedData = labels.map((dept) => departments[dept].notPlaced);

        setChartData({
          labels,
          datasets: [
            {
              label: "Placed",
              data: placedData,
              backgroundColor: "rgba(75, 192, 192, 0.7)",
            },
            {
              label: "Not Placed",
              data: notPlacedData,
              backgroundColor: "rgba(255, 99, 132, 0.7)",
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching statistics:", error);
      }
    };

    getYearsData();
    getStatistics();
  }, []);

  const handleYearChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const year = Number(event.target.value);
    setSelectedYear(year);

    try {
      const response = await fetchWithLocalCache<{ departments: any }>(
        `${BackendUrl}/api/college/get_department_statistics?year=${year}`,
        {
          expirationMs: 3600000, // 1 hour cache
          fetchOptions: { // Put headers inside fetchOptions
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        }
      );

      const { departments } = response;

      // Extract department names, placed, and not placed counts
      const labels = Object.keys(departments);
      const placedData = labels.map((dept) => departments[dept].placed);
      const notPlacedData = labels.map((dept) => departments[dept].notPlaced);

      setChartData({
        labels,
        datasets: [
          {
            label: "Placed",
            data: placedData,
            backgroundColor: "rgba(75, 192, 192, 0.7)", // Bar color for "Placed"
          },
          {
            label: "Not Placed",
            data: notPlacedData,
            backgroundColor: "rgba(255, 99, 132, 0.7)", // Bar color for "Not Placed"
          },
        ],
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {/* Dropdown for year selection */}
      <div>
        <label htmlFor="year-select">Select Year:</label>
        <select
          id="year-select"
          value={selectedYear || ""}
          onChange={handleYearChange}
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      <DepartmentPlacementChart chartData={chartData} />
    </div>
  );
}
