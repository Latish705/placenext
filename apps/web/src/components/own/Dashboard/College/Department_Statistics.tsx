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

  // Add loading state
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Function to refresh data and clear cache
  const refreshData = async () => {
    setRefreshing(true);
    try {
      // Clear cache keys related to department statistics
      Object.keys(localStorage).forEach((key) => {
        if (key.includes('cache_') && key.includes('department_statistics')) {
          localStorage.removeItem(key);
        }
      });
      
      // Fetch fresh data
      await getYearsData();
      await getStatistics();
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  // Function to get years data
  const getYearsData = async () => {
    try {
      // Use fetchWithLocalCache for years data with a cache key
      const yearsData = await fetchWithLocalCache<{years: number[]}>(`${BackendUrl}/api/college/get_years`, {
        expirationMs: 3600000, // 1 hour cache
        fetchOptions: {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      });
      
      setYears(yearsData.years);
      if (!selectedYear && yearsData.years.length > 0) {
        setSelectedYear(yearsData.years[0]); // Default to the first year
      }
    } catch (error) {
      console.error("Error fetching years:", error);
    }
  };

  // Function to get statistics data
  const getStatistics = async (year?: number) => {
    setIsLoading(true);
    try {
      // Build URL with year parameter if provided
      const url = year 
        ? `${BackendUrl}/api/college/get_department_statistics?year=${year}`
        : `${BackendUrl}/api/college/get_department_statistics`;
        
      // Use fetchWithLocalCache for statistics data
      const statsData = await fetchWithLocalCache<{departments: any}>(
        url,
        {
          expirationMs: 3600000, // 1 hour cache
          fetchOptions: {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        }
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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      await getYearsData();
      await getStatistics();
    };
    
    initialize();
  }, []);

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    getStatistics(year);
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Department Placement Statistics</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Overview of placement status across all departments
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Year Selection */}
          <div className="flex items-center gap-2">
            <label htmlFor="year-select" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Year:
            </label>
            <select
              id="year-select"
              value={selectedYear || ""}
              onChange={(e) => handleYearChange(Number(e.target.value))}
              className="border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white bg-white dark:bg-gray-700 px-3 py-1.5 text-sm"
              disabled={isLoading || refreshing}
            >
              {years.length === 0 && (
                <option value="">Loading...</option>
              )}
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          
          {/* Refresh Button */}
          <button
            onClick={refreshData}
            disabled={refreshing}
            className={`inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-3
              ${refreshing 
                ? 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
              }`}
            aria-label="Refresh data"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
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
      </div>

      {/* Chart Card */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
        <div className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-72">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="h-[400px]">
              <DepartmentPlacementChart chartData={chartData} />
            </div>
          )}
        </div>
      </div>
      
      {/* Statistics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {chartData.datasets.length > 0 && chartData.datasets[0].data.length > 0 && (
          <>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm p-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Departments</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {chartData.labels.length}
              </p>
            </div>
            
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm p-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Students</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {chartData.datasets[0].data.reduce((a: number, b: number) => a + b, 0) +
                 chartData.datasets[1].data.reduce((a: number, b: number) => a + b, 0)}
              </p>
            </div>
            
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm p-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Placed Students</h3>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                {chartData.datasets[0].data.reduce((a: number, b: number) => a + b, 0)}
              </p>
            </div>
            
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm p-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Placement Rate</h3>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                {(() => {
                  const placed = chartData.datasets[0].data.reduce((a: number, b: number) => a + b, 0);
                  const total = placed + chartData.datasets[1].data.reduce((a: number, b: number) => a + b, 0);
                  return total > 0 ? `${Math.round((placed / total) * 100)}%` : '0%';
                })()}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
