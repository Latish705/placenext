import { Request, Response } from "express";
import admin from "../../config/firebaseAdmin";
import Student from "../models/student";
import StudentInfo from "../models/info_student";

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
    // here we will check if the user is signing in for the first time
    // the main logic is the student model should exsist having this id as jwt id
    // if the student model does not exsist then we will return true
    // @ts-ignore
    const user = req.user;

    const student = await Student.findOne({ googleId: user.uid });
    if (!student) {
      return res.status(200).json({ success: true, isFirstSignIn: true });
    } else {
      return res.status(200).json({ success: true, isFirstSignIn: false });
    }
  } catch (error: any) {
    console.log("Error in isFirstSignIn", error.message);

    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const applicationFrom = async (req: Request, res: Response) => {
  try {
    const {
      firstName,
      middleName,
      lastName,
      email,
      phone,
      dob,
      course,
      year,
      department,
      address,
      college,
      resume,
      addmissionYear,
      sem1,
      sem2,
      sem3,
      sem4,
      sem5,
      sem6,
      sem7,
      sem8,
      cet,
      jee,
      hsc,
      hscBoard,
      ssc,
      sscBoard,
      diploma,
      diplomaBoard,
      diplomaStream,
      alternateEmail,
      alternatePhone,
      capAllotment,
      photoWithSignature,
      gapCertificate,
      aadhar,
      pan,
      handicapCert,
      liveBacklogs,
      deadBacklogs,
      placementStatus,
      placementPackage,
      placementCompany,
      placementDate,
      skills,
      linkedIn,
      github,
    } = req.body;
    if (
      [
        firstName,
        middleName,
        lastName,
        email,
        phone,
        dob,
        course,
        year,
        department,
        address,
        college,
        resume,
        addmissionYear,
        // sem1,
        // sem2,
        // sem3,
        // sem4,
        // sem5,
        // sem6,
        // sem7,
        // sem8,
        // cet,
        // jee,
        // hsc,
        // hscBoard,
        ssc,
        sscBoard,
        // diploma,
        // diplomaBoard,
        // diplomaStream,
        alternateEmail,
        alternatePhone,
        capAllotment,
        photoWithSignature,
        gapCertificate,
        aadhar,
        pan,
        // handicapCert,
        liveBacklogs,
        deadBacklogs,
        placementStatus,
        // placementPackage,
        // placementCompany,
        // placementDate,
        skills,
        linkedIn,
        github,
      ].some((field) => field === "")
    ) {
      return res.status(400).json({ msg: "All fields are required" });
    }
    const exsistingUser = await Student.findOne({ stud_email: email });
    if (exsistingUser) {
      return res
        .status(400)
        .json({ success: false, msg: "User already exsists" });
    }

    const studentInfo = new StudentInfo({
      stud_resume: resume,
      stud_addmission_year: addmissionYear,
      stud_sem1: sem1,
      stud_sem2: sem2,
      stud_sem3: sem3,
      stud_sem4: sem4,
      stud_sem5: sem5,
      stud_sem6: sem6,
      stud_sem7: sem7,
      stud_sem8: sem8,
      stud_cet: cet,
      stud_jee: jee,
      stud_hsc: hsc,
      stud_hsc_board: hscBoard,
      stud_ssc: ssc,
      stud_ssc_board: sscBoard,
      stud_diploma: diploma,
      stud_diploma_board: diplomaBoard,
      stud_diploma_stream: diplomaStream,
      stud_alternate_email: alternateEmail,
      stud_alternate_phone: alternatePhone,
      stud_capAllotment: capAllotment,
      stud_photoWithSignature: photoWithSignature,
      stud_gapCertificate: gapCertificate,
      stud_aadhar: aadhar,
      stud_pan: pan,
      handicap_cert: handicapCert,
      no_of_live_backlogs: liveBacklogs,
      no_of_dead_backlogs: deadBacklogs,
      stud_placement_status: placementStatus,
      stud_placement_package: placementPackage,
      stud_placement_company: placementCompany,
      stud_placement_date: placementDate,
      student_skills: skills,
      stud_linkedIn: linkedIn,
      stud_github: github,
    });

    const savedStudentInfo = await studentInfo.save();

    const student = new Student({
      stud_name: `${firstName} ${middleName} ${lastName}`,
      stud_email: email,
      stud_address: address,
      stud_phone: phone,
      stud_dob: dob,
      stud_course: course,
      stud_year: year,
      stud_department: department,
      stud_college_id: college,
      googleId: "",
      stud_info_id: savedStudentInfo._id,
    });

    const savedStudent = await student.save();
    console.log("Student filled application form", savedStudent.id);

    return res.status(200).json({ success: true, student: savedStudent });
  } catch (error: any) {
    console.log("Error in applicationFrom", error.message);

    return res.status(500).json({ msg: "Internal Server Error" });
  }
};
