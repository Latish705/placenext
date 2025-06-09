import { Router } from "express";
import { createJobByCompany } from "../controller/job";
import { authenticateToken } from "../../middlewares/verifyGoogleToken";

const jobroutes=Router();
jobroutes.post('/create',authenticateToken,createJobByCompany);

export default jobroutes;