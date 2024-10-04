import { Router } from "express";
import { authenticateToken } from "../../middlewares/verifyGoogleToken";
import {
  applicationFrom,
  getAllCollegeList,
  getUserDetails,
  isFirstSignIn,
  signup,
} from "../controller/auth";
import { upload } from "../../middlewares/multer";

const studentRoutes = Router();

studentRoutes.post("/google_login", authenticateToken, signup);

studentRoutes.post(
  "/register/applicationform",
  upload.fields([
    // { name: "resume", maxCount: 1 },
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

// student access to college
studentRoutes.get("/colleges", authenticateToken, getAllCollegeList);

export default studentRoutes;
