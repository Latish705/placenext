import { Router } from "express";
import verifyFaculty from "../middleware/verifyFaculty";
import {
  checkRole,
  facultyLogin,
  getFacultyList,
  selectCollege,
} from "../controller/faculty.controller";
import { authenticateToken } from "../../middlewares/verifyGoogleToken";
import { getFacultyRole, verifyRole } from "../middleware/verifyRole";
import { manageJob } from "../controller/jobs.controller";

const facultyRoutes = Router();

facultyRoutes.post("/login", facultyLogin);
facultyRoutes.post("/select-college", authenticateToken, selectCollege);
facultyRoutes.get("/check_role", authenticateToken, checkRole);
facultyRoutes.get("/managejobs", authenticateToken,verifyFaculty,verifyRole,manageJob);

facultyRoutes.get(
  "/get_faculty_list",
  authenticateToken,
  getFacultyRole,
  getFacultyList
);

export default facultyRoutes;
