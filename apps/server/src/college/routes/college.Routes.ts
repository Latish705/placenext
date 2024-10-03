import Router from "express";
import {
  acceptStudent,
  applicationFrom,
  getAllStudentList,
  getCollegeJobs,
  getStudentById,
  getStudentStatistics,
  isFirstSignIn,
  rejectStudent,
  signup,
} from "../controller/college.controller";
import { authenticateToken } from "../../middlewares/verifyGoogleToken";

const collegeRoutes = Router();

collegeRoutes.get("/is_first_signin", authenticateToken, isFirstSignIn);

collegeRoutes.post("/google_login", authenticateToken, signup);

collegeRoutes.post("/applicationForm", authenticateToken, applicationFrom);

// student routes
collegeRoutes.get("/get_students", authenticateToken, getAllStudentList);
collegeRoutes.get("/get_student/:id", authenticateToken, getStudentById);
collegeRoutes.post("/accept_student", authenticateToken, acceptStudent);
collegeRoutes.post("/reject_student", authenticateToken, rejectStudent);
collegeRoutes.get(
  "/get_students_statistics",
  authenticateToken,
  getStudentStatistics
);

// general routes

// college job routes

collegeRoutes.get("/get_jobs", authenticateToken, getCollegeJobs);
collegeRoutes.get("/get_job/:id", authenticateToken);

export default collegeRoutes;
