import { model, Schema, Document } from "mongoose";

export interface IStudentInfo extends Document {
  _id: string;
  stud_resume: string;
  stud_addmission_year: number;
  stud_sem1_grade: string;
  stud_sem2_grade: string;
  stud_sem3_grade: string;
  stud_sem4_grade: string;
  stud_sem5_grade: string;
  stud_sem6_grade: string;
  stud_sem7_grade: string;
  stud_sem8_grade: string;
  stud_sem1_marksheet: string;
  stud_sem2_marksheet: string;
  stud_sem3_marksheet: string;
  stud_sem4_marksheet: string;
  stud_sem5_marksheet: string;
  stud_sem6_marksheet: string;
  stud_sem7_marksheet: string;
  stud_sem8_marksheet: string;
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
  stud_linkedIn?: string;
  stud_github?: string;
}

const Student_InfoSchema = new Schema<IStudentInfo>({
  stud_resume: {
    type: String,
  },
  stud_addmission_year: {
    type: Number,
    required: true,
  },
  stud_sem1_grade: {
    type: String,
    required: true,
  },
  stud_sem2_grade: {
    type: String,
    required: true,
  },
  stud_sem3_grade: {
    type: String,
    required: true,
  },
  stud_sem4_grade: {
    type: String,
    required: true,
  },
  stud_sem5_grade: {
    type: String,
    default: null,
  },
  stud_sem6_grade: {
    type: String,
    default: null,
  },
  stud_sem7_grade: {
    type: String,
    default: null,
  },
  stud_sem8_grade: {
    type: String,
    default: null,
  },
  stud_sem1_marksheet: {
    type: String,
    required: true,
  },
  stud_sem2_marksheet: {
    type: String,
    required: true,
  },
  stud_sem3_marksheet: {
    type: String,
    required: true,
  },
  stud_sem4_marksheet: {
    type: String,
    required: true,
  },
  stud_sem5_marksheet: {
    type: String,
    default: null,
  },
  stud_sem6_marksheet: {
    type: String,
    default: null,
  },
  stud_sem7_marksheet: {
    type: String,
    default: null,
  },
  stud_sem8_marksheet: {
    type: String,
    default: null,
  },
  stud_cet: {
    type: String,
    required: true,
  },
  stud_jee: {
    type: String,
  },
  stud_hsc: {
    type: String,
  },
  stud_hsc_board: {
    type: String,
  },
  stud_ssc: {
    type: String,
  },
  stud_ssc_board: {
    type: String,
  },
  stud_diploma: {
    type: String,
  },
  stud_diploma_board: {
    type: String,
  },
  stud_diploma_stream: {
    type: String,
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
  },
  stud_photoWithSignature: {
    type: String,
  },
  stud_gapCertificate: {
    type: String,
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
  },
  no_of_dead_backlogs: {
    type: Number,
  },
  stud_placement_status: {
    type: Boolean,
    default: false,
  },
  stud_placement_package: {
    type: Number,
  },
  stud_placement_company: {
    type: String,
  },
  stud_placement_date: {
    type: Date,
  },
  student_skills: {
    type: [String],
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
