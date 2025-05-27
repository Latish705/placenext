import Company from "../../company/models/company";
import { Request, Response } from "express";
import { getCompanyById } from "../../company/controller/auth";
import Job from "../../company/models/job"; 
import {getJobsByCompany} from "../../company/controller/auth";
import Faculty from "../models/faculty";
// import { getFacultyDetails } from "../../faculty/controller/faculty.controller"; 


export const getJobsByCompanyId = async (req: Request, res: Response) => {
    try {
        //@ts-ignore
        const userId = req.user
        const {companyId} = req.body; // Assuming the user object has a companyId field
        if (!companyId) {
            return res.status(400).json({ msg: "Company ID is required" });
        }
        const company = await Company.find(companyId);
        if (!company) {
            return res.status(404).json({ msg: "Company not found" });
        }
        const jobs = await Job.findById({company: company._id});
        if (!jobs || jobs.length === 0) {
            return res.status(404).json({ msg: "No jobs found for this company" });
        }

        res.status(200).json({
            success: true,
            jobs: jobs,
            msg: "Jobs fetched successfully",
        });
        return;

    } catch (error) {
        console.log("Error in getJobsByCompanyId", error);
        return res.status(500).json({ msg: "Internal Server Error" });

    }
}

export const getJobById = async (req: Request, res: Response) => {
    try {
        const { jobId } = req.body;
        if (!jobId) {
            return res.status(400).json({ msg: "Job ID is required" });
        }
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ msg: "Job not found" });
        }

        res.status(200).json({
            success: true,
            job: job,
            msg: "Job fetched successfully",
        });
        return;

    } catch (error) {
        console.log("Error in getJobById", error);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
}

export const getAllJobs = async (req: Request, res: Response) => {
    try {
        const jobs = await Job.find();
        if (!jobs || jobs.length === 0) {
            return res.status(404).json({ msg: "No jobs found" });
        }

        res.status(200).json({
            success: true,
            jobs: jobs,
            msg: "Jobs fetched successfully",
        });
        return;

    } catch (error) {
        console.log("Error in getAllJobs", error);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
}


export const manageJob = async (req: Request, res: Response) => {
    try{
        const {jobId, actions} = req.body;
        if (!jobId) {
            return res.status(400).json({ msg: "Job ID is required" });
        }
        //@ts-ignore
        const userId = req.user.uid || req.faculty; // Assuming the user object has a uid field
        // @ts-ignore
        const role = req.role // Assuming the user object has a googleId field
        if (!userId ) {
            return res.status(403).json({ msg: "Unauthorized" });
        }
        const user = await Faculty.findOne({ googleId: userId });
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        // Check if the user is authorized to manage jobs
        if (user.role !== "tpo" || user.role !== "admin") {
            // User is authorized to manage jobs     
            return res.status(403).json({ msg: "Unauthorized to manage jobs" });
        }
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ msg: "Job not found" });
        }

        if (actions === "approve") {
            job.status = "approved";
        } else if (actions === "reject") {
            job.status = "rejected";
        } else if (actions === "delete") {
            await Job.findByIdAndDelete(jobId);
            return res.status(200).json({ msg: "Job deleted successfully" });
        } else {
            return res.status(400).json({ msg: "Invalid action" });
        }
        await job.save();
        res.status(200).json({  
            success: true,
            job: job,
            msg: `Job ${actions} successfully`,
        });
        return;
    }
    catch (error) {
        console.log("Error in manageJob", error);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
}