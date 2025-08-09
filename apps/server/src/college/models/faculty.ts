import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { IDepartment } from "./department";
import jwt, { SignOptions } from "jsonwebtoken";
import { ICollege } from "./college";
import { primarydb } from "../..";

export interface IFaculty extends Document {
  _id?: string;
  faculty_name: string;
  faculty_email: string;
  faculty_contact_no: string;
  faculty_address: string;
  faculty_designation: string;
  faculty_college_id: ICollege["_id"];
  faculty_department_id: IDepartment["_id"];
  faculty_yr_of_exp: number;
  faculty_qualification: string;
  faculty_experience: number;
  faculty_salary: number;
  faculty_joining_date: Date;
  role: string;
  faculty_password: string;
  refreshToken: string;
  accessToken: string;
  googleId: string;
  comparePassword: (candidatePassword: string) => Promise<boolean>;
  generateRefreshToken: () => string;
  generateAccessToken: () => string;
}

const FacultySchema = new Schema<IFaculty>({
  faculty_name: {
    type: String,
  },
  faculty_email: {
    type: String,
    required: true,
    unique: true,
  },
  faculty_contact_no: {
    type: String,

    // unique: true,
  },
  faculty_address: {
    type: String,
  },
  faculty_designation: {
    type: String,
  },
  faculty_college_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "College",
  },
  // faculty_department_id: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Department",
  //   required: true,
  // },
  faculty_yr_of_exp: {
    type: Number,
    // required: true,
  },
  faculty_qualification: {
    type: String,
    // required: true,
  },
  faculty_experience: {
    type: Number,
    // required: true,
  },
  faculty_salary: {
    type: Number,
    // required: true,
  },
  faculty_joining_date: {
    type: Date,
    // required: true,
  },
  role: {
    type: String,
    default: "none", // all roles are like [none, admin, faculty, tpo , student]
  },
  googleId: {
    type: String,
  },
  // faculty_password: {
  //   type: String,
  //   required: true,
  // },
  // refreshToken: {
  //   type: String,
  // },
  // accessToken: {
  //   type: String,
  // },
});

FacultySchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.faculty_password = await bcrypt.hash(this.faculty_password, 10);
  next();
});

FacultySchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  return await bcrypt.compare(candidatePassword, this.faculty_password);
};

FacultySchema.methods.generateRefreshToken = function (): string {
  return jwt.sign(
    { _id: this._id, email: this.faculty_email },
    process.env.JWT_REFRESH_TOKEN as string, // ✅ ensure it's string
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRE as string, // ✅ cast to string
    } as SignOptions
  );
};

FacultySchema.methods.generateAccessToken = function (): string {
  return jwt.sign(
    { _id: this._id },
    process.env.JWT_ACCESS_TOKEN as string, // ✅ ensure it's string
    {
      expiresIn: process.env.JWT_ACCESS_EXPIRE as string, // ✅ cast to string
    } as SignOptions
  );
};


const Faculty = primarydb.model("Faculty", FacultySchema);
export default Faculty;
