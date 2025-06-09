import { Request, Response } from "express";
import Job from "../../job/models/job";
import { google } from "googleapis";
import College from "../../college/models/college";
import CollegeJobLink from "../../job/models/collegeJobLink";
import Company from "../models/company";

export const isFirstSignIn = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const user = req.user;
    if (!user) {
      return res.status(404).json({ success: false, data: "User not found in request" });
    }

    const existingCompany = await Company.findOne({ googleId: user.uid });
    return res.status(200).json({ success: true, isFirstSignIn: !existingCompany });
  } catch (error: any) {
    console.error("Error in isFirstSignIn:", error.message);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const signup = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const user = req.user;
    return res.status(200).json({ success: true, user });
  } catch (error: any) {
    console.error("Error in signup:", error.message);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const createCompanyApplication = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const user = req.user;
    const comp_email = user?.email;

    const {
      comp_name,
      comp_start_date,
      comp_contact_person,
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

    const requiredFields = [
      comp_name,
      comp_start_date,
      comp_contact_person,
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
    ];

    if (requiredFields.some((field) => field === "" || field == null)) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const existingCompany = await Company.findOne({ comp_email });
    if (existingCompany) {
      return res.status(400).json({ success: false, msg: "Company already exists" });
    }

    const newCompany = new Company({
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
      googleId: user.uid,
    });

    await newCompany.save();

    return res.status(200).json({ success: true, msg: "Company created" });
  } catch (error: any) {
    console.error("Error in createCompanyApplication:", error.message);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const getCompany = async (_req: Request, res: Response) => {
  try {
    const companies = await Company.find();
    return res.status(200).json({ success: true, companies });
  } catch (error: any) {
    console.error("Error in getCompany:", error.message);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const getCompanyById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const companyDetails = await Company.findById(id);
    if (!companyDetails) {
      return res.status(404).json({ success: false, msg: "Company not found" });
    }
    return res.status(200).json({ success: true, companyDetails });
  } catch (error: any) {
    console.error("Error in getCompanyById:", error.message);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const updateCompany = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
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

    const requiredFields = [
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
    ];

    if (requiredFields.some((field) => field === "" || field == null)) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const company = await Company.findById(id);
    if (!company) {
      return res.status(404).json({ msg: "Company not found" });
    }

    await Company.findByIdAndUpdate(id, {
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
    console.error("Error in updateCompany:", error.message);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const deleteCompany = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const company = await Company.findById(id);
    if (!company) {
      return res.status(404).json({ msg: "Company not found" });
    }

    await Company.findByIdAndDelete(id);
    return res.status(200).json({ success: true, msg: "Company deleted" });
  } catch (error: any) {
    console.error("Error in deleteCompany:", error.message);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};
