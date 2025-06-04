"use client";

import React, { useState } from "react";
import axios from "axios";
import { BackendUrl } from "@/utils/constants";

export default function Application() {
  const [formData, setFormData] = useState({
    comp_name: "",
    comp_start_date: "",
    comp_contact_person: "",
    comp_email: "",
    comp_industry: "",
    com_positions_offered: "",
    comp_address: "",
    comp_jobs_offered: "",
    comp_no_employs: "",
    comp_website: "",
    comp_location: "",
    comp_contact_no: "",
    comp_departments: "",
    comp_no_of_stud: "",
    comp_courses_offered: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      com_positions_offered: formData.com_positions_offered.split(",").map((s) => s.trim()),
      comp_jobs_offered: formData.comp_jobs_offered.split(",").map((s) => s.trim()),
      comp_departments: formData.comp_departments.split(",").map((s) => s.trim()),
      comp_courses_offered: formData.comp_courses_offered.split(",").map((s) => s.trim()),
      comp_no_employs: Number(formData.comp_no_employs),
      comp_no_of_stud: Number(formData.comp_no_of_stud),
    };

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`${BackendUrl}/api/company/applicationForm`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.data.success) {
        alert("Company application submitted successfully!");
      } else {
        alert(res.data.msg || "Submission failed.");
      }
    } catch (error: any) {
      console.error("Submission error:", error);
      alert(error?.response?.data?.msg || "Something went wrong.");
    }
  };

  const Input = ({
    label,
    name,
    type = "text",
  }: {
    label: string;
    name: string;
    type?: string;
  }) => (
    <div style={{ marginBottom: "15px" }}>
      <label style={{ display: "block", fontWeight: "bold", marginBottom: "5px" }}>{label}</label>
      <input
        type={type}
        name={name}
        value={formData[name as keyof typeof formData]}
        onChange={handleChange}
        required
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
      />
    </div>
  );

  const Textarea = ({
    label,
    name,
  }: {
    label: string;
    name: string;
  }) => (
    <div style={{ marginBottom: "15px" }}>
      <label style={{ display: "block", fontWeight: "bold", marginBottom: "5px" }}>{label}</label>
      <textarea
        name={name}
        value={formData[name as keyof typeof formData]}
        onChange={handleChange}
        required
        rows={3}
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
      />
    </div>
  );

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto", padding: "20px", border: "1px solid #ddd", borderRadius: "8px" }}>
      <h2 style={{ fontSize: "24px", marginBottom: "20px", textAlign: "center" }}>Company Application Form</h2>
      <form onSubmit={handleSubmit}>
        <Input label="Company Name" name="comp_name" />
        <Input label="Start Date" name="comp_start_date" type="date" />
        <Input label="Contact Person" name="comp_contact_person" />
        <Input label="Email" name="comp_email" type="email" />
        <Input label="Industry" name="comp_industry" />
        <Textarea label="Positions Offered (comma-separated)" name="com_positions_offered" />
        <Textarea label="Address" name="comp_address" />
        <Textarea label="Jobs Offered (comma-separated)" name="comp_jobs_offered" />
        <Input label="No. of Employees" name="comp_no_employs" type="number" />
        <Input label="Website" name="comp_website" />
        <Input label="Location" name="comp_location" />
        <Input label="Contact Number" name="comp_contact_no" />
        <Textarea label="Departments (comma-separated)" name="comp_departments" />
        <Input label="No. of Students Required" name="comp_no_of_stud" type="number" />
        <Textarea label="Courses Offered (comma-separated)" name="comp_courses_offered" />
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px 20px",
            backgroundColor: "#0070f3",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            fontSize: "16px",
            cursor: "pointer",
            marginTop: "20px",
          }}
        >
          Submit Application
        </button>
      </form>
    </div>
  );
}
