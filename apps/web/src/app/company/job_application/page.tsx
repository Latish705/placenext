"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { BackendUrl } from "@/utils/constants";

type College = {
  _id: string;
  coll_name: string;
};

// Update the Round interface
interface Round {
  title: string;
}

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
  options: string[] | College[];
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
        <option value="">{`Select ${label}`}</option>
        {options.map((opt) =>
          typeof opt === "string" ? (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ) : (
            <option key={opt._id} value={opt._id}>
              {opt.coll_name}
            </option>
          )
        )}
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
    maxWidth: "900px",
    margin: "20px auto",
    padding: "30px",
    border: "1px solid #e0e0e0",
    borderRadius: "12px",
    background: "#ffffff",
    fontFamily: "Arial, sans-serif",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  title: {
    textAlign: "center" as const,
    marginBottom: "30px",
    color: "#333",
    fontSize: "28px",
    fontWeight: "600",
  },
  form: {
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: "20px",
  },
  inputGroup: {
    display: "flex" as const,
    flexDirection: "column" as const,
  },
  label: {
    marginBottom: "8px",
    fontWeight: "600",
    color: "#374151",
    fontSize: "14px",
  },
  input: {
    padding: "12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "16px",
    transition: "border-color 0.2s, box-shadow 0.2s",
    "&:focus": {
      outline: "none",
      borderColor: "#3b82f6",
      boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
    },
  },
  textarea: {
    minHeight: "100px",
    padding: "12px",
    fontSize: "16px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    resize: "vertical" as const,
    transition: "border-color 0.2s, box-shadow 0.2s",
  },
  button: {
    padding: "14px 28px",
    backgroundColor: "#3b82f6",
    color: "#fff",
    border: "none",
    fontSize: "16px",
    fontWeight: "600",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.2s, transform 0.1s",
    "&:hover": {
      backgroundColor: "#2563eb",
      transform: "translateY(-1px)",
    },
    "&:disabled": {
      backgroundColor: "#9ca3af",
      cursor: "not-allowed",
      transform: "none",
    },
  },
};

export default function JobCreationForm() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [selectedColleges, setSelectedColleges] = useState<string[]>([]);
  const [selectedCollegeId, setSelectedCollegeId] = useState("");

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

  // Update the rounds state
  const [rounds, setRounds] = useState<Round[]>([]);
  const [roundTitle, setRoundTitle] = useState("");
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const handleAddRound = () => {
    if (!roundTitle) return;

    if (editIndex !== null) {
      const updated = [...rounds];
      updated[editIndex] = { title: roundTitle };
      setRounds(updated);
      setEditIndex(null);
    } else {
      setRounds([...rounds, { title: roundTitle }]);
    }
    setRoundTitle("");
  };

  const handleEditRound = (idx: number) => {
    setRoundTitle(rounds[idx].title);
    setEditIndex(idx);
  };

  const handleDeleteRound = (idx: number) => {
    const updated = rounds.filter((_, i) => i !== idx);
    setRounds(updated);
  };

  const jobTypes = [
    "Full-time",
    "Part-time",
    "Contract",
    "Internship",
    "Freelance",
  ];
  const jobTimings = ["Day Shift", "Night Shift", "Flexible", "Rotational"];

  useEffect(() => {
    async function fetchColleges() {
      try {
        const res = await axios.get(`${BackendUrl}/api/college/getAllColleges`,{headers: {
          "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        }});  
        
        // Log the response to debug
        console.log("College response:", res.data);

        // Check if response has data array
        if (res.data.success && Array.isArray(res.data.data)) {
          const collegeData = res.data.data.map((college: any) => ({
            _id: college._id,
            coll_name: college.coll_name // Use coll_name from response
          }));
          
          console.log("Mapped colleges:", collegeData);
          setColleges(collegeData);
        } else {
          console.error("Invalid college data format:", res.data);
        }
      } catch (err) {
        console.error("Failed to fetch colleges:", err);
      }
    }

    fetchColleges();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCollege = () => {
    if (selectedCollegeId && !selectedColleges.includes(selectedCollegeId)) {
      setSelectedColleges((prev) => [...prev, selectedCollegeId]);
      setSelectedCollegeId("");
    }
  };

  const handleRemoveCollege = (id: string) => {
    setSelectedColleges((prev) => prev.filter((cId) => cId !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // if (selectedColleges.length === 0) {
    //   alert("Please select at least one college");
    //   return;
    // }

    const payload = {
      ...formData,
      job_salary: Number(formData.job_salary) || 0,
      yr_of_exp_req: Number(formData.yr_of_exp_req) || 0,
      max_no_live_kt: Number(formData.max_no_live_kt) || 0,
      max_no_dead_kt: Number(formData.max_no_dead_kt) || 0,
      min_CGPI: Number(formData.min_CGPI) || 0,
      passing_year: formData.passing_year
        .split(",")
        .map((y) => Number(y.trim()))
        .filter((y) => !isNaN(y)),
      branch_allowed: formData.branch_allowed
        .split(",")
        .map((b) => b.trim())
        .filter((b) => b.length > 0),
      job_requirements: formData.job_requirements
        .split(",")
        .map((r) => r.trim())
        .filter((r) => r.length > 0),
      college: ["66edbf3b7298265cb469ca2d"], 
      status: "pending",
    };

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login first");
        return;
      }

      const jobCreationResponse = await axios.post(
        `${BackendUrl}/api/job/create`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Update the round creation part in handleSubmit:
      if (jobCreationResponse.data.success) { // Changed from status === 200
        const createdJobId = jobCreationResponse.data.job._id;
        
        if (rounds.length > 0) {
          try {
            // Create rounds sequentially
            for (let i = 0; i < rounds.length; i++) {
              const round = rounds[i];
              const roundPayload = {
                job_id: createdJobId,
                round_type: round.title
              };

              console.log(`Creating round ${i + 1}:`, roundPayload);

              const roundResponse = await axios.post(
                `${BackendUrl}/api/round/create`,
                roundPayload,
                {
                  headers: {
                    Authorization: `Bearer ${token}`, // Add token
                    "Content-Type": "application/json"
                  }
                }
              );

              if (!roundResponse.data.success) {
                throw new Error(roundResponse.data.message || `Failed to create round ${i + 1}`);
              }

              console.log(`Round ${i + 1} created:`, roundResponse.data);
            }

            alert("Job and all rounds created successfully!");
            resetForm(); // Use a separate reset function
          } catch (error: any) {
            console.error("Error creating rounds:", error);
            alert(`Job created but failed to create rounds: ${error.message}`);
          }
        } else {
          alert("Job created successfully!");
          resetForm();
        }
      } else {
        throw new Error(jobCreationResponse.data.message || "Failed to create job");
      }
    } catch (error: any) {
      console.error("Error creating job:", error);
      alert(error.response?.data?.message || "An error occurred while creating the job");
    }
  };

  const resetForm = () => {
    setFormData({
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
    setSelectedColleges([]);
    setRounds([]);
    setRoundTitle("");
    setEditIndex(null);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Post a New Job</h2>
      <form style={styles.form} onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Job Title"
            name="job_title"
            value={formData.job_title}
            onChange={handleChange}
          />
          <Select
            label="Job Type"
            name="job_type"
            value={formData.job_type}
            options={jobTypes}
            onChange={handleChange}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Location"
            name="job_location"
            value={formData.job_location}
            onChange={handleChange}
          />
          <Input
            label="Salary (₹)"
            type="number"
            name="job_salary"
            value={formData.job_salary}
            onChange={handleChange}
          />
        </div>

        <Textarea
          label="Job Description"
          name="job_description"
          value={formData.job_description}
          onChange={handleChange}
        />
        
        <Textarea
          label="Job Requirements (comma-separated)"
          name="job_requirements"
          value={formData.job_requirements}
          onChange={handleChange}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Posted Date"
            type="date"
            name="job_posted_date"
            value={formData.job_posted_date}
            onChange={handleChange}
          />
          <Input
            label="Years of Experience Required"
            type="number"
            name="yr_of_exp_req"
            value={formData.yr_of_exp_req}
            onChange={handleChange}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Job Timing"
            name="job_timing"
            value={formData.job_timing}
            options={jobTimings}
            onChange={handleChange}
          />
          <Input
            label="Minimum CGPI"
            type="number"
            name="min_CGPI"
            value={formData.min_CGPI}
            onChange={handleChange}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Max No. of Live KTs"
            type="number"
            name="max_no_live_kt"
            value={formData.max_no_live_kt}
            onChange={handleChange}
          />
          <Input
            label="Max No. of Dead KTs"
            type="number"
            name="max_no_dead_kt"
            value={formData.max_no_dead_kt}
            onChange={handleChange}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Allowed Branches (comma-separated)"
            name="branch_allowed"
            value={formData.branch_allowed}
            onChange={handleChange}
          />
          <Input
            label="Passing Years (comma-separated)"
            name="passing_year"
            value={formData.passing_year}
            onChange={handleChange}
          />
        </div>

        {/* College selection */}
        {/* <div style={styles.inputGroup}>
          <label style={styles.label}>Select Colleges</label>
          <div className="flex gap-2">
            <select
              style={{ ...styles.input, flex: 1 }}
              value={selectedCollegeId}
              onChange={(e) => setSelectedCollegeId(e.target.value)}
            >
              <option value="">Select a college</option>
              {colleges.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.coll_name}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleAddCollege}
              style={{
                ...styles.button,
                width: 'auto',
                padding: '10px 20px',
                backgroundColor: selectedCollegeId ? '#28a745' : '#6c757d'
              }}
              disabled={!selectedCollegeId}
            >
              Add College
            </button>
          </div>
        </div> */}

        {selectedColleges.length > 0 && (
          <div style={styles.inputGroup}>
            <label style={styles.label}>Selected Colleges:</label>
            <div className="flex flex-wrap gap-2">
              {selectedColleges.map((id) => {
                const college = colleges.find((c) => c._id === id);
                return (
                  <div
                    key={id}
                    className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    <span>{college?.coll_name || id}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCollege(id)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Interview Rounds */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>Interview Rounds</label>
          <div className="flex gap-2">
            <input
              style={{ ...styles.input, flex: 1 }}
              placeholder="Round Title (e.g., Technical Interview, HR Round)"
              value={roundTitle}
              onChange={(e) => setRoundTitle(e.target.value)}
            />
            <button
              type="button"
              onClick={handleAddRound}
              style={{
                ...styles.button,
                width: 'auto',
                padding: '10px 20px',
                backgroundColor: roundTitle ? '#007bff' : '#6c757d'
              }}
              disabled={!roundTitle}
            >
              {editIndex !== null ? "Update Round" : "Add Round"}
            </button>
          </div>
        </div>

        {rounds.length > 0 && (
          <div style={styles.inputGroup}>
            <label style={styles.label}>Added Rounds:</label>
            <div className="space-y-2">
              {rounds.map((round, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between bg-gray-50 p-3 rounded border"
                >
                  <div>
                    <span className="font-medium">Round {idx + 1}:</span> {round.title}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleEditRound(idx)}
                      className="text-blue-600 hover:text-blue-800 px-2 py-1 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteRound(idx)}
                      className="text-red-600 hover:text-red-800 px-2 py-1 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <button type="submit" style={styles.button}>
          Submit Job Application
        </button>
      </form>
    </div>
  );
}
