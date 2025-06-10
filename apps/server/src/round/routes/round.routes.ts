import { Router } from "express";
import { createRound, getAllJobsOfCompany, getAllRoundsOfJobs, selectStudentToNextRound, studentApplyToTheJob } from "../controller/round.controller";
import { authenticateToken } from "../../middlewares/verifyGoogleToken";

const roundRoutes=Router();
roundRoutes.post('/create',createRound);
roundRoutes.post('/apply',studentApplyToTheJob);
roundRoutes.post('/promote-student', authenticateToken,selectStudentToNextRound);
roundRoutes.post('/companyrounds',getAllJobsOfCompany);
roundRoutes.post('/jobsrounds',getAllRoundsOfJobs)

export default roundRoutes;