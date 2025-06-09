import { model, Schema } from "mongoose";

import { primarydb } from "../..";

export interface ICompany extends Document {
  _id?: string;
  comp_name: string;
  comp_start_date: Date;
  comp_contact_person: string;
  comp_email: string;
  comp_industry: string;
  com_positions_offered: string[];
  comp_address: string;
  comp_jobs_offered: string[];
  comp_no_employs: number;
  comp_website: string;
  comp_location: string;
  comp_contact_no: string;
  comp_departments: string[];
  comp_no_of_stud: number;
  comp_courses_offered: string[];
  googleId: string;
}

const CompanySchema = new Schema<ICompany>({
  comp_name: {
    type: String,
    required: true,
    unique: true,
  },
  comp_start_date: {
    type: Date,
    required: true,
  },
  comp_contact_person: {
    type: String,
    required: true,
  },
  comp_email: {
    type: String,
    required: true,
  },
  comp_industry: {
    type: String,
    required: true,
  },
  com_positions_offered: {
    type: [String],
    required: true,
  },
  comp_address: {
    type: String,
    required: true,
  },
  comp_jobs_offered: {
    type: [String],
    required: true,
  },
  comp_no_employs: {
    type: Number,
    required: true,
  },
  comp_website: {
    type: String,
    required: true,
  },
  comp_location: {
    type: String,
    required: true,
  },
  comp_contact_no: {
    type: String,
    required: true,
  },
  comp_departments: {
    type: [String],
    required: true,
  },
  comp_no_of_stud: {
    type: Number,
    required: true,
  },
  comp_courses_offered: {
    type: [String],
    required: true,
  },
  googleId: {
    type: String,
    required: true,
  },
});

const Company = primarydb.model("Company", CompanySchema);

export default Company;
