"use client";

import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { BackendUrl } from "@/utils/constants";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import withAuth from "@/config/services/Student_Auth_service";
import useLoadingStore from "@/store/loadingStore";

// Validation schema
const applicationFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  courseType: z.string().min(1, "Course type is required"),
  departmentName: z.string().min(1, "Department is required"),
  address: z.string().min(1, "Address is required"),
  college: z.string().min(1, "College is required"),
  admissionYear: z.string().min(1, "Admission year is required"),
  tenthPercentage: z.string().min(1, "10th percentage is required"),
  sscBoard: z.string().min(1, "SSC board is required"),
  alternateEmail: z.string().email("Invalid alternate email").optional().or(z.literal("")),
  alternatePhoneNo: z.string().regex(/^\d{10}$/, "Alternate phone must be 10 digits").optional().or(z.literal("")),
  aadharNumber: z.string().regex(/^\d{12}$/, "Aadhar number must be 12 digits"),
  panNumber: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format"),
  liveBacklogs: z.string().min(1, "Live backlogs count is required"),
  deadBacklogs: z.string().min(1, "Dead backlogs count is required"),
  linkedInLink: z.string().url("Invalid LinkedIn URL").optional().or(z.literal("")),
  githubLink: z.string().url("Invalid GitHub URL").optional().or(z.literal("")),
  twelfthPercentage: z.string().optional(),
  hscBoard: z.string().optional(),
  cet: z.string().optional(),
  sem1CGPI: z.string().optional(),
  sem2CGPI: z.string().optional(),
  sem3CGPI: z.string().optional(),
  sem4CGPI: z.string().optional(),
  sem5CGPI: z.string().optional(),
  sem6CGPI: z.string().optional(),
  sem7CGPI: z.string().optional(),
  sem8CGPI: z.string().optional(),
  prn: z.string().optional(),
  aggregateCGPI: z.string().optional(),
  locationPreference: z.string().optional(),
});

type FormData = z.infer<typeof applicationFormSchema>;

interface Department {
  id: string;
  name: string;
}

interface College {
  id: string;
  name: string;
  departments: Department[];
}

interface FileUpload {
  [key: string]: File | null;
}

const STEPS = [
  { id: 1, title: "Personal Details", description: "Basic information about you" },
  { id: 2, title: "Contact Information", description: "How we can reach you" },
  { id: 3, title: "Academic Details", description: "Your educational background" },
  { id: 4, title: "Documents Upload", description: "Upload required documents" },
  { id: 5, title: "Additional Information", description: "Professional links and preferences" },
];

const DOCUMENT_FIELDS = [
  { key: "sem1Marksheet", label: "Semester 1 Marksheet" },
  { key: "sem2Marksheet", label: "Semester 2 Marksheet" },
  { key: "sem3Marksheet", label: "Semester 3 Marksheet" },
  { key: "sem4Marksheet", label: "Semester 4 Marksheet" },
  { key: "sem5Marksheet", label: "Semester 5 Marksheet" },
  { key: "sem6Marksheet", label: "Semester 6 Marksheet" },
  { key: "sem7Marksheet", label: "Semester 7 Marksheet" },
  { key: "sem8Marksheet", label: "Semester 8 Marksheet" },
  { key: "resume", label: "Resume (PDF)" },
];

function ApplicationForm() {
  const router = useRouter();
  const { setLoading } = useLoadingStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [colleges, setColleges] = useState<College[]>([]);
  const [files, setFiles] = useState<FileUpload>({});
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    trigger,
  } = useForm<FormData>({
    resolver: zodResolver(applicationFormSchema),
    mode: "onBlur",
  });

  // Watch for college selection changes
  const watchedCollege = watch("college");
  
  useEffect(() => {
    if (watchedCollege && colleges.length > 0) {
      const college = colleges.find(c => c.id === watchedCollege);
      setSelectedCollege(college || null);
      // Reset department selection when college changes
      setValue("departmentName", "");
    }
  }, [watchedCollege, colleges, setValue]);

  // Load saved form data and files from localStorage on component mount
  useEffect(() => {
    const savedFormData = localStorage.getItem("applicationFormData");
    const savedFiles = localStorage.getItem("applicationFormFiles");

    if (savedFormData) {
      const parsedData = JSON.parse(savedFormData);
      Object.keys(parsedData).forEach((key) => {
        setValue(key as keyof FormData, parsedData[key]);
      });
    }

    if (savedFiles) {
      const parsedFiles = JSON.parse(savedFiles);
      console.log("Previously uploaded files:", parsedFiles);
    }

    fetchColleges();
  }, [setValue]);

  // Save form data to localStorage whenever form data changes
  const formData = watch();
  useEffect(() => {
    localStorage.setItem("applicationFormData", JSON.stringify(formData));
  }, [formData]);

  const fetchColleges = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BackendUrl}/api/student/colleges`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setColleges(response.data.colleges);
      }
    } catch (error) {
      console.error("Error fetching colleges:", error);
      toast.error("Failed to fetch colleges");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (fieldName === "resume" && file.type !== "application/pdf") {
        toast.error("Resume must be a PDF file");
        return;
      }
      if (fieldName.includes("Marksheet") && file.type !== "application/pdf") {
        toast.error("Marksheets must be PDF files");
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }

      setFiles(prev => {
        const updated = { ...prev, [fieldName]: file };
        // Save file info to localStorage (just the name and size)
        const fileInfo = Object.keys(updated).reduce((acc, key) => {
          if (updated[key]) {
            acc[key] = {
              name: updated[key]!.name,
              size: updated[key]!.size,
              type: updated[key]!.type,
            };
          }
          return acc;
        }, {} as any);
        localStorage.setItem("applicationFormFiles", JSON.stringify(fileInfo));
        return updated;
      });
      toast.success(`${fieldName} uploaded successfully`);
    }
  };

  const nextStep = async () => {
    let fieldsToValidate: (keyof FormData)[] = [];
    
    switch (currentStep) {
      case 1:
        fieldsToValidate = ["firstName", "lastName", "dateOfBirth"];
        break;
      case 2:
        fieldsToValidate = ["email", "phoneNumber", "address"];
        break;
      case 3:
        fieldsToValidate = ["courseType", "departmentName", "college", "admissionYear", "tenthPercentage", "sscBoard", "aadharNumber", "panNumber", "liveBacklogs", "deadBacklogs"];
        break;
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid && currentStep < STEPS.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      setLoading(true);
      
      const formData = new FormData();
      
      // Append form fields
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      // Append files
      Object.entries(files).forEach(([key, file]) => {
        if (file) {
          formData.append(key, file);
        }
      });

      const token = localStorage.getItem("token");
      const refreshToken = localStorage.getItem("refreshToken");

      const response = await axios.post(
        `${BackendUrl}/api/student/register/applicationform`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-refresh-token": refreshToken,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        toast.success("Application submitted successfully!");
        // Clear saved form data
        localStorage.removeItem("applicationFormData");
        localStorage.removeItem("applicationFormFiles");
        router.push("/student/dashboard");
      }
    } catch (error: any) {
      console.error("Error submitting application:", error);
      toast.error(error.response?.data?.msg || "Failed to submit application");
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <PersonalDetails register={register} errors={errors} />;
      case 2:
        return <ContactInformation register={register} errors={errors} />;
      case 3:
        return <AcademicDetails register={register} errors={errors} colleges={colleges} selectedCollege={selectedCollege} />;
      case 4:
        return <DocumentsUpload files={files} onFileChange={handleFileChange} />;
      case 5:
        return <AdditionalInformation register={register} errors={errors} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Student Application Form
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Complete your profile to access placement opportunities
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  currentStep >= step.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                }`}>
                  {step.id}
                </div>
                <div className="mt-2 text-center">
                  <p className={`text-xs font-medium ${
                    currentStep >= step.id ? "text-blue-600" : "text-gray-500"
                  }`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-400 hidden sm:block">
                    {step.description}
                  </p>
                </div>
                {index < STEPS.length - 1 && (
                  <div className={`hidden md:block absolute top-5 w-full h-0.5 transition-colors ${
                    currentStep > step.id ? "bg-blue-600" : "bg-gray-200"
                  }`} style={{ left: "50%", width: "calc(100% - 2.5rem)" }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
              >
                Previous
              </button>

              {currentStep === STEPS.length ? (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Next
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Step Components
const PersonalDetails = ({ register, errors }: any) => (
  <div className="space-y-6">
    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
      Personal Details
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          First Name *
        </label>
        <input
          {...register("firstName")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Enter first name"
        />
        {errors.firstName && (
          <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Middle Name
        </label>
        <input
          {...register("middleName")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Enter middle name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Last Name *
        </label>
        <input
          {...register("lastName")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Enter last name"
        />
        {errors.lastName && (
          <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Date of Birth *
        </label>
        <input
          type="date"
          {...register("dateOfBirth")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        {errors.dateOfBirth && (
          <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth.message}</p>
        )}
      </div>
    </div>
  </div>
);

const ContactInformation = ({ register, errors }: any) => (
  <div className="space-y-6">
    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
      Contact Information
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Email Address *
        </label>
        <input
          type="email"
          {...register("email")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Enter email address"
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Phone Number *
        </label>
        <input
          {...register("phoneNumber")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Enter 10-digit phone number"
        />
        {errors.phoneNumber && (
          <p className="text-red-500 text-xs mt-1">{errors.phoneNumber.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Alternate Email
        </label>
        <input
          type="email"
          {...register("alternateEmail")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Enter alternate email"
        />
        {errors.alternateEmail && (
          <p className="text-red-500 text-xs mt-1">{errors.alternateEmail.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Alternate Phone Number
        </label>
        <input
          {...register("alternatePhoneNo")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Enter alternate phone number"
        />
        {errors.alternatePhoneNo && (
          <p className="text-red-500 text-xs mt-1">{errors.alternatePhoneNo.message}</p>
        )}
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Address *
        </label>
        <textarea
          {...register("address")}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Enter full address"
        />
        {errors.address && (
          <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>
        )}
      </div>
    </div>
  </div>
);

const AcademicDetails = ({ register, errors, colleges, selectedCollege }: any) => (
  <div className="space-y-6">
    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
      Academic Details
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Course Type *
        </label>
        <select
          {...register("courseType")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="">Select course type</option>
          <option value="BTech">B.Tech</option>
          <option value="BE">B.E</option>
          <option value="MTech">M.Tech</option>
          <option value="ME">M.E</option>
          <option value="MCA">MCA</option>
          <option value="MBA">MBA</option>
        </select>
        {errors.courseType && (
          <p className="text-red-500 text-xs mt-1">{errors.courseType.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          College *
        </label>
        <select
          {...register("college")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="">Select college</option>
          {colleges.map((college: College) => (
            <option key={college.id} value={college.id}>
              {college.name}
            </option>
          ))}
        </select>
        {errors.college && (
          <p className="text-red-500 text-xs mt-1">{errors.college.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Department *
        </label>
        <select
          {...register("departmentName")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          disabled={!selectedCollege}
        >
          <option value="">
            {selectedCollege ? "Select department" : "Select college first"}
          </option>
          {selectedCollege?.departments.map((department: Department) => (
            <option key={department.id} value={department.id}>
              {department.name}
            </option>
          ))}
        </select>
        {errors.departmentName && (
          <p className="text-red-500 text-xs mt-1">{errors.departmentName.message}</p>
        )}
        {!selectedCollege && (
          <p className="text-gray-500 text-xs mt-1">Please select a college to see available departments</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Admission Year *
        </label>
        <input
          type="number"
          {...register("admissionYear")}
          min="2000"
          max="2030"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Enter admission year"
        />
        {errors.admissionYear && (
          <p className="text-red-500 text-xs mt-1">{errors.admissionYear.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          10th Percentage *
        </label>
        <input
          type="number"
          {...register("tenthPercentage")}
          min="0"
          max="100"
          step="0.01"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Enter 10th percentage"
        />
        {errors.tenthPercentage && (
          <p className="text-red-500 text-xs mt-1">{errors.tenthPercentage.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          SSC Board *
        </label>
        <input
          {...register("sscBoard")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Enter SSC board"
        />
        {errors.sscBoard && (
          <p className="text-red-500 text-xs mt-1">{errors.sscBoard.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          12th Percentage
        </label>
        <input
          type="number"
          {...register("twelfthPercentage")}
          min="0"
          max="100"
          step="0.01"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Enter 12th percentage"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          HSC Board
        </label>
        <input
          {...register("hscBoard")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Enter HSC board"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Aadhar Number *
        </label>
        <input
          {...register("aadharNumber")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Enter 12-digit Aadhar number"
        />
        {errors.aadharNumber && (
          <p className="text-red-500 text-xs mt-1">{errors.aadharNumber.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          PAN Number *
        </label>
        <input
          {...register("panNumber")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Enter PAN number"
        />
        {errors.panNumber && (
          <p className="text-red-500 text-xs mt-1">{errors.panNumber.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Live Backlogs *
        </label>
        <input
          type="number"
          {...register("liveBacklogs")}
          min="0"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Enter number of live backlogs"
        />
        {errors.liveBacklogs && (
          <p className="text-red-500 text-xs mt-1">{errors.liveBacklogs.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Dead Backlogs *
        </label>
        <input
          type="number"
          {...register("deadBacklogs")}
          min="0"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Enter number of dead backlogs"
        />
        {errors.deadBacklogs && (
          <p className="text-red-500 text-xs mt-1">{errors.deadBacklogs.message}</p>
        )}
      </div>
    </div>

    {/* CGPI Section */}
    <div className="mt-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Semester CGPI (Optional)
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
          <div key={sem}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Sem {sem} CGPI
            </label>
            <input
              type="number"
              {...register(`sem${sem}CGPI` as keyof FormData)}
              min="0"
              max="10"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="0.00"
            />
          </div>
        ))}
      </div>
    </div>
  </div>
);

const DocumentsUpload = ({ files, onFileChange }: any) => (
  <div className="space-y-6">
    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
      Document Upload
    </h2>
    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
      Upload your academic documents and resume. All files must be in PDF format and under 5MB.
    </p>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {DOCUMENT_FIELDS.map((field) => (
        <div key={field.key} className="border border-gray-300 dark:border-gray-600 rounded-lg p-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {field.label}
          </label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => onFileChange(e, field.key)}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900 dark:file:text-blue-300"
          />
          {files[field.key] && (
            <p className="text-xs text-green-600 mt-1">
              ✓ {files[field.key].name} ({(files[field.key].size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
        </div>
      ))}
    </div>
  </div>
);

const AdditionalInformation = ({ register, errors }: any) => (
  <div className="space-y-6">
    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
      Additional Information
    </h2>
    <div className="grid grid-cols-1 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          LinkedIn Profile
        </label>
        <input
          type="url"
          {...register("linkedInLink")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="https://linkedin.com/in/your-profile"
        />
        {errors.linkedInLink && (
          <p className="text-red-500 text-xs mt-1">{errors.linkedInLink.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          GitHub Profile
        </label>
        <input
          type="url"
          {...register("githubLink")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="https://github.com/your-username"
        />
        {errors.githubLink && (
          <p className="text-red-500 text-xs mt-1">{errors.githubLink.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Location Preference
        </label>
        <input
          {...register("locationPreference")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Enter preferred work location"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            PRN Number
          </label>
          <input
            {...register("prn")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Enter PRN number"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Aggregate CGPI
          </label>
          <input
            type="number"
            {...register("aggregateCGPI")}
            min="0"
            max="10"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Enter aggregate CGPI"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          CET Score
        </label>
        <input
          {...register("cet")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Enter CET score"
        />
      </div>
    </div>
  </div>
);

export default ApplicationForm;
