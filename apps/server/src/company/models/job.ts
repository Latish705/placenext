import { Schema, model } from "mongoose";
import mongoose from "mongoose";

export interface IJob extends Document {
  _id?: string;
  job_title: string;
  job_type: string;
  job_location: string;
  job_salary: number;
  job_description: string;
  job_requirements: string[];
  job_posted_date: Date;
  yr_of_exp_req: number;
  job_timing: string;
  status: string;
  college: Object;
}

const JobSchema = new Schema<IJob>({
  job_title: {
    type: String,
    required: true,
  },
  job_type: {
    type: String,
    required: true,
  },
  job_location: {
    type: String,
    required: true,
  },
  job_salary: {
    type: Number,
    required: true,
  },
  job_description: {
    type: String,
    required: true,
  },
  job_requirements: {
    type: [String],
    required: true,
  },
  job_posted_date: {
    type: Date,
    required: true,
  },
  yr_of_exp_req: {
    type: Number,
    required: true,
  },
  job_timing: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  college: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "College",
  },
});

const Job = model<IJob>("Job", JobSchema);
export default Job;
