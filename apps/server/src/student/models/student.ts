import { model, Schema, Document } from "mongoose";
import mongoose from "mongoose";
import { ICollege } from "../../college/models/college";
import { IStudentInfo } from "./info_student";
import { IDepartment } from "../../college/models/department";
import { primarydb } from "../..";

export interface IStudent extends Document {
  // _id: string;
  stud_name: string;
  stud_phone: string;
  stud_email: string;
  stud_address: string;
  stud_dob: Date;
  stud_course: string;
  stud_year: number;
  current_year: number;
  stud_department: IDepartment["_id"];
  stud_college_id: mongoose.Types.ObjectId;
  googleId: string;
  stud_info_id: mongoose.Types.ObjectId;
  isSystemVerified: boolean;
  isCollegeVerified: boolean;
}

const IStudentSchema = new Schema<IStudent>({
  stud_name: {
    type: String,
    required: true,
  },
  stud_email: {
    type: String,
    required: true,
    unique: true,
  },
  stud_address: {
    type: String,
    required: true,
  },
  stud_phone: {
    type: String,
    required: true,
    unique: true,
  },
  stud_dob: {
    type: Date,
    required: true,
  },
  stud_course: {
    type: String,
    required: true,
  },
  stud_year: {
    type: Number,
  },
  stud_department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    required: true,
  },
  stud_college_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "College",
    required: true,
  },
  googleId: {
    type: String,
    required: true,
    unique: true,
  },
  stud_info_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "StudentInfo",
    required: true,
  },
  isSystemVerified: {
    type: Boolean,
    default: false,
  },
  isCollegeVerified: {
    type: Boolean,
    default: false,
  },
});

const Student = primarydb.model("Student", IStudentSchema);
export default Student;
