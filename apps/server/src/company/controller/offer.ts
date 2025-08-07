

import Job from "../../job/models/job";
import Student from "../../student/models/student";
import { redis } from "../..";
import Offer from "../models/offer";
import { Request, Response  } from "express";

export const createOffer = async (req: Request, res: Response):Promise<any> => {
    try {
        const { jobId, studentId } = req.body;
        console.log(" (create Offer) req body:- ");
        if (!jobId || !studentId) {
            return res.status(400).json({ success: false, message: "All fields required!" });
        }

        const job = await Job.findById(jobId).populate("company_name");
        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found!" });
        }
        console.log(" (create Offer) job details:- ", job);

        const student = await Student.findById(studentId); // Changed from findOne to findById
        if (!student) {
            return res.status(404).json({ success: false, message: "Student not found!" });
        }
        console.log(" (create Offer) student details:- ", student);

        const existingOffersCount = await Offer.countDocuments({ studentId: studentId });
        if (existingOffersCount >= 2) {
            return res.status(400).json({ success: false, message: "Offer limit reached for this student!" });
        }
        console.log(" (create Offer) existing offers count:- ", existingOffersCount);

        const existingOffer = await Offer.findOne({ jobId: jobId, studentId: studentId });
        if (existingOffer) {
            return res.status(400).json({ success: false, message: "Offer already exists for this job and student!" });
        }
        console.log(" (create Offer) existing offer details:- ", existingOffer);

        const newOffer = await Offer.create({
            jobId: jobId, // Changed from job to jobId
            studentId: studentId,
            package: job.job_salary,
            company: job.company_name.comp_name,
            status: "offered"
        });
        console.log(" (create Offer) new offer details:- ", newOffer);

        // Clear related caches
        await redis.del(`offers:student:${studentId}`);
        await redis.del(`offers:job:${jobId}:accepted`);
        await redis.del(`offers:job:${jobId}:rejected`);
        await redis.del(`offers:job:${jobId}:offered`);

        return res.status(201).json({ success: true, message: "Offer created successfully!", data: newOffer });
    } catch (error: any) {
        console.error("Error in createOffer:", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error", data: error.message });
    }
};

export const changeOfferStatus = async (req: Request, res: Response) => {
    try {
        const { offerId, status } = req.body;

        if (!offerId || !status) {
            return res.status(400).json({ success: false, message: "Offer ID and status are required" });
        }

        const offer = await Offer.findById(offerId);
        if (!offer) {
            return res.status(404).json({ success: false, message: "Offer not found" });
        }



        offer.status = status;
        await offer.save();

        // Clear related caches
        await redis.del(`offer:${offerId}`);
        await redis.del(`offers:student:${offer.studentId}`);
        await redis.del(`offers:job:${offer.jobId}:accepted`);
        await redis.del(`offers:job:${offer.jobId}:rejected`);
        await redis.del(`offers:job:${offer.jobId}:offered`);


        return res.status(200).json({ success: true, message: "Offer status updated", data: offer });
    } catch (error: any) {
        console.error("Error in changeOfferStatus:", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error", data: error.message });
    }

};

export const getOfferByStudentId = async (req: Request, res: Response) => {
    try {
        const { studentId } = req.body;
        if (!studentId) {
            return res.status(400).json({ success: false, message: "Student ID is required" });
        }


        const redisKey = `offers:student:${studentId}`;
        const cachedOffers = await redis.get(redisKey);

        if (cachedOffers) {
            return res.status(200).json({ success: true, data: JSON.parse(cachedOffers) });
        }


        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }

        const offers = await Offer.find({ studentId: studentId }).populate("jobId").populate("studentId");

        await redis.set(redisKey, JSON.stringify(offers), { EX: 600 });


        return res.status(200).json({ success: true, data: offers });
    } catch (error: any) {
        console.error("Error in getOfferByStudentId:", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error", data: error.message });
    }

};


export const getOfferByOfferId = async (req: Request, res: Response) => {
    try {
        const { offerId } = req.body;



        if (!offerId) {
            return res.status(400).json({ success: false, message: "Offer ID is required" });
        }

        const redisKey = `offer:${offerId}`;
        const cachedOffer = await redis.get(redisKey);

        if (cachedOffer) {
            return res.status(200).json({ success: true, data: JSON.parse(cachedOffer) });
        }

        const offer = await Offer.findById(offerId).populate("jobId").populate("studentId");
        await redis.set(redisKey, JSON.stringify(offer), { EX: 600 });


        return res.status(200).json({ success: true, data: offer });
    } catch (error: any) {
        console.error("Error in getOfferByOfferId:", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error", data: error.message });
    }

}

export const listofoffersbyjobId=async(req:Request,res:Response)=>{
    try {
        // This function was duplicated and had an incomplete try-catch block.
        // The correct implementation is in listOfOffersByJobId below.
        // This empty block is left to avoid breaking existing code structure if it's referenced elsewhere.
}catch(error:any){
    console.log(error.message);
    

}};

export const listOfOffersByJobId = async (req: Request, res: Response) => {
    try {
        const { jobId } = req.body;
        if (!jobId) {
            return res.status(400).json({ success: false, message: "Job ID is required" });
        }

        const redisKey = `offers:job:${jobId}`;
        const cachedOffers = await redis.get(redisKey);

        if (cachedOffers) {
            return res.status(200).json({ success: true, data: JSON.parse(cachedOffers) });
        }


        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found" });
        }

        const offers = await Offer.find({ jobId: jobId }).populate("studentId");
        await redis.set(redisKey, JSON.stringify(offers), { EX: 600 });

        return res.status(200).json({ success: true, data: offers });
    } catch (error: any) {
        console.error("Error in listOfOffersByJobId:", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error", data: error.message });
    }
}


export const getAcceptedOffersByJobId = async (req: Request, res: Response) => {
    try {
        const { jobId } = req.body;


        if (!jobId) {
            return res.status(400).json({ success: false, message: "Job ID is required" });
        }


        const redisKey = `offers:job:${jobId}:accepted`;
        const cachedOffers = await redis.get(redisKey);

        if (cachedOffers) {
            return res.status(200).json({ success: true, data: JSON.parse(cachedOffers) });
        }


        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found" });
        }

        const offers = await Offer.find({ jobId: jobId, status: "accepted" }).populate("studentId");

        await redis.set(redisKey, JSON.stringify(offers), { EX: 600 });


        return res.status(200).json({ success: true, data: offers });
    } catch (error: any) {
        console.error("Error in getAcceptedOffersByJobId:", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error", data: error.message });
    }

};


export const getRejectedOffersByJobId = async (req: Request, res: Response) => {
    try {
        const { jobId } = req.body;


        if (!jobId) {
            return res.status(400).json({ success: false, message: "Job ID is required" });
        }


        const redisKey = `offers:job:${jobId}:rejected`;
        const cachedOffers = await redis.get(redisKey);

        if (cachedOffers) {
            return res.status(200).json({ success: true, data: JSON.parse(cachedOffers) });
        }


        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found" });
        }

        const offers = await Offer.find({ jobId: jobId, status: "rejected" }).populate("studentId");

        await redis.set(redisKey, JSON.stringify(offers), { EX: 600 });


        return res.status(200).json({ success: true, data: offers });
    } catch (error: any) {
        console.error("Error in getRejectedOffersByJobId:", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error", data: error.message });
    }

};


export const getOfferedOffersByJobId = async (req: Request, res: Response) => {
    try {
        const { jobId } = req.body;
        if (!jobId) {
            return res.status(400).json({ success: false, message: "Job ID is required" });
        }


        const redisKey = `offers:job:${jobId}:offered`;
        const cachedOffers = await redis.get(redisKey);

        if (cachedOffers) {
            return res.status(200).json({ success: true, data: JSON.parse(cachedOffers) });
        }


        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found" });
        }

        const offers = await Offer.find({ jobId: jobId, status: "offered" }).populate("studentId");

        await redis.set(redisKey, JSON.stringify(offers), { EX: 600 });


        return res.status(200).json({ success: true, data: offers });
    } catch (error: any) {
        console.error("Error in getOfferedOffersByJobId:", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error", data: error.message });
    }

};
