import { Router } from "express";
import { authenticateToken } from "../../middlewares/verifyGoogleToken";
import {
  applicationFrom,
  applyToJob,
  authStudent,
  getAllCollegeList,
  getJobAppliedByStudent,
  getJobAppliedDetailsById,
  getJobDetailsById,
  getJobForCollege,
  getRecommendedJobs,
  getStudentsJobStatistics,
  getStudentStatistics,
  getUserDetails,
  isFirstSignIn,
  signup,
} from "../controller/auth";
import { upload } from "../../middlewares/multer";
import { getDepartments } from "../controller/student.controller";

const studentRoutes = Router();

// auth routes
studentRoutes.get("/auth", authenticateToken, authStudent);

studentRoutes.post("/google_login", authenticateToken, signup);

studentRoutes.post(
  "/register/applicationform",
  upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "sem1Marksheet", maxCount: 1 },
    { name: "sem2Marksheet", maxCount: 1 },
    { name: "sem3Marksheet", maxCount: 1 },
    { name: "sem4Marksheet", maxCount: 1 },
    { name: "sem5Marksheet", maxCount: 1 },
    { name: "sem6Marksheet", maxCount: 1 },
    { name: "sem7Marksheet", maxCount: 1 },
    { name: "sem8Marksheet", maxCount: 1 },
    // { name: "cet", maxCount: 1 },
    // { name: "jee", maxCount: 1 },
    // { name: "hsc", maxCount: 1 },
    // { name: "ssc", maxCount: 1 },
    // { name: "diploma", maxCount: 1 },
    // { name: "photoWithSignature", maxCount: 1 },
    // { name: "gapCertificate", maxCount: 1 },
    // { name: "aadhar", maxCount: 1 },
    // { name: "pan", maxCount: 1 },
    // { name: "handicapCert", maxCount: 1 },
  ]),
  authenticateToken,
  applicationFrom
);

studentRoutes.get("/is_first_signin", authenticateToken, isFirstSignIn);
studentRoutes.get("/get_user_details", authenticateToken, getUserDetails);
studentRoutes.put("/update_user_details", authenticateToken, getUserDetails);

// student access to college
studentRoutes.get("/colleges", authenticateToken, getAllCollegeList);

// student student statistics
studentRoutes.get("/statistics", authenticateToken, getStudentStatistics);

studentRoutes.get(
  "/job_statistics",
  authenticateToken,
  getStudentsJobStatistics
);

// student access to company
studentRoutes.get("/companies", authenticateToken, getJobForCollege);
studentRoutes.get("/company/:id", authenticateToken, getJobDetailsById);
studentRoutes.get("/applied_jobs", authenticateToken, getJobAppliedByStudent);
studentRoutes.get("/recommended_jobs", authenticateToken, getRecommendedJobs);
studentRoutes.get(
  "/applied_jobs/:id",
  authenticateToken,
  getJobAppliedDetailsById
);
studentRoutes.post("/department", authenticateToken, getDepartments);

// student applying to job
studentRoutes.post(
  "/apply_job",
  authenticateToken,
  upload.single("app_cover_letter"),
  applyToJob
);
export default studentRoutes;
