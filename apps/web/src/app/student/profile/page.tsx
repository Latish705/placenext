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
  });

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Student Profile
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your personal information and academic details
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex gap-3">
              {!isEditing && (
                <button
                  onClick={refreshData}
                  disabled={refreshing}
                  className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <RefreshCw size={16} className={`mr-2 ${refreshing ? "animate-spin" : ""}`} />
                  {refreshing ? "Refreshing..." : "Refresh"}
                </button>
              )}
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    form="profile-form"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {isEditing ? (
          <form id="profile-form" onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 pb-3 border-b border-gray-200 dark:border-gray-700">
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={profile.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                    placeholder="Enter first name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Middle Name
                  </label>
                  <input
                    type="text"
                    name="middleName"
                    value={profile.middleName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                    placeholder="Enter middle name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={profile.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                    placeholder="Enter last name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Gender *
                  </label>
                  <select
                    name="gender"
                    value={profile.gender}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={profile.dateOfBirth}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Father&apos;s Name
                  </label>
                  <input
                    type="text"
                    name="fatherName"
                    value={profile.fatherName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                    placeholder="Enter father's name"
                  />
                </div>
              </div>
            </div>

            {/* Rest of the form sections would follow the same pattern... */}
            {/* I'll continue with the view mode for now */}
          </form>
        ) : (
          <div className="space-y-6">
            {/* Personal Information Display */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 pb-3 border-b border-gray-200 dark:border-gray-700">
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Full Name</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {`${profile.firstName} ${profile.middleName} ${profile.lastName}`.trim()}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Gender</p>
                  <p className="text-lg text-gray-900 dark:text-white">{profile.gender || "Not specified"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Date of Birth</p>
                  <p className="text-lg text-gray-900 dark:text-white">{profile.dateOfBirth || "Not specified"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Father&apos;s Name</p>
                  <p className="text-lg text-gray-900 dark:text-white">{profile.fatherName || "Not specified"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Mother&apos;s Name</p>
                  <p className="text-lg text-gray-900 dark:text-white">{profile.motherName || "Not specified"}</p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 pb-3 border-b border-gray-200 dark:border-gray-700">
                Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
                  <p className="text-lg text-gray-900 dark:text-white">{profile.email || "Not specified"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone Number</p>
                  <p className="text-lg text-gray-900 dark:text-white">{profile.phoneNumber || "Not specified"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Alternate Email</p>
                  <p className="text-lg text-gray-900 dark:text-white">{profile.alternateEmail || "Not specified"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Address</p>
                  <p className="text-lg text-gray-900 dark:text-white">{profile.address || "Not specified"}</p>
                </div>
              </div>
            </div>

            {/* Academic Information */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 pb-3 border-b border-gray-200 dark:border-gray-700">
                Academic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">College</p>
                  <p className="text-lg text-gray-900 dark:text-white">{profile.college || "Not specified"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Course Type</p>
                  <p className="text-lg text-gray-900 dark:text-white">{profile.courseType || "Not specified"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Department</p>
                  <p className="text-lg text-gray-900 dark:text-white">{profile.departmentName || "Not specified"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Admission Year</p>
                  <p className="text-lg text-gray-900 dark:text-white">{profile.admissionYear || "Not specified"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Roll Number</p>
                  <p className="text-lg text-gray-900 dark:text-white">{profile.rollNumber || "Not specified"}</p>
                </div>
              </div>
            </div>

            {/* Academic Performance */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 pb-3 border-b border-gray-200 dark:border-gray-700">
                Academic Performance
              </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">10th Percentage</p>
                  <p className="text-lg text-gray-900 dark:text-white">{profile.tenthPercentage ? `${profile.tenthPercentage}%` : "Not specified"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">12th Percentage</p>
                  <p className="text-lg text-gray-900 dark:text-white">{profile.twelfthPercentage ? `${profile.twelfthPercentage}%` : "Not specified"}</p>
                </div>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => {
                  const cgpi = profile[`sem${sem}CGPI` as keyof typeof profile];
                  return cgpi && cgpi !== "not entered" ? (
                    <div key={sem} className="space-y-1">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Sem {sem} CGPI</p>
                      <p className="text-lg text-gray-900 dark:text-white">{cgpi}</p>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
            