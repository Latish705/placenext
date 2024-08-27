import { model, Schema, Document } from "mongoose";

export interface IStudentInfo extends Document {
  _id?: string;
  stud_resume: string;
  stud_addmission_year: number;
  stud_sem1: string;
  stud_sem2: string;
  stud_sem3: string;
  stud_sem4: string;
  stud_sem5: string;
  stud_sem6: string;
  stud_sem7: string;
  stud_sem8: string;
  stud_cet: string;
  stud_jee: string;
  stud_hsc: string;
  stud_hsc_board: string;
  stud_ssc: string;
  stud_ssc_board: string;
  stud_diploma: string;
  stud_diploma_board: string;
  stud_diploma_stream: string;
  stud_alternate_email: string;
  stud_alternate_phone: string;
  stud_capAllotment: string;
  stud_photoWithSignature: string;
  stud_gapCertificate: string;
  stud_aadhar: string;
  stud_pan: string;
  handicap_cert: string | null;
  no_of_live_backlogs: number;
  no_of_dead_backlogs: number;
  stud_placement_status: boolean;
  stud_placement_package: number;
  stud_placement_company: string;
  stud_placement_date: Date;
  student_skills: string[];
  stud_linkedIn: string;
  stud_github: string;
}

const Student_InfoSchema = new Schema<IStudentInfo>({
  stud_resume: {
    type: String,
    required: true,
  },
  stud_addmission_year: {
    type: Number,
    required: true,
  },
  stud_sem1: {
    type: String,
    required: true,
  },
  stud_sem2: {
    type: String,
    required: true,
  },
  stud_sem3: {
    type: String,
    required: true,
  },
  stud_sem4: {
    type: String,
    required: true,
  },
  stud_sem5: {
    type: String,
    required: true,
  },
  stud_sem6: {
    type: String,
    required: true,
  },
  stud_sem7: {
    type: String,
    required: true,
  },
  stud_sem8: {
    type: String,
    required: true,
  },
  stud_cet: {
    type: String,
    required: true,
  },
  stud_jee: {
    type: String,
    required: true,
  },
  stud_hsc: {
    type: String,
    required: true,
  },
  stud_hsc_board: {
    type: String,
    required: true,
  },
  stud_ssc: {
    type: String,
    required: true,
  },
  stud_ssc_board: {
    type: String,
    required: true,
  },
  stud_diploma: {
    type: String,
    required: true,
  },
  stud_diploma_board: {
    type: String,
    required: true,
  },
  stud_diploma_stream: {
    type: String,
    required: true,
  },
  stud_alternate_email: {
    type: String,
    required: true,
  },
  stud_alternate_phone: {
    type: String,
    required: true,
  },
  stud_capAllotment: {
    type: String,
    required: true,
  },
  stud_photoWithSignature: {
    type: String,
    required: true,
  },
  stud_gapCertificate: {
    type: String,
    required: true,
  },
  stud_aadhar: {
    type: String,
    required: true,
  },
  stud_pan: {
    type: String,
    required: true,
  },
  handicap_cert: {
    type: String,
    default: null,
  },
  no_of_live_backlogs: {
    type: Number,
    required: true,
  },
  no_of_dead_backlogs: {
    type: Number,
    required: true,
  },
  stud_placement_status: {
    type: Boolean,
    required: true,
  },
  stud_placement_package: {
    type: Number,
    required: true,
  },
  stud_placement_company: {
    type: String,
    required: true,
  },
  stud_placement_date: {
    type: Date,
    required: true,
  },
  student_skills: {
    type: [String],
    required: true,
  },
  stud_linkedIn: {
    type: String,
    required: false,
  },
  stud_github: {
    type: String,
    required: false,
  },
});

const StudentInfo = model<IStudentInfo>("StudentInfo", Student_InfoSchema);
export default StudentInfo;
