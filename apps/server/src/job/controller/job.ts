import { Request, Response } from "express";
import Job from "../../job/models/job";
import CollegeJobLink from "../models/collegeJobLink";

export const createJobByCompany = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const LogincollegeUser = req.user;

    const {
      job_title,
      job_type,
      job_location,
      job_salary,
      job_description,
      job_requirements,
      job_posted_date,
      max_no_dead_kt,
      max_no_live_kt,
      min_CGPI,
      yr_of_exp_req,
      branch_allowed,
      passing_year,
      job_timing,
      company_name,
      college,
    } = req.body;

    const requiredFields = [
      job_title, job_type, job_location, job_salary, job_description,
      job_requirements, job_posted_date, max_no_dead_kt, max_no_live_kt,
      min_CGPI, yr_of_exp_req, branch_allowed, passing_year,
      job_timing, company_name, college
    ];

    if (requiredFields.some(field => field === undefined || field === null || field === "")) {
      return res.status(400).json({ success: false, message: "All fields are required!" });
    }

    const existingJob = await Job.findOne({
      job_title,
      job_location,
      job_posted_date,
      company_name,
    });

    if (existingJob) {
      const existingLinks = await CollegeJobLink.find({
        job_info: existingJob._id,
        college: { $in: college }
      });

      if (existingLinks.length > 0) {
        return res.status(409).json({
          success: false,
          msg: "Job already exists for one or more of the selected colleges"
        });
      }

      for (const collegeId of college) {
        const newCollegeJobLink = new CollegeJobLink({
          job_info: existingJob._id,
          college: collegeId,
          status: "pending"
        });
        await newCollegeJobLink.save();
      }

      return res.status(201).json({
        success: true,
        msg: "Job linked successfully with new colleges",
        job: existingJob
      });
    }

    const newJob = new Job({
      job_title,
      job_type,
      job_location,
      job_salary,
      job_description,
      job_requirements,
      job_posted_date,
      max_no_dead_kt,
      max_no_live_kt,
      min_CGPI,
      yr_of_exp_req,
      branch_allowed,
      passing_year,
      job_timing,
      company_name,
    });

    await newJob.save();

    for (const collegeId of college) {
      const newCollegeJobLink = new CollegeJobLink({
        job_info: newJob._id,
        college: collegeId,
        status: "pending"
      });
      await newCollegeJobLink.save();
    }

    return res.status(201).json({
      success: true,
      msg: "Job created and linked to colleges successfully",
      job: newJob
    });

  } catch (error: any) {
    return res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
};

export const getAllPendingJobRequest = async (req: Request, res: Response) => {
  try {
    const { company_name } = req.body;

    if (!company_name) {
      return res.status(400).json({
        success: false,
        message: "company_name is required",
      });
    }
    const pendingJobs = await CollegeJobLink.find({ status: "pending" }).populate("job_info");

    const filteredJobs = pendingJobs.filter(
      (link: any) => link.job_info?.company_name === company_name
    );

    return res.status(200).json({
      success: true,
      message: "Pending jobs fetched successfully",
      jobs: filteredJobs,
    });
  } catch (error: any) {
    console.error("Error in getAllPendingJobRequest:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


export const getAllAcceptedJobRequest = async (req: Request, res: Response) => {
 try {
    const { company_name } = req.body;

    if (!company_name) {
      return res.status(400).json({
        success: false,
        message: "company_name is required",
      });
    }
    const pendingJobs = await CollegeJobLink.find({ status: "accepted" }).populate("job_info");

    const filteredJobs = pendingJobs.filter(
      (link: any) => link.job_info?.company_name === company_name
    );

    return res.status(200).json({
      success: true,
      message: "Acccepted jobs fetched successfully",
      jobs: filteredJobs,
    });
  } catch (error: any) {
    console.error("Error in getAllAcceptedJobRequest:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


export const getAllRejectedJobRequest = async (req: Request, res: Response) => {
  try {
    const { company_name } = req.body;

    if (!company_name) {
      return res.status(400).json({
        success: false,
        message: "company_name is required",
      });
    }
    const pendingJobs = await CollegeJobLink.find({ status: "rejected" }).populate("job_info");

    const filteredJobs = pendingJobs.filter(
      (link: any) => link.job_info?.company_name === company_name
    );

    return res.status(200).json({
      success: true,
      message: "Rejected jobs fetched successfully",
      jobs: filteredJobs,
    });
  } catch (error: any) {
    console.error("Error in getAllrejectedJobRequest:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

