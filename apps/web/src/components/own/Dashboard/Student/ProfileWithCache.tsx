"use client";

import React, { useState } from "react";
import { useStudentData, StudentCacheKeys, invalidateStudentCache } from "@/config/services/student-cache-service";
import { BackendUrl } from "@/utils/constants";
import { toast } from "react-toastify";

interface StudentProfile {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  departmentName: string;
  college: string;
  admissionYear: number;
  placementStatus: string;
  skills: string[];
  linkedIn: string;
  github: string;
  // Add other profile fields as needed
}

const StudentProfileWithCache = () => {
  // Using our custom hook to fetch and manage profile data with intelligent caching
  const [profileData, loading, error, refreshProfile] = useStudentData<StudentProfile>(
    'profile', 
    StudentCacheKeys.PROFILE,
    1800000  // 30 minutes cache
  );

  // State for edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<StudentProfile | null>(null);

  // Initialize form data when profile data is loaded
  React.useEffect(() => {
    if (profileData && !formData) {
      setFormData({ ...profileData });
    }
  }, [profileData, formData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const skills = e.target.value.split(',').map(skill => skill.trim());
    setFormData(prev => prev ? { ...prev, skills } : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData) return;
    
    try {
      const response = await fetch(`${BackendUrl}/api/student/update-profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      
      // Important: Invalidate the profile cache after updating
      invalidateStudentCache(StudentCacheKeys.PROFILE);
      
      // Refresh the profile data
      await refreshProfile();
      
      setIsEditing(false);
      toast.success('Profile updated successfully!');
      
    } catch (err) {
      console.error('Error updating profile:', err);
      toast.error('Failed to update profile. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 rounded-lg border border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900/20">
        <h3 className="text-red-600 dark:text-red-400 font-medium">Error loading profile</h3>
        <p className="text-red-600 dark:text-red-400 mt-2">{error.message}</p>
        <button 
          onClick={refreshProfile}
          className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="p-6 rounded-lg border border-yellow-200 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900/20">
        <h3 className="text-yellow-600 dark:text-yellow-400 font-medium">Profile Not Found</h3>
        <p className="text-yellow-600 dark:text-yellow-400 mt-2">
          Your profile information could not be found. Please complete your profile.
        </p>
        <button 
          onClick={() => window.location.href = '/student/applicationform'}
          className="mt-4 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md"
        >
          Complete Profile
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Student Profile</h2>
        
        <div className="flex gap-2">
          <button
            onClick={refreshProfile}
            className="px-3 py-1.5 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Refresh
          </button>
          
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Edit Profile
            </button>
          ) : (
            <button
              onClick={() => {
                setFormData({ ...profileData });
                setIsEditing(false);
              }}
              className="px-3 py-1.5 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {isEditing && formData ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                disabled
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Email cannot be changed</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                LinkedIn Profile
              </label>
              <input
                type="url"
                name="linkedIn"
                value={formData.linkedIn}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                GitHub Profile
              </label>
              <input
                type="url"
                name="github"
                value={formData.github}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Skills (comma separated)
              </label>
              <input
                type="text"
                name="skills"
                value={formData.skills.join(', ')}
                onChange={handleSkillsChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          
          <div className="flex justify-end mt-6">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Full Name</h3>
              <p className="mt-1 text-base text-gray-900 dark:text-white">
                {profileData.firstName} {profileData.lastName}
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</h3>
              <p className="mt-1 text-base text-gray-900 dark:text-white">{profileData.email}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone Number</h3>
              <p className="mt-1 text-base text-gray-900 dark:text-white">{profileData.phoneNumber}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Department</h3>
              <p className="mt-1 text-base text-gray-900 dark:text-white">{profileData.departmentName}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">College</h3>
              <p className="mt-1 text-base text-gray-900 dark:text-white">{profileData.college}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Admission Year</h3>
              <p className="mt-1 text-base text-gray-900 dark:text-white">{profileData.admissionYear}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Placement Status</h3>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                ${profileData.placementStatus === 'Placed' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                {profileData.placementStatus}
              </span>
            </div>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Skills</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {profileData.skills.map((skill, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Profiles</h3>
            <div className="flex gap-4">
              {profileData.linkedIn && (
                <a 
                  href={profileData.linkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  LinkedIn Profile
                </a>
              )}
              
              {profileData.github && (
                <a 
                  href={profileData.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  GitHub Profile
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentProfileWithCache;
