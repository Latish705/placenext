import { model, Schema } from "mongoose";
import mongoose from "mongoose";

export interface ICollege extends Document {
  _id?: string;
  coll_name: string;
  coll_address: string;
  coll_no_employs: number;
  coll_website: string;
  coll_location: string;
  colLcontact_no: string;
  coll_affiliated_to: string;
  coll_departments: string[];
  coll_no_of_stud: number;
  coll_courses_offered: string[];
  googleId: string;
}

const CollegeSchema = new Schema<ICollege>({
  coll_name: {
    type: String,
    required: true,
  },
  coll_address: {
    type: String,
    required: true,
  },
  coll_no_employs: {
    type: Number,
    required: true,
  },
  coll_website: {
    type: String,
    required: true,
  },
  coll_location: {
    type: String,
    required: true,
  },
  colLcontact_no: {
    type: String,
    required: true,
  },
  coll_affiliated_to: {
    type: String,
    required: true,
  },
  coll_departments: {
    type: [String],
  },
  coll_no_of_stud: {
    type: Number,
    required: true,
  },
  coll_courses_offered: {
    type: [String],
    required: true,
  },
  googleId: {
    type: String,
    required: true,
  },
});

const College = model<ICollege>("College", CollegeSchema);
export default College;
