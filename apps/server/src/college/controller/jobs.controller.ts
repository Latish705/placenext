import Company from "../../company/models/company";
import { Request, Response } from "express";
import { getCompanyById } from "../../company/controller/auth";
import Job from "../../job/models/job"; 
// import {getJobsByCompany} from "../../company/controller/auth";
import Faculty from "../models/faculty";
import College from "../models/college";
import CollegeJobLink from "../../job/models/collegeJobLink";
import { redis } from "../..";
// import { getFacultyDetails } from "../../faculty/controller/faculty.controller"; 


export const getJobsByCompanyId = async (req: Request, res: Response) => {
    try {
        const { companyId } = req.body;
        //@ts-ignore
        const userId = req.user;

        console.log("User ID:", userId);
        const user = await Faculty.findOne({ googleId: userId.uid });
        const collegeId = user?.faculty_college_id;

        if (!companyId) {
            return res.status(400).json({ msg: "Company ID is required" });
        }

        const redisKey = `jobsByCompany:${companyId}:${collegeId}`;
        const cachedJobs = await redis.get(redisKey);

        if (cachedJobs) {
            return res.status(200).json({
                success: true,
                jobs: cachedJobs,
                msg: "Jobs fetched successfully",
            });
        }

        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({ msg: "Company not found" });
        }

        const jobs = await CollegeJobLink.find({ company: company._id, college: collegeId });
        if (!jobs || jobs.length === 0) {
            return res.status(404).json({ msg: "No jobs found for this company" });
        }

        await redis.set(redisKey, jobs, { EX: 600 });
        res.status(200).json({
            success: true,
            jobs: jobs,
            msg: "Jobs fetched successfully",
        });
    } catch (error) {
        console.log("Error in getJobsByCompanyId", error);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
};
 


export const getJobById = async (req: Request, res: Response) => {
    try {
        const { jobId } = req.body;
        //@ts-ignore
        const userId = req.user;

        if (!jobId) {
            return res.status(400).json({ msg: "Job ID is required" });
        }

        const redisKey = `jobById:${jobId}`;
        const cachedJob = await redis.get(redisKey);

        if (cachedJob) {
            return res.status(200).json({
                success: true,
                job: cachedJob,
                msg: "Job fetched successfully",
            });
        }

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ msg: "Job not found" });
        }

        await redis.set(redisKey, job, { EX: 600 });
        res.status(200).json({
            success: true,
            job: job,
            msg: "Job fetched successfully",
        });
    } catch (error) {
        console.log("Error in getJobById", error);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
};



export const getAllJobs = async (req: Request, res: Response) => {
    try {
        //@ts-ignore
        const userId = req.user.uid || req.faculty; // Assuming the user object has a uid field
        const user = await Faculty.findOne({ googleId: userId });

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        const redisKey = `allJobs:${user.faculty_college_id}`;
        const cachedJobs = await redis.get(redisKey);

        if (cachedJobs) {
            return res.status(200).json({
                success: true,
                jobs: cachedJobs,
                msg: "Jobs fetched successfully",
            });
        }

        const jobs = await CollegeJobLink.find({
            college: user.faculty_college_id
        }).populate({
            path: 'job_info',
            populate: {
                path: 'company_name',
                model: 'Company'
            }
        });

        if (!jobs || jobs.length === 0) {
            return res.status(404).json({ msg: "No jobs found" });
        }

        await redis.set(redisKey, jobs, { EX: 600 });
        res.status(200).json({
            success: true,
            jobs: jobs,
            msg: "Jobs fetched successfully",
        });
    } catch (error) {
        console.log("Error in getAllJobs", error);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
};




export const manageJob = async (req: Request, res: Response) => {
    try {
        const { jobId, actions } = req.body;
        console.log("Job ID:", jobId);
        console.log("Action:", actions);

        if (!jobId) {
            return res.status(400).json({ msg: "Job ID is required" });
        }

        //@ts-ignore
        console.log("Request Body:", req.user);
        //@ts-ignore
        const userId = req.user.uid || req.faculty; // Assuming the user object has a uid field
        console.log("User ID:", userId);

        if (!userId) {
            console.log("User ID is not provided");
            return res.status(403).json({ msg: "Unauthorized" });
        }

        const user = await Faculty.findOne({ googleId: userId });
        console.log("User:", user);

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        const collegeId = user.faculty_college_id;

        // Check if the user is authorized to manage jobs
        if (user.role !== "college-tpo" && user.role !== "admin") {
            return res.status(403).json({ msg: "Unauthorized to manage jobs" });
        }

        const job = await CollegeJobLink.findById(jobId);
        if (!job) {
            return res.status(404).json({ msg: "Job not found" });
        }

        if (actions === "approve") {
            job.status = "approved";
        } else if (actions === "reject") {
            job.status = "rejected";
        } else {
            return res.status(400).json({ msg: "Invalid action" });
        }

        await job.save();

        // Clear the cache for this job and related lists
        await redis.del(`jobById:${jobId}`);
        await redis.del(`allJobs:${collegeId}`);
        await redis.del(`approvedJobs:${collegeId}`);
        await redis.del(`pendingJobs:${collegeId}`);

        res.status(200).json({
            success: true,
            job: job,
            msg: `Job ${actions} successfully`,
        });
    } catch (error) {
        console.log("Error in manageJob", error);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
};



export const getApprovedJobs = async (req: Request, res: Response) => {
    try {
        //@ts-ignore
        const userId = req.user.uid || req.faculty; // Assuming the user object has a uid field
        const user = await Faculty.findOne({ googleId: userId });

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        const redisKey = `approvedJobs:${user.faculty_college_id}`;
        const cachedJobs = await redis.get(redisKey);

        if (cachedJobs) {
            return res.status(200).json({
                success: true,
                jobs: cachedJobs,
                msg: "Approved jobs fetched successfully",
            });
        }

        const jobs = await CollegeJobLink.find({ status: "approved", college: user.faculty_college_id });
        if (!jobs || jobs.length === 0) {
            return res.status(404).json({ msg: "No approved jobs found" });
        }

        await redis.set(redisKey, jobs, { EX: 600 });
        res.status(200).json({
            success: true,
            jobs: jobs,
            msg: "Approved jobs fetched successfully",
        });
    } catch (error) {
        console.log("Error in getApprovedJobs", error);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
};



export const getPendingJobs = async (req: Request, res: Response) => {
    try {
        //@ts-ignore
        const userId = req.user.uid || req.faculty; // Assuming the user object has a uid field
        const user = await Faculty.findOne({ googleId: userId });

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        const redisKey = `pendingJobs:${user.faculty_college_id}`;
        const cachedJobs = await redis.get(redisKey);

        if (cachedJobs) {
            return res.status(200).json({
                success: true,
                jobs: cachedJobs,
                msg: "Pending jobs fetched successfully",
            });
        }

        const jobs = await CollegeJobLink.find({ status: "pending", college: user.faculty_college_id });
        if (!jobs || jobs.length === 0) {
            return res.status(404).json({ msg: "No pending jobs found" });
        }

        await redis.set(redisKey, jobs, { EX: 600 });
        res.status(200).json({
            success: true,
            jobs: jobs,
            msg: "Pending jobs fetched successfully",
        });
    } catch (error) {
        console.log("Error in getPendingJobs", error);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
};
