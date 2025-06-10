import { Request, Response } from "express";
import Job from "../../job/models/job";
import CollegeJobLink from "../models/collegeJobLink";
import Company from "../../company/models/company";
import College from "../../college/models/college";
import mongoose from "mongoose";
import Round from "../../round/models/round.model";
import RoundStudentLink from "../../round/models/roundstudentlink";
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
    // @ts-ignore
    const loginCompanyUser = req.user;
    
    const company = await Company.findOne({ googleId: loginCompanyUser.uid });
    if (!company) {
      return res.status(400).json({
        success: false,
        message: "Company not found"
      });
    }

    const pendingJobs = await CollegeJobLink.find({ 
      status: "pending" 
    }).populate({
      path: 'job_info',
      match: { company_name: company._id }
    }).populate('college', 'coll_name');

    const filteredJobs = pendingJobs.filter((link: { job_info: null; }) => link.job_info !== null);

    return res.status(200).json({
      success: true,
      message: "Pending jobs fetched successfully",
      data: filteredJobs
    });
  } catch (error: any) {
    console.error("Error in getAllPendingJobRequest:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

export const getAllAcceptedJobRequest = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const loginCompanyUser = req.user;
    
    const company = await Company.findOne({ googleId: loginCompanyUser.uid });
    if (!company) {
      return res.status(400).json({
        success: false,
        message: "Company not found"
      });
    }

    const acceptedJobs = await CollegeJobLink.find({ 
      status: "accepted" 
    }).populate({
      path: 'job_info',
      match: { company_name: company._id }
    }).populate('college', 'coll_name');

    const filteredJobs = acceptedJobs.filter((link: { job_info: null; }) => link.job_info !== null);

    return res.status(200).json({
      success: true,
      message: "Accepted jobs fetched successfully",
      data: filteredJobs
    });
  } catch (error: any) {
    console.error("Error in getAllAcceptedJobRequest:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

export const getAllRejectedJobRequest = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const loginCompanyUser = req.user;
    
    const company = await Company.findOne({ googleId: loginCompanyUser.uid });
    if (!company) {
      return res.status(400).json({
        success: false,
        message: "Company not found"
      });
    }

    const rejectedJobs = await CollegeJobLink.find({ 
      status: "rejected" 
    }).populate({
      path: 'job_info',
      match: { company_name: company._id }
    }).populate('college', 'coll_name');

    const filteredJobs = rejectedJobs.filter((link: { job_info: null; }) => link.job_info !== null);

    return res.status(200).json({
      success: true,
      message: "Rejected jobs fetched successfully",
      data: filteredJobs
    });
  } catch (error: any) {
    console.error("Error in getAllRejectedJobRequest:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

export const getjobdetail = async (req: Request, res: Response) => {
  try {
    const { job_id } = req.params;
    if (!job_id) {
      return res.status(400).json({
        success: false,
        message: "job_id is required"
      });
    }

    const job = await Job.findById(job_id);
    if (!job) {
      return res.status(400).json({
        success: false,
        message: "Job not found"
      });
    }

    const jobDetail: {
      _id: typeof job._id,
      job_title: typeof job.job_title,
      job_description: typeof job.job_description,
      job_location: typeof job.job_location,
      job_salary: typeof job.job_salary,
      rounds: any[]
    } = {
      _id: job._id,
      job_title: job.job_title,
      job_description: job.job_description,
      job_location: job.job_location,
      job_salary: job.job_salary,
      rounds: []
    };

    const rounds = await Round.find({ job_id: job._id }).sort({ round_number: 1 });
    
    const processedRounds = await Promise.all(rounds.map(async (round: { _id: any; round_type: any; round_number: any; }) => {
      try {
        const studentLinks = await RoundStudentLink.find({ round_id: round._id })
          .populate({
            path: 'student_id',
            model: 'Student',  
            select: 'stud_name stud_department stud_year', 
            populate: {
              path: 'stud_department',
              model: 'Department',
              select: 'dept_name'
            }
          })
          .lean(); 

        console.log("studentLinks:-", JSON.stringify(studentLinks, null, 2));

        const student_list = studentLinks.map((link: { student_id: {}; selected: any; }) => {

          const student = (link?.student_id || {}) as {
            _id?: any;
            stud_name?: string;
            stud_department?: string;
            stud_year?: number;
          };
          
          return {
            student_id: student._id || '',
            name: student.stud_name,
            division: student.stud_department,
            year: student.stud_year
          };
        });

        return {
          _id: round._id,
          round_type: round.round_type,
          round_number: round.round_number,
          student_list
        };
      } catch (error) {
        console.error(`Error processing round ${round._id}:`, error);
        return {
          _id: round._id,
          round_type: round.round_type,
          round_number: round.round_number,
          student_list: []
        };
      }
    }));

    jobDetail.rounds = processedRounds;

    return res.status(200).json({
      success: true,
      data: jobDetail
    });

  } catch (error: any) {
    console.error("Error in getjobdetail:", error);
    return res.status(500).json({
      success: false,
      message: "Error in getjobdetail",
      error: error.message
    });
  }
};

