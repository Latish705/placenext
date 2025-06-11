import { Schema, model, Document,Types } from "mongoose";
import { primarydb } from "../..";

export interface ICollegeJobLink extends Document {
  _id: string;
  job_info: Types.ObjectId;
  college: Types.ObjectId;
  status: "accepted" | "rejected" | "pending";
}

const CollegeJobLinkSchema = new Schema<ICollegeJobLink>({
  job_info: {
    type: Schema.Types.ObjectId,
    ref: "Job",
    required: true,
  },
  college: {
    type: Schema.Types.ObjectId,
    ref: "College",
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ["accepted", "rejected", "pending"],
  },
});

const CollegeJobLink = primarydb.model("CollegeJobLink",CollegeJobLinkSchema);

export default CollegeJobLink;