import Router from "express";
import {
  createCompanyApplication,
  isFirstSignIn,
  signup,
} from "../controller/auth";
import { authenticateToken } from "../../middlewares/verifyGoogleToken";

const companyRoutes = Router();

companyRoutes.get("/is_first_signin", authenticateToken, isFirstSignIn);

companyRoutes.post("/google_login", authenticateToken, signup);

companyRoutes.post("/applicationForm", authenticateToken, createCompanyApplication);


export default companyRoutes;
