import { Schema, Types, model } from "mongoose";
import mongoose from "mongoose";
import { IStudent } from "../../student/models/student";
import { ICollege } from "../../college/models/college";
import { primarydb } from "../..";

export interface IJob extends Document {
  _id: string;
  job_title: string;
  company_name: Types.ObjectId;
  job_type: string;
  job_location: string;
  job_salary: number;
  job_description: string;
  job_requirements: string[];
  job_posted_date: Date;
  yr_of_exp_req: number;
  job_timing: string;
  max_no_live_kt: number; 
  max_no_dead_kt: number;
  min_CGPI: number;
  branch_allowed: string[];
  passing_year: number[];
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
  company_name: {
    type: Schema.Types.ObjectId,
    ref:"Company",
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
  max_no_dead_kt: {
    type: Number,
    required: true,
  },
  max_no_live_kt: {
    type: Number,
    required: true,
  },
  min_CGPI: {
    type: Number,
    required: true,
  },
  branch_allowed: {
    type: [String],
    required: true,
  },
  passing_year: [
    {
      type: Number,
      required: true,
    },
  ],
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
  }
});

const Job = primarydb.model("Job", JobSchema);
export default Job;