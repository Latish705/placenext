import { model, Schema, Document } from "mongoose";
import mongoose from "mongoose";
import { ICollege } from "../../college/models/college";
import { IStudentInfo } from "./info_student";

interface IStudent extends Document {
  stud_name: string;
  stud_phone: string;
  stud_email: string;
  stud_address: string;
  stud_dob: Date;
  stud_course: string;
  stud_year: number;
  stud_department: string;
  stud_college_id: ICollege["_id"];
  googleId: string;
  stud_info_id: IStudentInfo["_id"];
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
    required: true,
  },
  stud_department: {
    type: String,
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
    ref: "IStudentInfo",
    required: true,
  },
});

const Student = model<IStudent>("Student", IStudentSchema);
export default Student;
