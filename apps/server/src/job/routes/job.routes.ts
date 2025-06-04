import { Router } from "express";
import { createJobByCompany } from "../controller/job";

const jobroutes=Router();
jobroutes.post('/create',createJobByCompany);

export default jobroutes;