import Router from "express";
import {
  acceptStudent,
  applicationFrom,
  collegeAuth,
  // createJobByCollege,
  facultyProfile,
  getAllColleges,
  getAllStudentList,
  getCollegeJobs,
  getColleges,
  getDepartmentStatistics,
  getFilteredStudentDetailsInExcel,
  getFilteredStudentList,
  getJobDetailsById,
  getStudentById,
  getStudentDetailsInExcel,
  getStudentStatistics,
  isFirstSignIn,
  placeStudent,
  rejectStudent,
  signup,
} from "../controller/college.controller";
import { authenticateToken } from "../../middlewares/verifyGoogleToken";
import { create_faculty } from "../controller/faculty.controller";

  // getDepartmentWiseEligibleStudents,
//   getDepartmentWisePlacementStatus,
//   markAsPlaced,
//   totalNoOfOffers,
//   studentsAcceptedUnder6LPA,
//   studentsAcceptedSecondOfferOver6LPA,
//   getOffersAbove6LPA,
//   getOffersBelow6LPA
// } from "../controller/manageStudent.controller";

import {
  getDepartmentWiseEligibleStudents,
  getDepartmentWisePlacementStatus,
  markAsPlaced,
  totalNoOfOffers,
  studentsAcceptedUnder6LPA,
  studentsAcceptedSecondOfferOver6LPA,
  getOffersAbove6LPA,
  getOffersBelow6LPA
} from "../controller/manageStudent.controller";

import {
  getPendingJobs,
  getApprovedJobs,
  manageJob,
  getAllJobs,
  getJobById
} from "../controller/jobs.controller";
// Job management routes for faculty/admin



const collegeRoutes = Router();
collegeRoutes.get("/jobs/pending", authenticateToken, getPendingJobs);
collegeRoutes.get("/jobs/approved", authenticateToken, getApprovedJobs);
collegeRoutes.post("/jobs/manage", authenticateToken, manageJob);
collegeRoutes.get("/jobs/all", authenticateToken, getAllJobs);
collegeRoutes.get("/jobs/:id", authenticateToken, getJobById);

collegeRoutes.get("/is_first_signin", authenticateToken, isFirstSignIn);

collegeRoutes.get("/auth", authenticateToken, collegeAuth);

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

// collegeRoutes.get("/get_jobs", authenticateToken, getCollegeJobs);
// collegeRoutes.get("/get_job/:id", authenticateToken);

// collegeRoutes.post("/create_job", authenticateToken, createJobByCollege);

collegeRoutes.get("/companies", authenticateToken, getCollegeJobs);
collegeRoutes.get("/company/:id", authenticateToken, getJobDetailsById);

// role base access routes
collegeRoutes.post("/create_faculty", authenticateToken, create_faculty);

collegeRoutes.get(
  "/filter_students",
  authenticateToken,
  getFilteredStudentList
);

// getting student data
collegeRoutes.get(
  "/get_student_data_excel",
  authenticateToken,
  getStudentDetailsInExcel
);

collegeRoutes.get(
  "/get_filtered_student_data_excel",
  authenticateToken,
  getFilteredStudentDetailsInExcel
);

collegeRoutes.get("/colleges", authenticateToken, getColleges);

collegeRoutes.get("/facultyProfile", authenticateToken, facultyProfile);

collegeRoutes.post("/place_student", authenticateToken, placeStudent);

collegeRoutes.get(
  "/get_department_statistics",
  authenticateToken,
  getDepartmentStatistics
);
// collegeRoutes.get('/getAllColleges', getAllColleges);



collegeRoutes.get("/eligible_students", authenticateToken, getDepartmentWiseEligibleStudents);
collegeRoutes.get("/placement_status", authenticateToken, getDepartmentWisePlacementStatus);
collegeRoutes.post("/mark_as_placed", authenticateToken, markAsPlaced);
collegeRoutes.get("/total_offers", authenticateToken, totalNoOfOffers);
collegeRoutes.get("/students_accepted_under_6lpa", authenticateToken, studentsAcceptedUnder6LPA);
collegeRoutes.get("/students_accepted_second_offer_above_6lpa", authenticateToken, studentsAcceptedSecondOfferOver6LPA);
collegeRoutes.get("/offers_above_6lpa", authenticateToken, getOffersAbove6LPA);
collegeRoutes.get("/offers_below_6lpa", authenticateToken, getOffersBelow6LPA);

export default collegeRoutes;
