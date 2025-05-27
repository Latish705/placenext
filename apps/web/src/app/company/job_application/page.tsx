"use client";
import { BackendUrl } from "@/utils/constants";
import axios from "axios";
import React, { useState } from "react";

function Input({
  label,
  name,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}) {
  return (
    <div style={styles.inputGroup}>
      <label style={styles.label}>{label}</label>
      <input
        style={styles.input}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required
      />
    </div>
  );
}

function Select({
  label,
  name,
  value,
  options,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  options: string[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) {
  return (
    <div style={styles.inputGroup}>
      <label style={styles.label}>{label}</label>
      <select
        style={styles.input}
        name={name}
        value={value}
        onChange={onChange}
        required
      >
        <option value="">Select {label}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

function Textarea({
  label,
  name,
  value,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}) {
  return (
    <div style={styles.inputGroup}>
      <label style={styles.label}>{label}</label>
      <textarea
        style={styles.textarea}
        name={name}
        value={value}
        onChange={onChange}
        required
      />
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "700px",
    margin: "40px auto",
    padding: "30px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    background: "#f9f9f9",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    textAlign: "center" as const,
    marginBottom: "25px",
    color: "#333",
  },
  form: {
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: "15px",
  },
  inputGroup: {
    display: "flex" as const,
    flexDirection: "column" as const,
  },
  label: {
    marginBottom: "5px",
    fontWeight: "bold",
  },
  input: {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontSize: "16px",
  },
  textarea: {
    minHeight: "80px",
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  button: {
    padding: "12px 20px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    fontSize: "16px",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default function JobApplication() {
  const [formData, setFormData] = useState({
    job_title: "",
    job_type: "",
    job_location: "",
    job_salary: "",
    job_description: "",
    job_requirements: "",
    job_posted_date: "",
    yr_of_exp_req: "",
    job_timing: "",
    max_no_live_kt: "",
    max_no_dead_kt: "",
    min_CGPI: "",
    branch_allowed: "",
    passing_year: "",
  });

  const [selectedColleges, setSelectedColleges] = useState<string[]>([]);
  const [selectedCollegeId, setSelectedCollegeId] = useState("");

  const collegeOptions = [
    { _id: "c1", name: "MIT" },
    { _id: "c2", name: "Stanford" },
    { _id: "c3", name: "IIT Bombay" },
    { _id: "c4", name: "Harvard" },
  ];

  const jobTypes = ["Full-time", "Part-time", "Contract", "Internship", "Freelance"];
  const jobTimings = ["Day Shift", "Night Shift", "Flexible", "Rotational"];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCollege = () => {
    if (selectedCollegeId && !selectedColleges.includes(selectedCollegeId)) {
      setSelectedColleges([...selectedColleges, selectedCollegeId]);
      setSelectedCollegeId("");
    }
  };

  const handleRemoveCollege = (id: string) => {
    setSelectedColleges(selectedColleges.filter((collegeId) => collegeId !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      job_salary: Number(formData.job_salary),
      yr_of_exp_req: Number(formData.yr_of_exp_req),
      max_no_dead_kt: Number(formData.max_no_dead_kt),
      max_no_live_kt: Number(formData.max_no_live_kt),
      min_CGPI: Number(formData.min_CGPI),
      passing_year: formData.passing_year.split(",").map((y) => Number(y.trim())),
      branch_allowed: formData.branch_allowed.split(",").map((b) => b.trim()),
      job_requirements: formData.job_requirements.split(",").map((r) => r.trim()),
      college: selectedColleges,
      company_name: "Your Company Name",
      status: "pending",
    };

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`${BackendUrl}/api/company/create_job`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.status === 200) {
        alert("Job posted successfully!");
      } else {
        alert(res.data?.msg || "Submission failed");
      }
    } catch (error: any) {
      console.error("Error submitting job:", error);
      alert(error?.response?.data?.msg || "An error occurred. Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Post a Job</h2>
      <form style={styles.form} onSubmit={handleSubmit}>
        <Input label="Job Title" name="job_title" value={formData.job_title} onChange={handleChange} />
        <Select label="Job Type" name="job_type" value={formData.job_type} options={jobTypes} onChange={handleChange} />
        <Input label="Location" name="job_location" value={formData.job_location} onChange={handleChange} />
        <Input label="Salary (USD)" type="number" name="job_salary" value={formData.job_salary} onChange={handleChange} />
        <Textarea label="Job Description" name="job_description" value={formData.job_description} onChange={handleChange} />
        <Textarea label="Job Requirements (comma-separated)" name="job_requirements" value={formData.job_requirements} onChange={handleChange} />
        <Input label="Posted Date" type="date" name="job_posted_date" value={formData.job_posted_date} onChange={handleChange} />
        <Input label="Years of Experience Required" type="number" name="yr_of_exp_req" value={formData.yr_of_exp_req} onChange={handleChange} />
        <Select label="Job Timing" name="job_timing" value={formData.job_timing} options={jobTimings} onChange={handleChange} />
        <Input label="Max No. of Live KTs" type="number" name="max_no_live_kt" value={formData.max_no_live_kt} onChange={handleChange} />
        <Input label="Max No. of Dead KTs" type="number" name="max_no_dead_kt" value={formData.max_no_dead_kt} onChange={handleChange} />
        <Input label="Minimum CGPI" type="number" name="min_CGPI" value={formData.min_CGPI} onChange={handleChange} />
        <Input label="Allowed Branches (comma-separated)" name="branch_allowed" value={formData.branch_allowed} onChange={handleChange} />
        <Input label="Passing Years (comma-separated)" name="passing_year" value={formData.passing_year} onChange={handleChange} />


        <div style={styles.inputGroup}>
          <label style={styles.label}>Select College</label>
          <select
            style={styles.input}
            value={selectedCollegeId}
            onChange={(e) => setSelectedCollegeId(e.target.value)}
          >
            <option value="">Select a college</option>
            {collegeOptions.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
          <button type="button" onClick={handleAddCollege} style={{ marginTop: "10px" }}>
            Add College
          </button>
        </div>


        {selectedColleges.length > 0 && (
          <div>
            <strong>Selected Colleges:</strong>
            <ul>
              {selectedColleges.map((id) => {
                const college = collegeOptions.find((c) => c._id === id);
                return (
                  <li key={id}>
                    {college?.name || id}{" "}
                    <button
                      type="button"
                      onClick={() => handleRemoveCollege(id)}
                      style={{ marginLeft: "10px", color: "red" }}
                    >
                      Remove
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <button type="submit" style={styles.button}>Submit Job</button>
      </form>
    </div>
  );
}
