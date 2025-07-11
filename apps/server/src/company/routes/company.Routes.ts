import Router from "express";
import {
  createCompanyApplication,
  isFirstSignIn,
  signup,
} from "../controller/auth";
import { authenticateToken } from "../../middlewares/verifyGoogleToken";
import { changeOfferStatus, createOffer, getAcceptedOffersByJobId, getOfferByOfferId, getOfferByStudentId, getOfferedOffersByJobId, getRejectedOffersByJobId, listOfOffersByJobId } from "../controller/offer";

const companyRoutes = Router();

companyRoutes.get("/is_first_signin", authenticateToken, isFirstSignIn);

companyRoutes.post("/google_login", authenticateToken, signup);

companyRoutes.post("/applicationForm", authenticateToken, createCompanyApplication);
companyRoutes.post('/createOffer',authenticateToken,createOffer);
companyRoutes.put('/offer/status',changeOfferStatus);
companyRoutes.post('/offer/student',authenticateToken,getOfferByStudentId);
companyRoutes.post('/offer',authenticateToken,getOfferByOfferId);
companyRoutes.post('/offer/list',authenticateToken,listOfOffersByJobId);
companyRoutes.post('/offer/accepted',authenticateToken,getAcceptedOffersByJobId);
companyRoutes.post('/offer/rejected',authenticateToken,getRejectedOffersByJobId);
companyRoutes.post('/offer/offered',authenticateToken,getOfferedOffersByJobId);

export default companyRoutes;
