import { Request, Response } from "express";
import admin from "../../config/firebaseAdmin";
import Student from "../models/student";
import StudentInfo from "../models/info_student";
import { uploadToGoogleDrive } from "../../config/Google";
import College from "../../college/models/college";
import axios from "axios";
import { Document_server_url } from "../../app";
import Job, { IJob } from "../../job/models/job";
import Application from "../models/application";
import { jobs } from "googleapis/build/src/apis/jobs";
import CollegeJobLink from "../../job/models/collegeJobLink";
import Company from "../../company/models/company";
const requiredFields = [
  "firstName",
  "middleName",
  "lastName",
  "email",
  "phoneNumber",
  "dateOfBirth",
  "courseType",
  // "year",
  "departmentName",
  "address",
  "college",
  "admissionYear",
  "tenthPercentage",
  "sscBoard",
  "alternateEmail",
  "alternatePhoneNo",
  // "capAllotment",
  // "photoWithSignature",
  // "gapCertificate",
  "aadharNumber",
  "panNumber",
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
  requiredFields.forEach((field) => {
    if (!fields[field]) {
      console.log("Field is missing:", field);

      return true;
    }
  });
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

    if (!student) {
      return res.status(200).json({ success: true, isFirstSignIn: true });
    }

    // @ts-ignore
    if (student.stud_info_id == null) {
      return res.status(200).json({ success: true, isFirstSignIn: true });
    }
    return res.status(200).json({ success: true, isFirstSignIn: false });
  } catch (error: any) {
    console.log("Error in isFirstSignIn", error.message);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const applicationFrom = async (req: Request, res: Response) => {
  try {
    console.log("req body:-" ,req);
    // @ts-ignore
    const user = req.user;

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
      // @ts-ignore
      uploadMarksheet(req.files?.resume, "resume"),
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
      resume,
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
      stud_resume: resume,
      // stud_diploma: fields.diploma, // this is remaining
      // stud_diploma_board: fields.diplomaBoard, // this is remaining
      // stud_diploma_stream: fields.diplomaStream, // this is remaining
      stud_prn: fields.prn,
      stud_alternate_email: fields.alternateEmail,
      stud_alternate_phone: fields.alternatePhoneNo,
      // stud_capAllotment: fields.capAllotment, // this is remaining
      // stud_photoWithSignature: fields.photoWithSignature, // this is remaining
      // stud_gapCertificate: fields.gapCertificate, // this is remaining
      stud_aadhar: fields.aadharNumber,
      stud_pan: fields.panNumber,
      // handicap_cert: fields.handicapCert, // this is remaining
      no_of_live_backlogs: fields.liveBacklogs,
      no_of_dead_backlogs: fields.deadBacklogs,
      // stud_placement_status: fields.placementStatus, // this is remaining
      // stud_placement_package: fields.placementPackage, // this is remaining
      // stud_placement_company: fields.placementCompany, // this is remaining
      // stud_placement_date: fields.placementDate, // this is remaining
      // student_skills: fields.skills, // this is remaining
      stud_linkedIn: fields.linkedIn, // this is remaining
      stud_github: fields.github, // this is remaining
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

    const collegeList = colleges.map((college: any) => ({
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
      "stud_info_id stud_college_id"
    );

    if (!student) {
      return res.status(404).json({ success: false, msg: "Student not found" });
    }

    return res.status(200).json({ success: true, student });
  } catch (error: any) {
    console.log("Error in getUserDetails", error.message);
  }
};

export const updateUserDetails = async (req: Request, res: Response) => {
  //@ts-ignore
  const { userId } = req.user; // Assuming userId is extracted from token in authenticateToken middleware

  // Extract new data from the request body
  const {
    firstName,
    middleName,
    lastName,
    gender,
    fatherName,
    motherName,
    rollNumber,
    division,
    dateOfBirth,
    email,
    alternateEmail,
    aadharNumber,
    phoneNumber,
    alternatePhoneNo,
    panNumber,
    address,
    state,
    country,
    pincode,
    courseType,
    admissionYear,
    departmentName,
    tenthPercentage,
    hscBoard,
    twelfthPercentage,
    sscBoard,
    cet,
    sem1CGPI,
    sem2CGPI,
    sem3CGPI,
    sem4CGPI,
    sem5CGPI,
    sem6CGPI,
    sem7CGPI,
    sem8CGPI,
    college,
  } = req.body;

  try {
    // Find the student by userId
    let student = await Student.findOne({ _id: userId });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Update the student's profile information
    student.stud_name = firstName || student.stud_name;
    // student.middleName = middleName || student.middleName;
    // student.lastName = lastName || student.lastName;
    // student.gender = gender || student.gender;
    // student.fatherName = fatherName || student.fatherName;
    // student.motherName = motherName || student.motherName;
    // student.rollNumber = rollNumber || student.rollNumber;
    // student.division = division || student.division;
    // student.dateOfBirth = dateOfBirth || student.dateOfBirth;
    // student.email = email || student.email;
    // student.alternateEmail = alternateEmail || student.alternateEmail;
    // student.aadharNumber = aadharNumber || student.aadharNumber;
    // student.phoneNumber = phoneNumber || student.phoneNumber;
    // student.alternatePhoneNo = alternatePhoneNo || student.alternatePhoneNo;
    // student.panNumber = panNumber || student.panNumber;
    // student.address = address || student.address;
    // student.state = state || student.state;
    // student.country = country || student.country;
    // student.pincode = pincode || student.pincode;
    // student.courseType = courseType || student.courseType;
    // student.admissionYear = admissionYear || student.admissionYear;
    // student.departmentName = departmentName || student.departmentName;
    // student.tenthPercentage = tenthPercentage || student.tenthPercentage;
    // student.hscBoard = hscBoard || student.hscBoard;
    // student.twelfthPercentage = twelfthPercentage || student.twelfthPercentage;
    // student.sscBoard = sscBoard || student.sscBoard;
    // student.cet = cet || student.cet;
    // student.sem1CGPI = sem1CGPI || student.sem1CGPI;
    // student.sem2CGPI = sem2CGPI || student.sem2CGPI;
    // student.sem3CGPI = sem3CGPI || student.sem3CGPI;
    // student.sem4CGPI = sem4CGPI || student.sem4CGPI;
    // student.sem5CGPI = sem5CGPI || student.sem5CGPI;
    // student.sem6CGPI = sem6CGPI || student.sem6CGPI;
    // student.sem7CGPI = sem7CGPI || student.sem7CGPI;
    // student.sem8CGPI = sem8CGPI || student.sem8CGPI;
    // student.college = college || student.college;

    student.stud_phone = phoneNumber || student.stud_phone;
    student.stud_email = email || student.stud_email;
    student.stud_address = address || student.stud_address;
    student.stud_dob = dateOfBirth || student.stud_dob;
    student.stud_course = courseType || student.stud_course;
    student.stud_department = departmentName || student.stud_department;
    // student.stud_college_id = college || student.stud_college_id;
    student.stud_year = admissionYear || student.stud_year;
    // Save the updated profile to the database
    await student.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      student,
    });
  } catch (error) {
    console.error("Error updating profile: ", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating profile",
    });
  }
};

export const getStudentStatistics = async (req: Request, res: Response) => {
  try {
    console.log("Inside getStudentStatistics");

    // @ts-ignore
    const user = req.user;
    const student = await Student.findOne({ googleId: user.uid }).populate(
      "stud_info_id"
    );
    //@ts-ignore
    const appliedJobs = await Application.find({ student: student?._id });

    if (!student) {
      return res.status(404).json({ success: false, msg: "Student not found" });
    }
    if (appliedJobs.length === 0) {
      return res.status(200).json({ success: true, student, appliedJobs: [] });
    }

    const companiesCameToCollege = await Job.find({
      college: student.stud_college_id,
    });

    console.log(
      "Student statistics fetched successfully from student with id :",
      student._id
    );

    return res
      .status(200)
      .json({ success: true, appliedJobs, companiesCameToCollege });
  } catch (error: any) {
    console.log("Error in getStudentStatistics", error.message);
  }
};



export const getJobForCollege = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const user = req.user;
    const student = await Student.findOne({ googleId: user.uid }).populate("stud_department");

    if (!student) {
      return res.status(404).json({ success: false, msg: "Student not found" });
    }

    const studentInfo = await StudentInfo.findById(student.stud_info_id);
    if (!studentInfo) {
      return res.status(404).json({ success: false, msg: "Student info not found" });
    }

    // Calculate average CGPI
    const grades = [
      studentInfo.stud_sem1_grade,
      studentInfo.stud_sem2_grade,
      studentInfo.stud_sem3_grade,
      studentInfo.stud_sem4_grade,
      studentInfo.stud_sem5_grade,
      studentInfo.stud_sem6_grade,
      studentInfo.stud_sem7_grade,
      studentInfo.stud_sem8_grade,
    ];

    const validGrades = grades.filter(g => g !== "" && !isNaN(Number(g)));
    const totalCGPI = validGrades.reduce((sum, g) => sum + Number(g), 0);
    const averageCGPI = validGrades.length > 0 ? totalCGPI / validGrades.length : 0;

    const collegeId = student.stud_college_id;
    const jobLinks = await CollegeJobLink.find({ college: collegeId });

    console.log(collegeId,jobLinks);
    
    // Fetch jobs with populated company name
    const jobs: any[] = await Promise.all(
      jobLinks.map(async (link: any) => {
        console.log(link,link.job_info);
        
        const job = await Job.findById(link.job_info);
        console.log(job);
        
        if (!job) return null;
        const company = await Company.findById(job.company_name);
        const jobObj = job;
        jobObj.company_name = company ? company.comp_name : "Unknown";
        return jobObj;
      })
    );

    if (!jobs.length) {
      return res.status(400).json({ success: false, student, message: "No Jobs Found" });
    }

    // Build list of jobs with eligibility info
    const jobsWithEligibility = jobs.map((job: any) => {
      const reasons: string[] = [];

      if (studentInfo.no_of_dead_backlogs > job.max_no_dead_kt) {
        reasons.push(`Too many dead KTs (allowed: ${job.max_no_dead_kt})`);
      }

      if (studentInfo.no_of_live_backlogs > job.max_no_live_kt) {
        reasons.push(`Too many live KTs (allowed: ${job.max_no_live_kt})`);
      }

      if (averageCGPI < job.min_CGPI) {
        reasons.push(`CGPI too low (required: ${job.min_CGPI})`);
      }

      if (!job.branch_allowed.includes(student?.stud_department?.dept_name)) {
        reasons.push(`Branch not allowed`);
      }

      const isEligible = reasons.length === 0;

      return {
        ...job.toObject(),
        company_name: job.company_name?.comp_name ?? "Unknown",
        isEligible,
        ineligibilityReasons: isEligible ? [] : reasons,
      };
    });

    return res.status(200).json({
      success: true,
      student,
      jobs: jobsWithEligibility,
    });

  } catch (error: any) {
    console.error("Error in getJobForCollege:", error.message);
    return res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
};


export const getJobDetailsById = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const user = req.user;
    const { id } = req.params;

    // Find the job by ID
    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ success: false, msg: "Job not found" });
    }
    // console.log("Job", job);

    // Find the student using their Google ID
    const student = await Student.findOne({ googleId: user.uid }).populate(
      "stud_department"
    );
    if (!student) {
      return res.status(404).json({ success: false, msg: "Student not found" });
    }

    // Find student info using student ID
    const studentInfo = await StudentInfo.findOne({
      _id: student.stud_info_id,
    });
    if (!studentInfo) {
      return res
        .status(404)
        .json({ success: false, msg: "Student info not found" });
    }

    // Calculate the average CGPI
    const grades = [
      studentInfo.stud_sem1_grade,
      studentInfo.stud_sem2_grade,
      studentInfo.stud_sem3_grade,
      studentInfo.stud_sem4_grade,
      studentInfo.stud_sem5_grade,
      studentInfo.stud_sem6_grade,
      studentInfo.stud_sem7_grade,
      studentInfo.stud_sem8_grade,
    ];

    // Print grades for debugging
    // console.log("Grades:", grades);

    // Calculate total grades and valid semesters
    let validSemesters = 0;
    const totalGrades = grades.reduce((sum, grade) => {
      if (grade !== "" && !isNaN(Number(grade))) {
        return sum + Number(grade);
      }
      return sum;
    }, 0);
    // Count valid semesters (where the grade is not an empty string and can be converted to a number)
    validSemesters = grades.filter(
      (grade) => grade !== "" && grade !== null && !isNaN(Number(grade))
    ).length;
    // console.log("totalGrades", totalGrades);
    // console.log("validSemesters", validSemesters);

    // Calculate average CGPI, avoiding division by zero
    const averageCGPI = validSemesters > 0 ? totalGrades / validSemesters : 0;
    // console.log("averageCGPI", averageCGPI);

    // Determine eligibility for the specific job
    const isEligible =
      studentInfo.no_of_dead_backlogs <= job.max_no_dead_kt &&
      studentInfo.no_of_live_backlogs <= job.max_no_live_kt &&
      averageCGPI >= job.min_CGPI &&
      //@ts-ignore
      job.branch_allowed.includes(student?.stud_department?.dept_name);

    // console.log("isEligible", isEligible);

    // Return the job details along with eligibility status
    return res
      .status(200)
      .json({ success: true, job: { ...job.toObject(), isEligible } });
  } catch (error: any) {
    console.error("Error in getJobDetailsById", error.message);
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server Error" });
  }
};

export const authStudent = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const user = req.user;
    const student = await Student.findOne({ googleId: user.uid });

    if (!student) {
      return res.status(404).json({ success: false, msg: "Student not found" });
    }

    return res.status(200).json({ success: true, student });
  } catch (error: any) {
    console.log("Error in authStudent", error.message);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const applyToJob = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const user = req.user as any; // Explicitly type 'req.user'
    const student = await Student.findOne({ googleId: user.uid });

    // Destructure job details from the request body
    const { app_job_id, app_status } = req.body;

    const application = await Application.findOne({
      // @ts-ignore
      student: student._id,
      app_job_id,
    });

    if (application) {
      return res.status(400).json({
        success: false,
        msg: "You have already applied to this job",
      });
    }
    // Validate required fields
    if (!app_job_id) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    // Ensure that the student exists
    if (!student) {
      return res.status(404).json({ success: false, msg: "Student not found" });
    }

    // Ensure that the job exists
    const job = await Job.findOne({ _id: app_job_id });
    if (!job) {
      return res.status(404).json({ success: false, msg: "Job not found" });
    }

    // Handle file upload (check if the file exists and isn't empty)
    let uploadedCoverLetter;
    if (req.file) {
      // Upload cover letter to Google Drive
      uploadedCoverLetter = await uploadToGoogleDrive(req.file.path);
    }

    // Create and save a new job application
    const newApplication = new Application({
      app_cover_letter: uploadedCoverLetter || "", // Use empty string if no file uploaded
      app_job_id,
      student: student._id,
      app_status,
    });

    const savedApplication = await newApplication.save();
    console.log(
      "Application Submitted Successfully for job applicationId:",
      savedApplication.id + " by studentId:",
      student.id + " for jobId:",
      job.id
    );

    // Return success response
    return res.status(200).json({
      success: true,
      application: savedApplication,
      message: "Application Submitted Successfully",
    });
  } catch (error: any) {
    console.error("Error in applyToJob", error.message);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const getStudentsJobStatistics = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const user = req.user;
    const student = await Student.findOne({ googleId: user.uid }).populate(
      "stud_info_id stud_department"
    );

    // console.log("Student", student);

    if (!student) {
      return res.status(404).json({ success: false, msg: "Student not found" });
    }

    const appliedJobs = await Application.find({ student: student._id });
    const studentInfo = {
      //@ts-ignore
      no_of_dead_backlogs: student.stud_info_id.no_of_dead_backlogs,
      //@ts-ignore
      no_of_live_backlogs: student.stud_info_id.no_of_live_backlogs,
      //@ts-ignore
      // averageCGPI: student.stud_info_id.averageCGPI,
      stud_department: student.stud_department,
      stud_year: student.stud_year, // if needed for additional checks
    };

    // Assuming jobs is retrieved from the database
    const jobs = await Job.find(); // Fetch all jobs

    let eligibleCount = 0;
    let notEligibleCount = 0;

    jobs.forEach((job: IJob) => {
      const isEligible =
        studentInfo.no_of_dead_backlogs <= job.max_no_dead_kt &&
        studentInfo.no_of_live_backlogs <= job.max_no_live_kt &&
        // studentInfo.averageCGPI >= job.min_CGPI && // Use average CGPI
        //@ts-ignore
        job.branch_allowed.includes(studentInfo?.stud_department?.dept_name);
      // Add branch allowed or passing year check if needed

      if (isEligible) {
        eligibleCount++;
      } else {
        notEligibleCount++;
      }
    });

    return res.status(200).json({
      success: true,
      eligibleCount,
      notEligibleCount,
      appliedJobs: appliedJobs.length, // Additional info if needed
    });
  } catch (error: any) {
    console.log("Error in getStudentsJobStatistics", error.message);
    return res.status(500).json({ success: false, msg: "Server Error" });
  }
};

export const getJobAppliedByStudent = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const user = req.user;
    const student = await Student.findOne({ googleId: user.uid });

    if (!student) {
      return res.status(404).json({ success: false, msg: "Student not found" });
    }

    const appliedJobs = await Application.find({
      student: student._id,
    }).populate("app_job_id");

    if (appliedJobs.length === 0) {
      return res.status(200).json({ success: true, appliedJobs: [] });
    }

    return res.status(200).json({ success: true, appliedJobs });
  } catch (error: any) {
    console.log("Error in getJobAppliedByStudent", error.message);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const getRecommededJobs = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const user = req.user;

    // Find the student based on the Google ID from the request
    const student = await Student.findOne({ googleId: user.uid });

    if (!student) {
      return res.status(404).json({ success: false, msg: "Student not found" });
    }

    // Find jobs that are allowed for the student's department
    const jobs = await Job.find({
      branch_allowed: { $in: [student.stud_department] }, // Check if student's department is in branch_allowed array
    });

    // If no jobs are found, return a 404 response
    if (!jobs.length) {
      return res
        .status(404)
        .json({ success: false, msg: "No recommended jobs found" });
    }

    // Find applications that match the student ID and job IDs
    const appliedJobs = await Application.find({
      student: student._id,
      app_job_id: { $in: jobs.map((job: any) => job._id) }, // Check for job IDs in the jobs found
    });

    // Extract applied job IDs
    const appliedJobIds = appliedJobs.map((application: any) =>
      application.app_job_id.toString()
    );

    // Filter out jobs that the student has already applied for
    const recommendedJobs = jobs.filter(
      (job: any) => !appliedJobIds.includes(job._id.toString())
    );

    return res.status(200).json({ success: true, jobs: recommendedJobs });
  } catch (error: any) {
    console.log("Error in getRecommededJobs", error.message);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const getJobAppliedDetailsById = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const user = req.user;
    const { id } = req.params;
    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({ success: false, msg: "Job not found" });
    }
    return res.status(200).json({ success: true, job });
  } catch (error: any) {
    console.log("Error in getJobDetailsById", error.message);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};
