import { Router } from "express";
import { createRound, getAllJobsOfCompany, getAllRoundsOfJobs, selectStudentToNextRound, studentApplyToTheJob } from "../controller/round.controller";

const roundRoutes=Router();
roundRoutes.post('/create',createRound);
roundRoutes.post('/apply',studentApplyToTheJob);
roundRoutes.post('/promote-student', selectStudentToNextRound);
roundRoutes.post('/companyrounds',getAllJobsOfCompany);
roundRoutes.post('/jobsrounds',getAllRoundsOfJobs)

export default roundRoutes;