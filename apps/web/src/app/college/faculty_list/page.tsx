"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { BackendUrl } from "@/utils/constants";
import CustomTable from "@/components/own/Table/CustomTable";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const ParentComponent = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState({ role: "", branch: "" });
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [isAssignedIsClicked, setIsAssignedIsClicked] = useState(true);

  // Fetch data with optional filters
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${BackendUrl}/api/faculty/get_faculty_list`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            params: isFilterApplied
              ? { ...filter, assigned: isAssignedIsClicked }
              : {},
          }
        );
        if (res.data.success) {
          setData(res.data.faculties);
        } else {
          toast.error(res.data.msg);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch data.");
      }
    };

    fetchData();
  }, [isFilterApplied, filter, isAssignedIsClicked]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const updatedFilter = { ...filter, [e.target.id]: e.target.value };
    setFilter(updatedFilter);
    setIsFilterApplied(true);
  };

  const resetFilter = () => {
    setFilter({ role: "", branch: "" });
    setIsFilterApplied(false);
  };

  // Define column configuration
  const columns = [
    { id: "id", label: "ID", accessor: (row: any) => row._id.slice(0, 10) },
    {
      id: "faculty_name",
      label: "Name",
      accessor: (row: any) => row.faculty_name,
    },
    {
      id: "faculty_email",
      label: "Email",
      accessor: (row: any) => row.faculty_email,
    },
    { id: "role", label: "Role", accessor: (row: any) => row.role },
  ];

  return (
    <div className="p-4 relative">
      <div className="flex flex-col md:flex-row justify-between">
        <h1 className="text-xl font-bold mb-4">Faculty List</h1>
        <div className="flex justify-between gap-2">
          <motion.div whileTap={{ scale: 0.9 }}>
            <Button
              className="border-light_primary_background border-2 hover:bg-light_primary_background hover:text-white"
              onClick={() => setIsAssignedIsClicked(true)}
            >
              Assigned
            </Button>
          </motion.div>
          <motion.div whileTap={{ scale: 0.9 }}>
            <Button
              className="border-light_primary_background border-2 hover:bg-light_primary_background hover:text-white"
              onClick={() => setIsAssignedIsClicked(false)}
            >
              Unassigned
            </Button>
          </motion.div>
        </div>
      </div>
      <div className="flex gap-4 mb-4 flex-col md:flex-row">
        <select
          id="role"
          onChange={handleFilterChange}
          className="border p-2 bg-transparent"
        >
          <option value="">Select Role</option>
          <option value="college-admin">College Admin</option>
          <option value="Faculty">Faculty</option>
        </select>
        <select
          id="branch"
          onChange={handleFilterChange}
          className="border p-2 bg-transparent"
        >
          <option value="">Select Branch</option>
          <option value="Computer Engineering">Computer Engineering</option>
          <option value="IT">IT</option>
        </select>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={resetFilter}
          className="bg-light_primary_background text-white px-4 py-2"
        >
          Reset Filters
        </motion.button>
      </div>
      <CustomTable columns={columns} data={data} />
    </div>
  );
};

export default ParentComponent;
