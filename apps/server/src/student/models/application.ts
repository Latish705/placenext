import { Schema, model, Document } from "mongoose";
import mongoose from "mongoose";
import { IJob } from "../../job/models/job";
import { IStudent } from "./student";
import { primarydb } from "../..";

export interface IApplication extends Document {
  _id: string;
  app_cover_letter: string;
  app_job_id: IJob["_id"];
  student: IStudent["_id"];
  app_status: string;
}

const ApplicationSchema = new Schema<IApplication>({
  app_cover_letter: {
    type: String,
    required: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student", // Reference to the Student model
    required: true,
  },
  //@ts-ignore
  app_job_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job", // Reference to the Job model
    required: true,
  },
  app_status: {
    type: String,
    required: true,
    default: "Pending",
  },
});

const Application = primarydb.model("Application", ApplicationSchema);
export default Application;
