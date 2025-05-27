import company from "../models/company";
import { Request, Response } from "express";
import Job from "../models/job";
import { google } from "googleapis";
import College from "../../college/models/college";
import CollegeJobLink from "../models/collegeJobLink";

export const isFirstSignIn = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const user = req.user;
    const existingCompany = await company.findOne({ googleId: user.uid });

    return res
      .status(200)
      .json({ success: true, isFirstSignIn: !existingCompany });
  } catch (error: any) {
    console.log("Error in isFirstSignIn", error.message);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const signup = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const user = req.user;
    res.status(200).json({ success: true, user });
  } catch (error: any) {
    console.log("Error in signup", error.message);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const applicationFrom = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const user = req.user;
    //   _id?: string;
    // comp_name: string;
    // comp_start_date: Date;
    // comp_contact_person: string;
    // comp_email: string;
    // comp_industry: string;
    // com_positions_offered: string[];
    // comp_address: string;
    // comp_jobs_offered: string[];
    // comp_no_employs: number;
    // comp_website: string;
    // comp_location: string;
    // comp_contact_no: string;
    // comp_departments: string[];
    // comp_no_of_stud: number;
    // comp_courses_offered: string[];
    const {
      comp_name,
      comp_start_date,
      comp_contact_person,
      comp_email,
      comp_industry,
      com_positions_offered,
      comp_address,
      comp_jobs_offered,
      comp_no_employs,
      comp_website,
      comp_location,
      comp_contact_no,
      comp_departments,
      comp_no_of_stud,
      comp_courses_offered,
    } = req.body;
    if (
      [
        comp_name,
        comp_start_date,
        comp_contact_person,
        comp_email,
        comp_industry,
        com_positions_offered,
        comp_address,
        comp_jobs_offered,
        comp_no_employs,
        comp_website,
        comp_location,
        comp_contact_no,
        comp_departments,
        comp_no_of_stud,
        comp_courses_offered,
      ].some((field) => field === "")
    ) {
      return res.status(400).json({ msg: "All fields are required" });
    }
    const existingCompany = await company.findOne({ comp_email });
    if (existingCompany) {
      return res
        .status(400)
        .json({ success: false, msg: "Company already exists" });
    }
    const newCompany = new company({
      comp_name,
      comp_start_date,
      comp_contact_person,
      comp_email,
      comp_industry,
      com_positions_offered,
      comp_address,
      comp_jobs_offered,
      comp_no_employs,
      comp_website,
      comp_location,
      comp_contact_no,
      comp_departments,
      comp_no_of_stud,
      comp_courses_offered,
    });
    await newCompany.save();
    return res.status(200).json({ success: true, msg: "Company created" });
  } catch (error: any) {
    console.log("Error in applicationFrom", error.message, error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const getCompany = async (req: Request, res: Response) => {
  try {
    const companies = await company.find();
    return res.status(200).json({ success: true, companies });
  } catch (error: any) {
    console.log("Error in getCompany", error.message);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const getCompanyById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const companyDetails = await company.findById(id);
    return res.status(200).json({ success: true, companyDetails });
  } catch (error: any) {
    console.log("Error in getCompanyById", error.message);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const updateCompany = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [
      comp_name,
      comp_start_date,
      comp_contact_person,
      comp_email,
      comp_industry,
      com_positions_offered,
      comp_address,
      comp_jobs_offered,
      comp_no_employs,
      comp_website,
      comp_location,
      comp_contact_no,
      comp_departments,
      comp_no_of_stud,
      comp_courses_offered,
    ] = req.body;
    if (
      [
        comp_name,
        comp_start_date,
        comp_contact_person,
        comp_email,
        comp_industry,
        com_positions_offered,
        comp_address,
        comp_jobs_offered,
        comp_no_employs,
        comp_website,
        comp_location,
        comp_contact_no,
        comp_departments,
        comp_no_of_stud,
        comp_courses_offered,
      ].some((field) => field === "")
    ) {
      return res.status(400).json({ msg: "All fields are required" });
    }
    const companyDetails = await company.findById(id);
    if (!companyDetails) {
      return res.status(400).json({ msg: "Company not found" });
    }
    await company.findByIdAndUpdate(id, {
      comp_name,
      comp_start_date,
      comp_contact_person,
      comp_email,
      comp_industry,
      com_positions_offered,
      comp_address,
      comp_jobs_offered,
      comp_no_employs,
      comp_website,
      comp_location,
      comp_contact_no,
      comp_departments,
      comp_no_of_stud,
      comp_courses_offered,
    });
    return res.status(200).json({ success: true, msg: "Company updated" });
  } catch (error: any) {
    console.log("Error in updateCompany", error.message);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const deleteCompany = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const companyDetails = await company.findById(id);
    if (!companyDetails) {
      return res.status(400).json({ msg: "Company not found" });
    }
    await company.findByIdAndDelete(id);
    return res.status(200).json({ success: true, msg: "Company deleted" });
  } catch (error: any) {
    console.log("Error in deleteCompany", error.message);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

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
      status,
      company_name,
      college,
    } = req.body;

    // ✅ Validate all required fields
    if (
      !job_title ||
      !job_type ||
      !job_location ||
      !job_salary ||
      !job_description ||
      !job_requirements ||
      !job_posted_date ||
      !max_no_dead_kt ||
      !max_no_live_kt ||
      !min_CGPI ||
      !yr_of_exp_req ||
      !branch_allowed ||
      !passing_year ||
      !job_timing ||
      !company_name ||
      !college
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required!" });
    }

    // ✅ Check if the same job already exists (fixing the bug)
    const existingJob = await Job.findOne({
      job_title,
      job_location,
      job_posted_date,
      company_name,
    });

    if (existingJob) {
      console.log("Job already exists");
      return res.status(409).json({ success: false, msg: "Job already exists" });
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

    for(let i=0;i<college.length;i++){
      const newCollegeJobLink=new CollegeJobLink({
        job_info:newJob._id,
        college:college[i],
        status:"pending"
      })
      await newCollegeJobLink.save();
    }

    console.log("Job created successfully:", newJob);
    return res
      .status(201)
      .json({ success: true, msg: "Job created successfully", job: newJob });
  } catch (error: any) {
    console.error("Error in createJobByCompany:", error.message);
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
