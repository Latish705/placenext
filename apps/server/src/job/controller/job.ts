import { Request, Response } from "express";
import Job from "../../job/models/job";
import CollegeJobLink from "../models/collegeJobLink";
import Company from "../../company/models/company";
import College from "../../college/models/college";
import mongoose from "mongoose";
export const createJobByCompany = async (req: Request, res: Response) => {
  try {
    // @ts-ignore - if you don't have proper type, ignore for now
    const loginCompanyUser = req.user;
    console.log("clg: Logged-in user:", loginCompanyUser);
    console.log("req body:-",req.body);

    const company = await Company.findOne({ googleId: loginCompanyUser.uid });
    console.log("clg: Fetched company from DB:", company);

    if (!company) {
      console.log("clg: Company not found.");
      return res.status(400).json({
        success: false,
        message: "Company not registered. Please register first.",
      });
    }

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
      college, // array of college ObjectIds
    } = req.body;

    console.log("clg: Request body:", req.body);

    // Validate required fields
    const requiredFields = [
      job_title, job_type, job_location, job_salary, job_description,
      job_requirements, job_posted_date, max_no_dead_kt, max_no_live_kt,
      min_CGPI, yr_of_exp_req, branch_allowed, passing_year, job_timing, college
    ];

    if (requiredFields.some(field => field === undefined || field === null || (Array.isArray(field) && field.length === 0))) {
      console.log("clg: Validation failed - some fields are missing.");
      return res.status(400).json({
        success: false,
        message: "All fields are required and must not be empty.",
      });
    }

for (const c of college) {
  if (!mongoose.Types.ObjectId.isValid(c)) {
    return res.status(400).json({
      success: false,
      message: `Invalid college ID: ${c}`,
    });
  }
  const coll = await College.findById(c);
  if (!coll) {
    return res.status(400).json({
      success: false,
      message: "College is not present here",
    });
  }
}



    console.log("clg: All required fields are present. Proceeding...");

    const existingJob = await Job.findOne({
      job_title,
      job_location,
      job_posted_date,
      company_name: company._id,
    });

    console.log("clg: Existing job check result:", existingJob);

    if (existingJob) {
      const existingLinks = await CollegeJobLink.find({
        job_info: existingJob._id,
        college: { $in: college },
      });

      console.log("clg: Existing CollegeJobLinks found:", existingLinks);

      const alreadyLinkedColleges = existingLinks.map((link: { college: { toString: () => any; }; }) => link.college.toString());
      const collegesToLink = college.filter((id: string) => !alreadyLinkedColleges.includes(id));

      console.log("clg: Colleges already linked:", alreadyLinkedColleges);
      console.log("clg: Colleges still to be linked:", collegesToLink);

      if (collegesToLink.length === 0) {
        console.log("clg: All colleges are already linked.");
        return res.status(409).json({
          success: false,
          message: "Job already exists and is linked to all selected colleges.",
        });
      }

      for (const collegeId of collegesToLink) {
        const newLink = new CollegeJobLink({
          job_info: existingJob._id,
          college: collegeId,
          status: "pending",
        });
        await newLink.save();
        console.log("clg: New CollegeJobLink created:", newLink);
      }

      console.log("clg: Job linked with new colleges successfully.");
      return res.status(200).json({
        success: true,
        message: "Job already existed. Linked successfully with new colleges.",
        job: existingJob,
      });
    }

    // If job doesn't exist, create a new one
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
      company_name: company._id,
    });

    await newJob.save();
    console.log("clg: New job created and saved:", newJob);

    for (const collegeId of college) {
      const newLink = new CollegeJobLink({
        job_info: newJob._id,
        college: collegeId,
        status: "pending",
      });
      await newLink.save();
      console.log("clg: New CollegeJobLink created for new job:", newLink);
    }

    console.log("clg: Job and CollegeJobLinks created successfully.");
    return res.status(201).json({
      success: true,
      message: "Job created and linked with selected colleges.",
      job: newJob,
    });

  } catch (error: any) {
    console.error("clg: Error in createJobByCompany:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
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

