import { Router } from "express";
import verifyFaculty from "../middleware/verifyFaculty";
import {
  checkRole,
  facultyLogin,
  getFacultyDetails,
  getFacultyList,
  selectCollege,
} from "../controller/faculty.controller";
import { authenticateToken } from "../../middlewares/verifyGoogleToken";
import { getFacultyRole } from "../middleware/verifyRole";

const facultyRoutes = Router();

facultyRoutes.post("/login", facultyLogin);
facultyRoutes.post("/select-college", authenticateToken, selectCollege);
facultyRoutes.get("/check_role", authenticateToken, checkRole);
facultyRoutes.get("/getProfile", authenticateToken, getFacultyDetails);
facultyRoutes.get(
  "/get_faculty_list",
  authenticateToken,
  getFacultyRole,
  getFacultyList
);

export default facultyRoutes;
