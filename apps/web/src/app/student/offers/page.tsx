"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { BackendUrl } from "@/utils/constants";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import useLoadingStore from "@/store/loadingStore";
import { FaCheckCircle, FaTimesCircle, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaBriefcase, FaMoneyBillWave, FaClock } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { fetchStudentData, StudentCacheKeys, clearStudentCache } from "@/config/services/cache_service";

interface JobOffer {
  _id: string;
  job_title: string;
  company_name: string;
  company_logo: string;
  job_location: string;
  job_type: string;
  job_salary: number;
  status: string;
  offer_date: string;
  response_deadline: string;
  job_description: string;
  job_contact_email: string;
  job_contact_phone: string;
  job_requirements: string[];
}

interface OffersResponse {
  success: boolean;
  message?: string;
  offers: JobOffer[];
}

export default function JobOffers() {
  const router = useRouter();
  const { setLoading } = useLoadingStore();
  const [offers, setOffers] = useState<JobOffer[]>([]);
  const [activeOffer, setActiveOffer] = useState<JobOffer | null>(null);
  const [responseLoading, setResponseLoading] = useState({
    id: "",
    loading: false
  });

  const [refreshing, setRefreshing] = useState(false);

  // Function to refresh data and clear cache
  const refreshData = async () => {
    setRefreshing(true);
    try {
      // Clear cache keys related to student offers
      clearStudentCache(StudentCacheKeys.OFFERS);
      
      // Fetch fresh data
      await fetchOffers();
      toast.success("Offers data refreshed");
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast.error("Failed to refresh offers");
    } finally {
      setRefreshing(false);
    }
  };

  // Function to fetch offers with caching
  const fetchOffers = async () => {
    setLoading(true);
    try {
      // Use fetchStudentData for offers with cache
      const offersData = await fetchStudentData<OffersResponse>(
        `${BackendUrl}/api/student/job_offers`,
        StudentCacheKeys.OFFERS,
        {
          expirationMs: 300000, // 5 minutes cache for offers
          fetchOptions: {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        }
      );
      console.log(offersData);
      
      if (offersData.success) {
        setOffers(offersData.offers);
        if (offersData.offers.length > 0) {
          setActiveOffer(offersData.offers[0]);
        }
      } else {
        toast.error("Failed to fetch job offers");
      }
    } catch (error) {
      console.error("Error fetching job offers:", error);
      toast.error("An error occurred while fetching your job offers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, [setLoading]);

  const handleAcceptOffer = async (offerId: string) => {
    setResponseLoading({
      id: offerId,
      loading: true
    });
    
    try {
      const response = await axios.post(
        `${BackendUrl}/api/student/accept_offer`,
        { offerId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(response.data);
      
      if (response.data.success) {
        toast.success("Job offer accepted successfully!");
        
        // Clear cache related to offers and dashboard stats
        clearStudentCache(StudentCacheKeys.OFFERS);
        clearStudentCache(StudentCacheKeys.DASHBOARD_STATS);
        
        // Update the local state to reflect the change
        setOffers(offers.map(offer => 
          offer._id === offerId ? { ...offer, status: "accepted" } : offer
        ));
        
        if (activeOffer && activeOffer._id === offerId) {
          setActiveOffer({ ...activeOffer, status: "accepted" });
        }
      } else {
        toast.error(response.data.message || "Failed to accept offer");
      }
    } catch (error) {
      console.error("Error accepting job offer:", error);
      toast.error("An error occurred while accepting the offer");
    } finally {
      setResponseLoading({
        id: "",
        loading: false
      });
    }
  };

  const handleRejectOffer = async (offerId: string) => {
    setResponseLoading({
      id: offerId,
      loading: true
    });
    
    try {
      const response = await axios.post(
        `${BackendUrl}/api/student/reject_offer`,
        { offerId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      
      if (response.data.success) {
        toast.success("Job offer rejected");
        
        // Clear cache related to offers and dashboard stats
        clearStudentCache(StudentCacheKeys.OFFERS);
        clearStudentCache(StudentCacheKeys.DASHBOARD_STATS);
        
        // Update the local state to reflect the change
        setOffers(offers.map(offer => 
          offer._id === offerId ? { ...offer, status: "rejected" } : offer
        ));
        
        if (activeOffer && activeOffer._id === offerId) {
          setActiveOffer({ ...activeOffer, status: "rejected" });
        }
      } else {
        toast.error(response.data.message || "Failed to reject offer");
      }
    } catch (error) {
      console.error("Error rejecting job offer:", error);
      toast.error("An error occurred while rejecting the offer");
    } finally {
      setResponseLoading({
        id: "",
        loading: false
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'accepted':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="container mx-auto p-4 pt-10 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Job Offers</h1>
        
        {/* Refresh Button */}
        <button
          onClick={refreshData}
          disabled={refreshing || responseLoading.loading}
          className={`inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-3
            ${refreshing 
              ? 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
            }`}
          aria-label="Refresh offers data"
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
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 dark:text-white">
        Your Job Offers
      </h1>

      {offers.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
          <div className="flex justify-center mb-4">
            <FaBriefcase className="text-gray-400 text-5xl" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-300">
            No Job Offers Yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            You haven&apos;t received any job offers yet. Keep applying to jobs!
          </p>
          <Button
            onClick={() => router.push('/student/applyjob')}
            className="bg-primary hover:bg-blue-700"
          >
            Browse Available Jobs
          </Button>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left sidebar - List of offers */}
          <div className="lg:w-1/3">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <h2 className="p-4 bg-gray-50 dark:bg-gray-700 font-semibold text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-600">
                All Offers ({offers.length})
              </h2>
              <div className="overflow-y-auto max-h-[60vh]">
                {offers.map((offer) => (
                  <motion.div
                    key={offer._id}
                    whileHover={{ backgroundColor: "rgba(0,0,0,0.03)" }}
                    whileTap={{ backgroundColor: "rgba(0,0,0,0.05)" }}
                    className={`p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer ${
                      activeOffer?._id === offer._id
                        ? "bg-blue-50 dark:bg-blue-900/30"
                        : ""
                    }`}
                    onClick={() => setActiveOffer(offer)}
                  >
                    <div className="flex items-center">

                        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center mr-3">
                          <span className="text-gray-500 dark:text-gray-400 font-semibold">
                            {offer.company_name.charAt(0)}
                          </span>
                        </div>
                      
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800 dark:text-white">
                          {offer.job_title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {offer.company_name}
                        </p>
                      </div>
                      <div>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                            offer.status
                          )}`}
                        >
                          {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Right content - Selected offer details */}
          {activeOffer && (
            <div className="lg:w-2/3 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                  <div className="flex items-center mb-4 md:mb-0">
                      <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center mr-4">
                        <span className="text-gray-500 dark:text-gray-400 text-xl font-bold">
                          {activeOffer.company_name.charAt(0)}
                        </span>
                      </div>
                    
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                        {activeOffer.job_title}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-300">
                        {activeOffer.company_name}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-sm px-3 py-1 rounded-full ${getStatusColor(
                      activeOffer.status
                    )} self-start md:self-center`}
                  >
                    {activeOffer.status === "pending" && "Awaiting Response"}
                    {activeOffer.status === "accepted" && "Accepted"}
                    {activeOffer.status === "rejected" && "Rejected"}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <FaMapMarkerAlt className="mr-2" />
                    <span>{activeOffer.job_location}</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <FaBriefcase className="mr-2" />
                    <span>{activeOffer.job_type}</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <FaMoneyBillWave className="mr-2" />
                    <span>₹{activeOffer.job_salary.toLocaleString()} per annum</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <FaClock className="mr-2" />
                    <span>Offer received: {formatDate(activeOffer.offer_date)}</span>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
                    Job Description
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
                    {activeOffer.job_description}
                  </p>
                </div>

                {activeOffer.job_requirements && activeOffer.job_requirements.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
                      Requirements
                    </h3>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300">
                      {activeOffer.job_requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-6">
                  <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeOffer.job_contact_email && (
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <FaEnvelope className="mr-2" />
                        <a
                          href={`mailto:${activeOffer.job_contact_email}`}
                          className="text-primary hover:underline"
                        >
                          {activeOffer.job_contact_email}
                        </a>
                      </div>
                    )}
                    {activeOffer.job_contact_phone && (
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <FaPhoneAlt className="mr-2" />
                        <a
                          href={`tel:${activeOffer.job_contact_phone}`}
                          className="text-primary hover:underline"
                        >
                          {activeOffer.job_contact_phone}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between">
                    {activeOffer.response_deadline && (
                      <p className="text-amber-600 dark:text-amber-400 mb-4 sm:mb-0">
                        <span className="font-semibold">Response needed by:</span> {formatDate(activeOffer.response_deadline)}
                      </p>
                    )}
                    
                    {activeOffer.status === "pending" && (
                      <div className="flex space-x-4">
                        <Button
                          onClick={() => handleRejectOffer(activeOffer._id)}
                          variant="outline"
                          className="border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30"
                          disabled={responseLoading.loading}
                        >
                          <FaTimesCircle className="mr-2" />
                          {responseLoading.id === activeOffer._id && responseLoading.loading
                            ? "Rejecting..."
                            : "Reject Offer"}
                        </Button>
                        <Button
                          onClick={() => handleAcceptOffer(activeOffer._id)}
                          className="bg-green-600 hover:bg-green-700"
                          disabled={responseLoading.loading}
                        >
                          <FaCheckCircle className="mr-2" />
                          {responseLoading.id === activeOffer._id && responseLoading.loading
                            ? "Accepting..."
                            : "Accept Offer"}
                        </Button>
                      </div>
                    )}
                    
                    {activeOffer.status === "accepted" && (
                      <div className="flex items-center text-green-600">
                        <FaCheckCircle className="mr-2" />
                        <span className="font-medium">You have accepted this offer</span>
                      </div>
                    )}
                    
                    {activeOffer.status === "rejected" && (
                      <div className="flex items-center text-red-600">
                        <FaTimesCircle className="mr-2" />
                        <span className="font-medium">You have rejected this offer</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
