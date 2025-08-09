import { Request,Response } from "express"
import Job from "../../job/models/job";
import Round from "../models/round.model";

import RoundStudentLink from "../models/roundstudentlink";
import Student from "../../student/models/student";
import mongoose from "mongoose";


export const createRound = async (req: Request, res: Response) => {
    try {
        const { job_id, round_type} = req.body;
        if (!job_id || !round_type) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }
        console.log("req body:-",req.body);
        const job = await Job.findById(job_id);
        if (!job) {
            return res.status(400).json({
                success: false,
                message: "No job found with the given job_id"
            });
        }
        console.log("job ",job);
        const numberOfRounds = await Round.countDocuments({ job_id: job_id });
        console.log("numberofrounds:-",numberOfRounds);
        if (numberOfRounds > 0) {
            await Round.findOneAndUpdate(
                {
                    job_id: job_id,
                    round_number: numberOfRounds
                },
                { isNextRound: true }
            );
        }
        const new_round = await Round.create({

            job_id,
            round_number: numberOfRounds + 1,
            round_type,
            isNextRound: false
        });
        console.log("newround:-",new_round);
        return res.status(200).json({
            success: true,
            data: new_round[0],
            message: "New round created successfully!"
        });
    } catch (error: any) {
        console.log("Error in createRound:", error.message);
        return res.status(500).json({
            success: false,
            message: "Issue while creating new round",
            error: error.message
        });
    }
};

export const studentApplyToTheJob = async (req: Request, res: Response) => {
  try {
    const { job_id, student_id } = req.body;

    if (!job_id || !student_id) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const student = await Student.findById(student_id);
    if (!student) {
      return res.status(400).json({
        success: false,
        message: "Student not found",
      });
    }

    const round1 = await Round.findOne({ job_id: job_id, round_number: 1 });
    if (!round1) {
      return res.status(400).json({
        success: false,
        message: "The given job_id does not have any round yet!",
      });
    }

    const existingApplication = await RoundStudentLink.findOne({
      round_id: round1._id,
      student_id: student_id,
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: "Student has already applied",
      });
    }

    const newApplication = await RoundStudentLink.create({
      round_id: round1._id,
      student_id: student_id,
    });

    return res.status(200).json({
      success: true,
      data: newApplication,
      message: "Student applied successfully",
    });
  } catch (error: any) {
    console.log("Error while applying to the job:", error.message);
    return res.status(500).json({
      success: false,
      message: "Issue while applying to the job",
      data: error.message,
    });
  }
};

export const selectStudentToNextRound = async (req: Request, res: Response) => {
  try {
    const { round_id, student_id } = req.body;

    if (!round_id || !student_id) {
      return res.status(400).json({
        success: false,
        message: "All fields are required!",
      });
    }

    const currentRound = await Round.findById(round_id);
    if (!currentRound) {
      return res.status(400).json({
        success: false,
        message: "Round not found",
      });
    }

    const student=await Student.findById(student_id);
    if(!student){
        return res.status(400)
        .json({
            success:false,
            message:"student not found"
        })
    }

    const currentLink = await RoundStudentLink.findOne({
      round_id: round_id,
      student_id: student_id,
    });

    if (!currentLink) {
      return res.status(400).json({
        success: false,
        message: "Student is not part of the current round",
      });
    }

    if (!currentRound.isNextRound) {
      return res.status(400).json({
        success: false,
        message: "This is the last round",
      });
    }

    const nextRound = await Round.findOne({
      round_number: currentRound.round_number + 1,
      job_id: currentRound.job_id,
    });

    if (!nextRound) {
      return res.status(400).json({
        success: false,
        message: "Next round not found",
      });
    }

    await currentLink.deleteOne();

    const newEntry = await RoundStudentLink.create({
      round_id: nextRound._id,
      student_id: student_id,
    });

    return res.status(200).json({
      success: true,
      data: newEntry,
      message: "Student successfully moved to the next round",
    });
  } catch (e: any) {
    console.log("Error in selectStudentToNextRound:", e.message);
    return res.status(500).json({
      success: false,
      message: "Error in selecting student to next round",
      data: e.message,
    });
  }
};

export const getAllRoundsOfJobs=async(req:Request,res:Response)=>{
    try {
        const {job_id}=req.body;
        if(!job_id){
            return res.status(400).json({
                success:false,
                message:"all fields are required"
            })
        }
        const rounds=await Round.find({job_id:job_id});
        return res.status(200)
        .json({
            success:true,
            data:rounds,
            message:"rounds found successfully!"
        })
    } catch (error:any) {
        console.log("error in getAllRounds:- ",error.message);
        return res.status(500).json({
            success:false,
            message:"issue while getting all the rounds",
            data:error.message
        })
    }
}

export const getAllJobsOfCompany = async (req: Request, res: Response) => {
  try {
    const { company_id } = req.body;

    if (!company_id) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const jobs = await Job.find({
      company_name: new mongoose.Types.ObjectId(company_id),
    });

    return res.status(200).json({
      success: true,
      message: "Jobs are fetched successfully!",
      data: jobs,
    });
  } catch (error: any) {
    console.log("Error in getAllJobsOfCompany:", error.message);
    return res.status(500).json({
      success: false,
      data: error.message,
      message: "Error in getAllJobsOfCompany",
    });
  }
};
