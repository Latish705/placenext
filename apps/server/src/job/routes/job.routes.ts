import { Router } from "express";
import { 
  createJobByCompany, 
  getAllPendingJobRequest, 
  getAllAcceptedJobRequest, 
  getAllRejectedJobRequest, 
  getjobdetail
} from "../controller/job";
import { authenticateToken } from "../../middlewares/verifyGoogleToken";

const jobroutes = Router();

jobroutes.post('/create', authenticateToken, createJobByCompany);
jobroutes.get('/pending', authenticateToken, getAllPendingJobRequest);
jobroutes.get('/accepted', authenticateToken, getAllAcceptedJobRequest);
jobroutes.get('/rejected', authenticateToken, getAllRejectedJobRequest);
jobroutes.get('/getjobdetail/:job_id',getjobdetail);
export default jobroutes;