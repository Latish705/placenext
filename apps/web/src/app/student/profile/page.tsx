"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { BackendUrl } from "@/utils/constants";
import { fetchStudentData, StudentCacheKeys, clearStudentCache } from "@/config/services/cache_service";
import { RefreshCw } from "lucide-react";
import useLoadingStore from "@/store/loadingStore";

const Profile = () => {
  const { setLoading } = useLoadingStore();
  const [isEditing, setIsEditing] = useState(false);
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
    sem1Marksheet: "",
    sem2Marksheet: "",
    sem3Marksheet: "",
    sem4Marksheet: "",
    sem5Marksheet: "",
    sem6Marksheet: "",
    sem7Marksheet: "",
    sem8Marksheet: "",
  });

  const [marksheets, setMarksheets] = useState({
    sem1: null,
    sem2: null,
    sem3: null,
    sem4: null,
    sem5: null,
    sem6: null,
    sem7: null,
    sem8: null,
  });

  // State for refresh button
  const [refreshing, setRefreshing] = useState(false);

  // Fetch user profile data with caching
  const fetchProfile = async (forceRefresh = false) => {
    try {
      setLoading(true);
      
      if (forceRefresh) {
        // Clear profile cache when forcing refresh
        clearStudentCache(StudentCacheKeys.PROFILE);
      }
      
      // Use fetchStudentData with proper caching
      const response = await fetchStudentData(
        `${BackendUrl}/api/student/get_user_details`,
        StudentCacheKeys.PROFILE,
        {
          
          // Cache for 30 minutes (profile data doesn't change frequently)
          expirationMs: 30 * 60 * 1000,
          fetchOptions:{
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        }
      );
      //@ts-ignore
      if (response.success) {
        //@ts-ignore
        const { student } = response;
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
          stud_college_id,
        } = student;
        localStorage.setItem("name", stud_name);

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
          gender: "", // You can set default or fetch this info if available
          fatherName: "", // Add field if available in the response
          motherName: "", // Add field if available in the response
          rollNumber: "", // Add field if available in the response
          division: "", // Add field if available in the response
          dateOfBirth: new Date(stud_dob).toISOString().split("T")[0], // Format the date for input field
          email: stud_email,
          alternateEmail: stud_info_id.stud_alternate_email || "",
          aadharNumber: stud_info_id.stud_aadhar || "",
          phoneNumber: stud_phone,
          alternatePhoneNo: stud_info_id.stud_alternate_phone || "",
          panNumber: stud_info_id.stud_pan || "",
          address: stud_address,
          state: "", // Set if available
          country: "", // Set if available
          pincode: "", // Set if available
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
          sem5CGPI: stud_info_id.stud_sem5_grade || "not entered",
          sem6CGPI: stud_info_id.stud_sem6_grade || "not entered",
          sem7CGPI: stud_info_id.stud_sem7_grade || "not entered",
          sem8CGPI: stud_info_id.stud_sem8_grade || "not entered",
          //@ts-ignore
          college: stud_college_id.coll_name, // Add field if available
          sem1Marksheet: stud_info_id.stud_sem1_marksheet,
          sem2Marksheet: stud_info_id.stud_sem2_marksheet,
          sem3Marksheet: stud_info_id.stud_sem3_marksheet,
          sem4Marksheet: stud_info_id.stud_sem4_marksheet,
          sem5Marksheet: stud_info_id.stud_sem5_marksheet || "not entered",
          sem6Marksheet: stud_info_id.stud_sem6_marksheet || "not entered",
          sem7Marksheet: stud_info_id.stud_sem7_marksheet || "not entered",
          sem8Marksheet: stud_info_id.stud_sem8_marksheet || "not entered",
        });
        console.log("Profile data set correctly");
      } else {
        //@ts-ignore
        toast.error(response.message || "Failed to fetch profile.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch profile.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Function to refresh profile data
  const refreshData = async () => {
    setRefreshing(true);
    await fetchProfile(true);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: any, semester: any) => {
    const file = e.target.files[0];
    if (file) {
      setMarksheets((prev) => ({ ...prev, [semester]: file }));
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const formData = new FormData();
    // Append profile data
    Object.keys(profile).forEach((key) => {
      //@ts-ignore
      formData.append(key, profile[key]);
    });

    // Append marksheets
    Object.keys(marksheets).forEach((semester) => {
      //@ts-ignore
      if (marksheets[semester]) {
        //@ts-ignore
        formData.append(`${semester}Marksheet`, marksheets[semester]);
      }
    });

    try {
      const res = await axios.put(
        `${BackendUrl}/api/student/update_user_details`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data.success) {
        // Clear profile cache after update
        clearStudentCache(StudentCacheKeys.PROFILE);
        toast.success("Profile updated successfully!");
        setIsEditing(false); // Exit edit mode
        // Refetch the profile to get the updated data
        fetchProfile(true);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Profile</h1>
        {!isEditing && (
          <button
            onClick={refreshData}
            disabled={refreshing}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-md"
          >
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        )}
      </div>
      
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label>
                First Name:
                <input
                  type="text"
                  name="firstName"
                  value={profile.firstName}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded p-2"
                />
              </label>
            </div>
            <div>
              <label>
                Middle Name:
                <input
                  type="text"
                  name="middleName"
                  value={profile.middleName}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded p-2"
                />
              </label>
            </div>
            <div>
              <label>
                Last Name:
                <input
                  type="text"
                  name="lastName"
                  value={profile.lastName}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded p-2"
                />
              </label>
            </div>
            <div>
              <label>
                Gender:
                <input
                  type="text"
                  name="gender"
                  value={profile.gender}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded p-2"
                />
              </label>
            </div>
            <div>
              <label>
                Father&apos; s Name:
                <input
                  type="text"
                  name="fatherName"
                  value={profile.fatherName}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded p-2"
                />
              </label>
            </div>
            <div>
              <label>
                Mother&apos; s Name:
                <input
                  type="text"
                  name="motherName"
                  value={profile.motherName}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded p-2"
                />
              </label>
            </div>
            <div>
              <label>
                Roll Number:
                <input
                  type="text"
                  name="rollNumber"
                  value={profile.rollNumber}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded p-2"
                />
              </label>
            </div>
            <div>
              <label>
                Division:
                <input
                  type="text"
                  name="division"
                  value={profile.division}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded p-2"
                />
              </label>
            </div>
            <div>
              <label>
                Date of Birth:
                <input
                  type="date"
                  name="dateOfBirth"
                  value={profile.dateOfBirth}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded p-2"
                />
              </label>
            </div>
            <div>
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded p-2"
                />
              </label>
            </div>
            <div>
              <label>
                Alternate Email:
                <input
                  type="email"
                  name="alternateEmail"
                  value={profile.alternateEmail}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded p-2"
                />
              </label>
            </div>
            <div>
              <label>
                Aadhar Number:
                <input
                  type="text"
                  name="aadharNumber"
                  value={profile.aadharNumber}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded p-2"
                />
              </label>
            </div>
            <div>
              <label>
                Phone Number:
                <input
                  type="text"
                  name="phoneNumber"
                  value={profile.phoneNumber}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded p-2"
                />
              </label>
            </div>
            <div>
              <label>
                Alternate Phone Number:
                <input
                  type="text"
                  name="alternatePhoneNo"
                  value={profile.alternatePhoneNo}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded p-2"
                />
              </label>
            </div>
            <div>
              <label>
                PAN Number:
                <input
                  type="text"
                  name="panNumber"
                  value={profile.panNumber}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded p-2"
                />
              </label>
            </div>
            <div>
              <label>
                Address:
                <input
                  type="text"
                  name="address"
                  value={profile.address}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded p-2"
                />
              </label>
            </div>
            <div>
              <label>
                State:
                <input
                  type="text"
                  name="state"
                  value={profile.state}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded p-2"
                />
              </label>
            </div>
            <div>
              <label>
                Country:
                <input
                  type="text"
                  name="country"
                  value={profile.country}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded p-2"
                />
              </label>
            </div>
            <div>
              <label>
                Pincode:
                <input
                  type="text"
                  name="pincode"
                  value={profile.pincode}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded p-2"
                />
              </label>
            </div>
            <div>
              <label>
                Course Type:
                <input
                  type="text"
                  name="courseType"
                  value={profile.courseType}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded p-2"
                />
              </label>
            </div>
            <div>
              <label>
                Admission Year:
                <input
                  type="text"
                  name="admissionYear"
                  value={profile.admissionYear}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded p-2"
                />
              </label>
            </div>
            <div>
              <label>
                Department Name:
                <input
                  type="text"
                  name="departmentName"
                  value={profile.departmentName}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded p-2"
                />
              </label>
            </div>
            <div>
              <label>
                Tenth Percentage:
                <input
                  type="text"
                  name="tenthPercentage"
                  value={profile.tenthPercentage}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded p-2"
                />
              </label>
            </div>
            <div>
              <label>
                HSC Board:
                <input
                  type="text"
                  name="hscBoard"
                  value={profile.hscBoard}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded p-2"
                />
              </label>
            </div>
            <div>
              <label>
                Twelfth Percentage:
                <input
                  type="text"
                  name="twelfthPercentage"
                  value={profile.twelfthPercentage}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded p-2"
                />
              </label>
            </div>
            <div>
              <label>
                SSC Board:
                <input
                  type="text"
                  name="sscBoard"
                  value={profile.sscBoard}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded p-2"
                />
              </label>
            </div>
            <div>
              <label>
                CET:
                <input
                  type="text"
                  name="cet"
                  value={profile.cet}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded p-2"
                />
              </label>
            </div>
            <div>
              <label>
                Semester 1 CGPI:
                <input
                  type="text"
                  name="sem1CGPI"
                  value={profile.sem1CGPI}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded p-2"
                />
              </label>
            </div>
            <div>
              <label>
                Semester 2 CGPI:
                <input
                  type="text"
                  name="sem2CGPI"
                  value={profile.sem2CGPI}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded p-2"
                />
              </label>
            </div>
            <div>
              <label>
                Semester 3 CGPI:
                <input
                  type="text"
                  name="sem3CGPI"
                  value={profile.sem3CGPI}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded p-2"
                />
              </label>
            </div>
            <div>
              <label>
                Semester 4 CGPI:
                <input
                  type="text"
                  name="sem4CGPI"
                  value={profile.sem4CGPI}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded p-2"
                />
              </label>
            </div>
            <div>
              <label>
                Semester 5 CGPI:
                <input
                  type="text"
                  name="sem5CGPI"
                  value={profile.sem5CGPI}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded p-2"
                />
              </label>
            </div>
            <div>
              <label>
                Semester 6 CGPI:
                <input
                  type="text"
                  name="sem6CGPI"
                  value={profile.sem6CGPI}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded p-2"
                />
              </label>
            </div>
            <div>
              <label>
                Semester 7 CGPI:
                <input
                  type="text"
                  name="sem7CGPI"
                  value={profile.sem7CGPI}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded p-2"
                />
              </label>
            </div>
            <div>
              <label>
                Semester 8 CGPI:
                <input
                  type="text"
                  name="sem8CGPI"
                  value={profile.sem8CGPI}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded p-2"
                />
              </label>
            </div>
            <div>
              <label>
                College:
                <input
                  type="text"
                  name="college"
                  value={profile.college}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded p-2"
                />
              </label>
            </div>
            {/* Marksheets */}
            <div>
              <label>
                Semester 1 Marksheet:
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleFileChange(e, "sem1")}
                  className="border border-gray-300 rounded p-2"
                />
              </label>
            </div>
            <div>
              <label>
                Semester 2 Marksheet:
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleFileChange(e, "sem2")}
                  className="border border-gray-300 rounded p-2"
                />
              </label>
            </div>
            <div>
              <label>
                Semester 3 Marksheet:
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleFileChange(e, "sem3")}
                  className="border border-gray-300 rounded p-2"
                />
              </label>
            </div>
            <div>
              <label>
                Semester 4 Marksheet:
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleFileChange(e, "sem4")}
                  className="border border-gray-300 rounded p-2"
                />
              </label>
            </div>
            <div>
              <label>
                Semester 5 Marksheet:
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleFileChange(e, "sem5")}
                  className="border border-gray-300 rounded p-2"
                />
              </label>
            </div>
            <div>
              <label>
                Semester 6 Marksheet:
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleFileChange(e, "sem6")}
                  className="border border-gray-300 rounded p-2"
                />
              </label>
            </div>
            <div>
              <label>
                Semester 7 Marksheet:
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleFileChange(e, "sem7")}
                  className="border border-gray-300 rounded p-2"
                />
              </label>
            </div>
            <div>
              <label>
                Semester 8 Marksheet:
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleFileChange(e, "sem8")}
                  className="border border-gray-300 rounded p-2"
                />
              </label>
            </div>
          </div>
          <div className="mt-4">
            <button
              type="submit"
              className="bg-blue-500 text-white rounded px-4 py-2"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="ml-2 bg-gray-300 text-black rounded px-4 py-2"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div>
          <h2 className="text-xl font-bold mb-4">User Details</h2>
          <p>
            <strong>Name:</strong> {profile.firstName}
          </p>
          <p>
            <strong>Middle Name:</strong> {profile.middleName}
          </p>
          <p>
            <strong>Last Name:</strong> {profile.lastName}
          </p>
          <p>
            <strong>Email:</strong> {profile.email}
          </p>
          <p>
            <strong>Mobile Number:</strong> {profile.phoneNumber}
          </p>
          <p>
            <strong>Address:</strong> {profile.address}
          </p>
          {/* <p>
            <strong>City:</strong> {profile.city}
          </p> */}
          <p>
            <strong>State:</strong> {profile.state}
          </p>
          <p>
            <strong>Country:</strong> {profile.country}
          </p>
          <p>
            <strong>Pincode:</strong> {profile.pincode}
          </p>
          <p>
            <strong>Course Type:</strong> {profile.courseType}
          </p>
          <p>
            <strong>Admission Year:</strong> {profile.admissionYear}
          </p>
          <p>
            <strong>Department Name:</strong> {profile.departmentName}
          </p>
          <p>
            <strong>Tenth Percentage:</strong> {profile.tenthPercentage}
          </p>
          <p>
            <strong>HSC Board:</strong> {profile.hscBoard}
          </p>
          <p>
            <strong>Twelfth Percentage:</strong> {profile.twelfthPercentage}
          </p>
          <p>
            <strong>SSC Board:</strong> {profile.sscBoard}
          </p>
          <p>
            <strong>CET:</strong> {profile.cet}
          </p>
          <p>
            <strong>Semester 1 CGPI:</strong> {profile.sem1CGPI}
          </p>
          <p>
            <strong>Semester 2 CGPI:</strong> {profile.sem2CGPI}
          </p>
          <p>
            <strong>Semester 3 CGPI:</strong> {profile.sem3CGPI}
          </p>
          <p>
            <strong>Semester 4 CGPI:</strong> {profile.sem4CGPI}
          </p>
          <p>
            <strong>Semester 5 CGPI:</strong> {profile.sem5CGPI}
          </p>
          <p>
            <strong>Semester 6 CGPI:</strong> {profile.sem6CGPI}
          </p>
          <p>
            <strong>Semester 7 CGPI:</strong> {profile.sem7CGPI}
          </p>
          <p>
            <strong>Semester 8 CGPI:</strong> {profile.sem8CGPI}
          </p>
          <p>
            <strong>College:</strong> {profile.college}
          </p>
          <button
            onClick={() => setIsEditing(true)}
            className="mt-4 bg-blue-500 text-white rounded px-4 py-2"
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;
