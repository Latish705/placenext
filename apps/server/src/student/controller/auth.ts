import { Request, Response } from "express";
import admin from "../../config/firebaseAdmin";
import Student from "../models/student";
import StudentInfo from "../models/info_student";
import { uploadToGoogleDrive } from "../../config/Google";
import College from "../../college/models/college";
import axios from "axios";
import { Document_server_url } from "../../app";
const requiredFields = [
  "firstName",
  "middleName",
  "lastName",
  "email",
  "phone",
  "dob",
  "course",
  "year",
  "department",
  "address",
  "college",
  "addmissionYear",
  "ssc",
  "sscBoard",
  "alternateEmail",
  "alternatePhone",
  "capAllotment",
  "photoWithSignature",
  "gapCertificate",
  "aadhar",
  "pan",
  "liveBacklogs",
  "deadBacklogs",
  "placementStatus",
  "skills",
  "linkedIn",
  "github",
  "collegeId",
];

// Helper function to upload file and handle errors
const uploadMarksheet = async (file: any, label: string) => {
  if (file && Array.isArray(file) && file.length > 0) {
    const filePath = file[0].path;
    return await uploadToGoogleDrive(filePath);
  }
  return null;
};

const validateFields = (fields: any) => {
  return requiredFields.some((field) => fields[field] === "");
};

export const signup = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const user = req.user;
    res.status(200).json({ success: true, user });
  } catch (error: any) {
    console.log("Error in signup", error.message);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const isFirstSignIn = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const user = req.user;
    const student = await Student.findOne({ googleId: user.uid });

    return res.status(200).json({ success: true, isFirstSignIn: !student });
  } catch (error: any) {
    console.log("Error in isFirstSignIn", error.message);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const applicationFrom = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const user = req.user;
    console.log(req.body);

    const fields = req.body;

    // Validate required fields
    if (validateFields(fields)) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await Student.findOne({ stud_email: fields.email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, msg: "User already exists" });
    }

    // Upload marksheets
    const marksheetPromises = [
      // @ts-ignore
      uploadMarksheet(req.files?.sem1Marksheet, "sem1Marksheet"),
      // @ts-ignore
      uploadMarksheet(req.files?.sem2Marksheet, "sem2Marksheet"),
      // @ts-ignore
      uploadMarksheet(req.files?.sem3Marksheet, "sem3Marksheet"),
      // @ts-ignore
      uploadMarksheet(req.files?.sem4Marksheet, "sem4Marksheet"),
      // @ts-ignore
      uploadMarksheet(req.files?.sem5Marksheet, "sem5Marksheet"),
      // @ts-ignore
      uploadMarksheet(req.files?.sem6Marksheet, "sem6Marksheet"),
      // @ts-ignore
      uploadMarksheet(req.files?.sem7Marksheet, "sem7Marksheet"),
      // @ts-ignore
      uploadMarksheet(req.files?.sem8Marksheet, "sem8Marksheet"),
    ];

    const [
      sem1sheet,
      sem2sheet,
      sem3sheet,
      sem4sheet,
      sem5sheet,
      sem6sheet,
      sem7sheet,
      sem8sheet,
    ] = await Promise.all(marksheetPromises);

    const studentInfo = new StudentInfo({
      // stud_resume: fields.resume, // this is remaining
      stud_addmission_year: fields.admissionYear,
      stud_sem1_grade: fields.sem1CGPI,
      stud_sem2_grade: fields.sem2CGPI,
      stud_sem3_grade: fields.sem3CGPI,
      stud_sem4_grade: fields.sem4CGPI,
      stud_sem5_grade: fields.sem5CGPI,
      stud_sem6_grade: fields.sem6CGPI,
      stud_sem7_grade: fields.sem7CGPI,
      stud_sem8_grade: fields.sem8CGPI,
      stud_sem1_marksheet: sem1sheet,
      stud_sem2_marksheet: sem2sheet,
      stud_sem3_marksheet: sem3sheet,
      stud_sem4_marksheet: sem4sheet,
      stud_sem5_marksheet: sem5sheet,
      stud_sem6_marksheet: sem6sheet,
      stud_sem7_marksheet: sem7sheet,
      stud_sem8_marksheet: sem8sheet,
      stud_cet: fields.cet,
      // stud_jee: fields.jee, // this is remaining
      stud_hsc: fields.twelfthPercentage,
      stud_hsc_board: fields.hscBoard,
      stud_ssc: fields.tenthPercentage,
      stud_ssc_board: fields.sscBoard,
      // stud_diploma: fields.diploma, // this is remaining
      // stud_diploma_board: fields.diplomaBoard, // this is remaining
      // stud_diploma_stream: fields.diplomaStream, // this is remaining
      stud_alternate_email: fields.alternateEmail,
      stud_alternate_phone: fields.alternatePhoneNo,
      // stud_capAllotment: fields.capAllotment, // this is remaining
      // stud_photoWithSignature: fields.photoWithSignature, // this is remaining
      // stud_gapCertificate: fields.gapCertificate, // this is remaining
      stud_aadhar: fields.aadharNumber,
      stud_pan: fields.panNumber,
      // handicap_cert: fields.handicapCert, // this is remaining
      // no_of_live_backlogs: fields.liveBacklogs, // this is remaining
      // no_of_dead_backlogs: fields.deadBacklogs, // this is remaining
      // stud_placement_status: fields.placementStatus, // this is remaining
      // stud_placement_package: fields.placementPackage, // this is remaining
      // stud_placement_company: fields.placementCompany, // this is remaining
      // stud_placement_date: fields.placementDate, // this is remaining
      // student_skills: fields.skills, // this is remaining
      // stud_linkedIn: fields.linkedIn, // this is remaining
      // stud_github: fields.github, // this is remaining
    });

    const savedStudentInfo = await studentInfo.save();

    const student = new Student({
      stud_name: `${fields.firstName} ${fields.middleName} ${fields.lastName}`,
      stud_email: fields.email,
      stud_address: fields.address,
      stud_phone: fields.phoneNumber,
      stud_dob: fields.dateOfBirth,
      stud_course: fields.courseType,
      // stud_year: fields.year, // this is remaining
      stud_department: fields.departmentName,
      stud_college_id: fields.college,
      googleId: user.uid,
      stud_info_id: savedStudentInfo._id,
    });

    const savedStudent = await student.save();
    console.log("Student filled application form", savedStudent.id);

    console.log(
      "Application From Submitted Successfully by Student",
      savedStudent.id
    );

    const doc_res = await axios.post(`${Document_server_url}/verify_user`, {
      userId: savedStudent.id,
    });
    if (doc_res.data.success) {
      console.log("User added for verified successfully");
    }

    return res.status(200).json({
      success: true,
      student: savedStudent,
      message: "Application From Submitted Successfully",
    });
  } catch (error: any) {
    console.log("Error in applicationFrom", error.message);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const getAllCollegeList = async (req: Request, res: Response) => {
  try {
    const colleges = await College.find({}, "coll_name");

    const collegeList = colleges.map((college) => ({
      id: college._id,
      name: college.coll_name,
    }));

    return res.status(200).json({ success: true, colleges: collegeList });
  } catch (error: any) {
    console.error("Error in getAllCollegeList:", error.stack || error.message);

    // Return a standardized error response
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const getUserDetails = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const user = req.user;
    const student = await Student.findOne({ googleId: user.uid }).populate(
      "stud_info_id"
    );

    if (!student) {
      return res.status(404).json({ success: false, msg: "Student not found" });
    }

    return res.status(200).json({ success: true, student });
  } catch (error: any) {
    console.log("Error in getUserDetails", error.message);
  }
};
