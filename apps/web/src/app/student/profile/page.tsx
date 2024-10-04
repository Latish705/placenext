"use client";

import { BackendUrl } from "@/utils/constants"; // Ensure this constant is defined in your utils
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ProfileSection = () => {
  // Initial profile data
  const [profile, setProfile] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    gender: "",
    fatherName: "",
    motherName: "",
    rollNumber: "",
    division: "",
    dateOfBirth: "",
    email: "",
    alternateEmail: "",
    aadharNumber: "",
    phoneNumber: "",
    alternatePhoneNo: "",
    panNumber: "",
    address: "",
    state: "",
    country: "",
    pincode: "",
    courseType: "",
    admissionYear: "",
    departmentName: "",
    tenthPercentage: "",
    hscBoard: "",
    twelfthPercentage: "",
    sscBoard: "",
    cet: "",
    sem1CGPI: "",
    sem2CGPI: "",
    sem3CGPI: "",
    sem4CGPI: "",
    sem5CGPI: "",
    sem6CGPI: "",
    sem7CGPI: "",
    sem8CGPI: "",
    college: "",
  });

  const [isEditing, setIsEditing] = useState(false); // State to toggle edit mode

  useEffect(() => {
    // Fetch profile data
    const fetchProfileData = async () => {
      try {
        const res = await axios.get(
          `${BackendUrl}/api/student/get_user_details`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming you're using token-based auth
            },
          }
        );
        console.log(res.data);
        if (res.data.success) {
          const { student } = res.data;
          const {
            stud_info_id,
            stud_name,
            stud_email,
            stud_address,
            stud_phone,
            stud_dob,
            stud_course,
            stud_department,
            googleId,
          } = student;

          // Split the full name
          const nameParts = stud_name.split(" ");
          const firstName = nameParts[0];
          const middleName = nameParts.length === 3 ? nameParts[1] : "";
          const lastName = nameParts[nameParts.length - 1] || "";

          // Map data to the profile state
          setProfile({
            firstName,
            middleName,
            lastName,
            gender: "", 
            fatherName: "", 
            motherName: "", 
            rollNumber: "", 
            division: "", 
            dateOfBirth: new Date(stud_dob).toISOString().split("T")[0], 
            email: stud_email,
            alternateEmail: stud_info_id.stud_alternate_email || "",
            aadharNumber: stud_info_id.stud_aadhar || "",
            phoneNumber: stud_phone,
            alternatePhoneNo: stud_info_id.stud_alternate_phone || "",
            panNumber: stud_info_id.stud_pan || "",
            address: stud_address,
            state: "", 
            country: "", 
            pincode: "", 
            courseType: stud_course,
            admissionYear: stud_info_id.stud_addmission_year,
            departmentName: stud_department,
            tenthPercentage: stud_info_id.stud_ssc,
            hscBoard: stud_info_id.stud_hsc_board,
            twelfthPercentage: stud_info_id.stud_hsc,
            sscBoard: stud_info_id.stud_ssc_board,
            cet: stud_info_id.stud_cet,
            sem1CGPI: stud_info_id.stud_sem1_grade,
            sem2CGPI: stud_info_id.stud_sem2_grade,
            sem3CGPI: stud_info_id.stud_sem3_grade,
            sem4CGPI: stud_info_id.stud_sem4_grade,
            sem5CGPI: stud_info_id.stud_sem5_grade || "",
            sem6CGPI: stud_info_id.stud_sem6_grade || "",
            sem7CGPI: stud_info_id.stud_sem7_grade || "",
            sem8CGPI: stud_info_id.stud_sem8_grade || "",
            college: "", // Add field if available
          });
          console.log("Profile data set correctly");
        } else {
          toast.error(res.data.message);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch profile data.");
      }
    };
    fetchProfileData();
  }, []);

  // Update profile state
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setProfile((prevState) => ({ ...prevState, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `${BackendUrl}/api/student/get_user_details_update `,
        profile,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming you're using token-based auth
          },
        }
      );

      if (res.data.success) {
        toast.success("Profile updated successfully!");
        setIsEditing(false); // Exit edit mode
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Profile Section</h2>
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Editable Profile Fields */}
            <input
              type="text"
              name="firstName"
              value={profile.firstName}
              onChange={handleChange}
              placeholder="First Name"
              className="border border-gray-300 rounded p-2"
              required
            />
            <input
              type="text"
              name="middleName"
              value={profile.middleName}
              onChange={handleChange}
              placeholder="Middle Name"
              className="border border-gray-300 rounded p-2"
            />
            <input
              type="text"
              name="lastName"
              value={profile.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              className="border border-gray-300 rounded p-2"
              required
            />
            <select
              name="gender"
              value={profile.gender}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2"
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <input
              type="text"
              name="fatherName"
              value={profile.fatherName}
              onChange={handleChange}
              placeholder="Father's Name"
              className="border border-gray-300 rounded p-2"
            />
            <input
              type="text"
              name="motherName"
              value={profile.motherName}
              onChange={handleChange}
              placeholder="Mother's Name"
              className="border border-gray-300 rounded p-2"
            />
            <input
              type="text"
              name="rollNumber"
              value={profile.rollNumber}
              onChange={handleChange}
              placeholder="Roll Number"
              className="border border-gray-300 rounded p-2"
              required
            />
            <input
              type="text"
              name="division"
              value={profile.division}
              onChange={handleChange}
              placeholder="Division"
              className="border border-gray-300 rounded p-2"
              required
            />
            <input
              type="date"
              name="dateOfBirth"
              value={profile.dateOfBirth}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2"
              required
            />
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              placeholder="Email"
              className="border border-gray-300 rounded p-2"
              required
            />
            <input
              type="email"
              name="alternateEmail"
              value={profile.alternateEmail}
              onChange={handleChange}
              placeholder="Alternate Email"
              className="border border-gray-300 rounded p-2"
            />
            <input
              type="text"
              name="aadharNumber"
              value={profile.aadharNumber}
              onChange={handleChange}
              placeholder="Aadhar Number"
              className="border border-gray-300 rounded p-2"
            />
            <input
              type="text"
              name="phoneNumber"
              value={profile.phoneNumber}
              onChange={handleChange}
              placeholder="Phone Number"
              className="border border-gray-300 rounded p-2"
              required
            />
            <input
              type="text"
              name="alternatePhoneNo"
              value={profile.alternatePhoneNo}
              onChange={handleChange}
              placeholder="Alternate Phone Number"
              className="border border-gray-300 rounded p-2"
            />
            <input
              type="text"
              name="panNumber"
              value={profile.panNumber}
              onChange={handleChange}
              placeholder="PAN Number"
              className="border border-gray-300 rounded p-2"
            />
            <input
              type="text"
              name="address"
              value={profile.address}
              onChange={handleChange}
              placeholder="Address"
              className="border border-gray-300 rounded p-2"
              required
            />
            <input
              type="text"
              name="state"
              value={profile.state}
              onChange={handleChange}
              placeholder="State"
              className="border border-gray-300 rounded p-2"
              required
            />
            <input
              type="text"
              name="country"
              value={profile.country}
              onChange={handleChange}
              placeholder="Country"
              className="border border-gray-300 rounded p-2"
              required
            />
            <input
              type="text"
              name="pincode"
              value={profile.pincode}
              onChange={handleChange}
              placeholder="Pincode"
              className="border border-gray-300 rounded p-2"
              required
            />
            <select
              name="courseType"
              value={profile.courseType}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2"
              required
            >
              <option value="">Select Course Type</option>
              <option value="Undergraduate">Undergraduate</option>
              <option value="Postgraduate">Postgraduate</option>
            </select>
            <input
              type="text"
              name="admissionYear"
              value={profile.admissionYear}
              onChange={handleChange}
              placeholder="Admission Year"
              className="border border-gray-300 rounded p-2"
              required
            />
            <input
              type="text"
              name="departmentName"
              value={profile.departmentName}
              onChange={handleChange}
              placeholder="Department Name"
              className="border border-gray-300 rounded p-2"
              required
            />
            <input
              type="text"
              name="tenthPercentage"
              value={profile.tenthPercentage}
              onChange={handleChange}
              placeholder="10th Percentage"
              className="border border-gray-300 rounded p-2"
            />
            <input
              type="text"
              name="hscBoard"
              value={profile.hscBoard}
              onChange={handleChange}
              placeholder="HSC Board"
              className="border border-gray-300 rounded p-2"
            />
            <input
              type="text"
              name="twelfthPercentage"
              value={profile.twelfthPercentage}
              onChange={handleChange}
              placeholder="12th Percentage"
              className="border border-gray-300 rounded p-2"
            />
            <input
              type="text"
              name="sscBoard"
              value={profile.sscBoard}
              onChange={handleChange}
              placeholder="SSC Board"
              className="border border-gray-300 rounded p-2"
            />
            <input
              type="text"
              name="cet"
              value={profile.cet}
              onChange={handleChange}
              placeholder="CET"
              className="border border-gray-300 rounded p-2"
            />
            <input
              type="text"
              name="sem1CGPI"
              value={profile.sem1CGPI}
              onChange={handleChange}
              placeholder="Sem 1 CGPI"
              className="border border-gray-300 rounded p-2"
            />
            <input
              type="text"
              name="sem2CGPI"
              value={profile.sem2CGPI}
              onChange={handleChange}
              placeholder="Sem 2 CGPI"
              className="border border-gray-300 rounded p-2"
            />
            <input
              type="text"
              name="sem3CGPI"
              value={profile.sem3CGPI}
              onChange={handleChange}
              placeholder="Sem 3 CGPI"
              className="border border-gray-300 rounded p-2"
            />
            <input
              type="text"
              name="sem4CGPI"
              value={profile.sem4CGPI}
              onChange={handleChange}
              placeholder="Sem 4 CGPI"
              className="border border-gray-300 rounded p-2"
            />
            <input
              type="text"
              name="sem5CGPI"
              value={profile.sem5CGPI}
              onChange={handleChange}
              placeholder="Sem 5 CGPI"
              className="border border-gray-300 rounded p-2"
            />
            <input
              type="text"
              name="sem6CGPI"
              value={profile.sem6CGPI}
              onChange={handleChange}
              placeholder="Sem 6 CGPI"
              className="border border-gray-300 rounded p-2"
            />
            <input
              type="text"
              name="sem7CGPI"
              value={profile.sem7CGPI}
              onChange={handleChange}
              placeholder="Sem 7 CGPI"
              className="border border-gray-300 rounded p-2"
            />
            <input
              type="text"
              name="sem8CGPI"
              value={profile.sem8CGPI}
              onChange={handleChange}
              placeholder="Sem 8 CGPI"
              className="border border-gray-300 rounded p-2"
            />
            <input
              type="text"
              name="college"
              value={profile.college}
              onChange={handleChange}
              placeholder="College"
              className="border border-gray-300 rounded p-2"
            />
          </div>
          <button
            type="submit"
            className="mt-6 w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save Changes
          </button>
        </form>
      ) : (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Display Profile Information */}
            <div>
              <strong>First Name:</strong> {profile.firstName}
            </div>
            <div>
              <strong>Middle Name:</strong> {profile.middleName}
            </div>
            <div>
              <strong>Last Name:</strong> {profile.lastName}
            </div>
            <div>
              <strong>Gender:</strong> {profile.gender}
            </div>
            <div>
              <strong>Father's Name:</strong> {profile.fatherName}
            </div>
            <div>
              <strong>Mother's Name:</strong> {profile.motherName}
            </div>
            <div>
              <strong>Roll Number:</strong> {profile.rollNumber}
            </div>
            <div>
              <strong>Division:</strong> {profile.division}
            </div>
            <div>
              <strong>Date of Birth:</strong> {profile.dateOfBirth}
            </div>
            <div>
              <strong>Email:</strong> {profile.email}
            </div>
            <div>
              <strong>Alternate Email:</strong> {profile.alternateEmail}
            </div>
            <div>
              <strong>Aadhar Number:</strong> {profile.aadharNumber}
            </div>
            <div>
              <strong>Phone Number:</strong> {profile.phoneNumber}
            </div>
            <div>
              <strong>Alternate Phone Number:</strong>{" "}
              {profile.alternatePhoneNo}
            </div>
            <div>
              <strong>PAN Number:</strong> {profile.panNumber}
            </div>
            <div>
              <strong>Address:</strong> {profile.address}
            </div>
            <div>
              <strong>State:</strong> {profile.state}
            </div>
            <div>
              <strong>Country:</strong> {profile.country}
            </div>
            <div>
              <strong>Pincode:</strong> {profile.pincode}
            </div>
            <div>
              <strong>Course Type:</strong> {profile.courseType}
            </div>
            <div>
              <strong>Admission Year:</strong> {profile.admissionYear}
            </div>
            <div>
              <strong>Department Name:</strong> {profile.departmentName}
            </div>
            <div>
              <strong>10th Percentage:</strong> {profile.tenthPercentage}
            </div>
            <div>
              <strong>HSC Board:</strong> {profile.hscBoard}
            </div>
            <div>
              <strong>12th Percentage:</strong> {profile.twelfthPercentage}
            </div>
            <div>
              <strong>SSC Board:</strong> {profile.sscBoard}
            </div>
            <div>
              <strong>CET:</strong> {profile.cet}
            </div>
            <div>
              <strong>Sem 1 CGPI:</strong> {profile.sem1CGPI}
            </div>
            <div>
              <strong>Sem 2 CGPI:</strong> {profile.sem2CGPI}
            </div>
            <div>
              <strong>Sem 3 CGPI:</strong> {profile.sem3CGPI}
            </div>
            <div>
              <strong>Sem 4 CGPI:</strong> {profile.sem4CGPI}
            </div>
            <div>
              <strong>Sem 5 CGPI:</strong> {profile.sem5CGPI}
            </div>
            <div>
              <strong>Sem 6 CGPI:</strong> {profile.sem6CGPI}
            </div>
            <div>
              <strong>Sem 7 CGPI:</strong> {profile.sem7CGPI}
            </div>
            <div>
              <strong>Sem 8 CGPI:</strong> {profile.sem8CGPI}
            </div>
            <div>
              <strong>College:</strong> {profile.college}
            </div>
          </div>
          <button
            className="mt-6 w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </button>
        </div>
      )}    </div>
  );
};

export default ProfileSection;
