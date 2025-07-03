import { Request, Response } from "express";
import Offer from "../models/offer";
import Job from "../../job/models/job";
import Student from "../../student/models/student";

export const createOffer= async(req:Request,res:Response)=>{
    try {
        const {jobId,studentId}=req.body;
        console.log(" (create Offer) req body:- ")
        if(!jobId || !studentId ){
            return res.status(400).json({success:false,message:"all fields required!"})
        }
        const job=await Job.findById(jobId).populate("company_name");
        if(!job){
            return res.status(404).json({success:false,message:"Job not found!"})
        }
        console.log(" (create Offer) job details:- ", job);

        const student=await Student.findById(studentId);
        if(!student){
            return res.status(404).json({success:false,message:"Student not found!"})
        }
        console.log(" (create Offer) student details:- ", student);
        const existingOfferscount=await Offer.countDocuments({studentId:studentId});
        if(existingOfferscount>=2){
            return res.status(400).json({success:false,message:"Offer limit reached for this student!"})
        }
        console.log(" (create Offer) existing offers count:- ", existingOfferscount);
        const existingOffer=await Offer.findOne({jobId:jobId,studentId:studentId});
        if(existingOffer){
            return res.status(400).json({success:false,message:"Offer already exists for this job and student!"})
        }
        console.log(" (create Offer) existing offer details:- ", existingOffer);
        const newOffer=await Offer.create({jobId:jobId,studentId:studentId,package: job.job_salary,company:job.company_name.comp_name,status:"offered"});
        console.log(" (create Offer) new offer details:- ", newOffer);
        return res.status(201).json({success:true,message:"Offer created successfully!",data:newOffer});
    } catch (error: any) {
        console.error("Error in createOffer:", error.message);
        return res.status(500).json({ success:false,message: "Internal Server Error" ,data:error.message});
        
    }
}


export const changeOfferStatus = async (req: Request, res: Response) => {
    try {
        //@ts-ignore
        // const user=req.user;
        const { offerId, status } = req.body;

        // const existuser=await Student.findOne({googleId:user.uid});
        // if(!existuser){
        //     return res.status(400).json({success:false,message:"login first and only student can changethestatus"})
        // }
        if (!offerId || !status) {
            return res.status(400).json({ success: false, message: "Offer ID and status are required" });
        }

        const offer = await Offer.findById(offerId);
        if (!offer) {
            return res.status(404).json({ success: false, message: "Offer not found" });
        }
        offer.status=status;
        await offer.save();

        return res.status(200).json({ success: true, message: "Offer status updated", data: offer });
    } catch (error: any) {
        console.error("Error in changeOfferStatus:", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error", data: error.message });
    }
}

export const getOfferByStudentId =async(req:Request,res:Response)=>{
    try {
        const { studentId } = req.body;

        if (!studentId) {
            return res.status(400).json({ success: false, message: "Student ID is required" });
        }

        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }

        const offers = await Offer.find({ studentId: studentId }).populate("jobId").populate("studentId");

        return res.status(200).json({ success: true, data: offers });
    } catch (error: any) {
        console.error("Error in getOfferByStudentId:", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error", data: error.message });
    }
}

export const getOfferByOfferId = async (req: Request, res: Response) => {
    try {
        const { offerId } = req.body;

        if (!offerId) {
            return res.status(400).json({ success: false, message: "Offer ID is required" });
        }

        const offer = await Offer.findById(offerId).populate("jobId").populate("studentId");

        return res.status(200).json({ success: true, data: offer });
    } catch (error: any) {
        console.error("Error in getOfferByOfferId:", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error", data: error.message });
    }
}

export const listofoffersbyjobId=async(req:Request,res:Response)=>{
    try {
        const { jobId } = req.body;

        if (!jobId) {
            return res.status(400).json({ success: false, message: "Job ID is required" });
        }
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found" });
        }
        const offers = await Offer.find({ jobId: jobId }).populate("studentId");

        return res.status(200).json({ success: true, data: offers });
    } catch (error: any) {
        console.error("Error in listofoffersbyjobId:", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error", data: error.message });
    }
}

export const getAcceptedOffersByJobId = async (req: Request, res: Response) => {
    try {
        const { jobId } = req.body;

        if (!jobId) {
            return res.status(400).json({ success: false, message: "Job ID is required" });
        }

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found" });
        }

        const offers = await Offer.find({ jobId: jobId, status: "accepted" }).populate("studentId");

        return res.status(200).json({ success: true, data: offers });
    } catch (error: any) {
        console.error("Error in getAcceptedOffersByJobId:", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error", data: error.message });
    }
}

export const getRejectedOffersByJobId = async (req: Request, res: Response) => {
    try {
        const { jobId } = req.body;

        if (!jobId) {
            return res.status(400).json({ success: false, message: "Job ID is required" });
        }

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found" });
        }

        const offers = await Offer.find({ jobId: jobId, status: "rejected" }).populate("studentId");

        return res.status(200).json({ success: true, data: offers });
    } catch (error: any) {
        console.error("Error in getRejectedOffersByJobId:", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error", data: error.message });
    }
}

export const getOfferedOffersByJobId = async (req: Request, res: Response) => {
    try {
        const { jobId } = req.body;

        if (!jobId) {
            return res.status(400).json({ success: false, message: "Job ID is required" });
        }

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found" });
        }

        const offers = await Offer.find({ jobId: jobId, status: "offered" }).populate("studentId");

        return res.status(200).json({ success: true, data: offers });
    } catch (error: any) {
        console.error("Error in getOfferedOffersByJobId:", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error", data: error.message });
    }
}