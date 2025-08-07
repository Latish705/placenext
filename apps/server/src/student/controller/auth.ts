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
import { redis } from "../..";
const requiredFields = [
  "firstName",
  "middleName",
  "lastName",
  "email",
  "phoneNumber",
  "dateOfBirth",
  "courseType",
  "departmentName",
  "address",
  "college",
  "admissionYear",
  "tenthPercentage",
  "sscBoard",
  "alternateEmail",
  "alternatePhoneNo",
  "aadharNumber",
  "panNumber",
  "liveBacklogs",
  "deadBacklogs",
  // "placementStatus",
  "skills",
  "linkedInLink",
  "githubLink",
];

const uploadMarksheet = async (file: any, label: string) => {
  if (file && Array.isArray(file) && file.length > 0) {
    const filePath = file[0].path;
    return await uploadToGoogleDrive(filePath);
  }
  return null;
};

const validateFields = (fields: any) => {
  return requiredFields.some((field) => !fields[field]);
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
    console.log("req body:-", req.body);
    // @ts-ignore
    const user = req.user;
    const fields = req.body;

    if (validateFields(fields)) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const existingUser = await Student.findOne({ stud_email: fields.email });
    if (existingUser) {
      return res.status(400).json({ success: false, msg: "User already exists" });
    }

    const marksheetPromises = [
      //@ts-ignore
      uploadMarksheet(req.files?.sem1Marksheet, "sem1Marksheet"),
      //@ts-ignore
      uploadMarksheet(req.files?.sem2Marksheet, "sem2Marksheet"),
      //@ts-ignore
      uploadMarksheet(req.files?.sem3Marksheet, "sem3Marksheet"),
      //@ts-ignore
      uploadMarksheet(req.files?.sem4Marksheet, "sem4Marksheet"),
      //@ts-ignore
      uploadMarksheet(req.files?.sem5Marksheet, "sem5Marksheet"),
      //@ts-ignore
      uploadMarksheet(req.files?.sem6Marksheet, "sem6Marksheet"),
      //@ts-ignore
      uploadMarksheet(req.files?.sem7Marksheet, "sem7Marksheet"),
      //@ts-ignore
      uploadMarksheet(req.files?.sem8Marksheet, "sem8Marksheet"),
      //@ts-ignore
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
      stud_hsc: fields.twelfthPercentage,
      stud_hsc_board: fields.hscBoard,
      stud_ssc: fields.tenthPercentage,
      stud_ssc_board: fields.sscBoard,
      stud_resume: resume,
      stud_prn: fields.prn,
      stud_alternate_email: fields.alternateEmail,
      stud_alternate_phone: fields.alternatePhoneNo,
      stud_aadhar: fields.aadharNumber,
      stud_pan: fields.panNumber,
      no_of_live_backlogs: fields.liveBacklogs,
      no_of_dead_backlogs: fields.deadBacklogs,
      // stud_placement_status: fields.placementStatus, // this is remaining
      // stud_placement_package: fields.placementPackage, // this is remaining
      // stud_placement_company: fields.placementCompany, // this is remaining
      // stud_placement_date: fields.placementDate, // this is remaining
      // student_skills: fields.skills, // this is remaining
      stud_linkedIn: fields.linkedInLink, // this is remaining
      stud_github: fields.githubLink, // this is remaining
    });

    const savedStudentInfo = await studentInfo.save();

    const student = new Student({
      stud_name: `${fields.firstName} ${fields.middleName} ${fields.lastName}`,
      stud_email: fields.email,
      stud_address: fields.address,
      stud_phone: fields.phoneNumber,
      stud_dob: fields.dateOfBirth,
      stud_course: fields.courseType,
      stud_department: fields.departmentName,
      stud_college_id: fields.college,
      googleId: user.uid,
      stud_info_id: savedStudentInfo._id,
    });

    const savedStudent = await student.save();
    console.log("Application From Submitted Successfully by Student", savedStudent.id);

    const doc_res = await axios.post(`${Document_server_url}/verify_user`, {
      userId: savedStudent.id,
    });

    if (doc_res.data.success) {
      console.log("User added for verification successfully");
    }

    return res.status(200).json({
      success: true,
      student: savedStudent,
      message: "Application Form Submitted Successfully",
    });
  } catch (error: any) {
    console.log("Error in applicationFrom", error.message);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const getAllCollegeList = async (req: Request, res: Response) => {
  try {
    const redisKey = `collegeList`;
    const cachedColleges = await redis.get(redisKey);

    if (cachedColleges) {
      return res.status(200).json({ success: true, colleges:cachedColleges});
    }

    const colleges = await College.find({}, "coll_name");
    const collegeList = colleges.map((college: any) => ({
      id: college._id,
      name: college.coll_name,
    }));

    await redis.set(redisKey, JSON.stringify(collegeList), { EX: 600 });

    return res.status(200).json({ success: true, colleges: collegeList });
  } catch (error: any) {
    console.error("Error in getAllCollegeList:", error.stack || error.message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getUserDetails = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const user = req.user;
    const redisKey = `studentDetails:${user.uid}`;
    const cachedStudent = await redis.get(redisKey);

    if (cachedStudent) {
      return res.status(200).json({ success: true, student: cachedStudent});
    }

    const student = await Student.findOne({ googleId: user.uid }).populate("stud_info_id stud_college_id");

    if (!student) {
      return res.status(404).json({ success: false, msg: "Student not found" });
    }

    await redis.set(redisKey, JSON.stringify(student), { EX: 600 });

    return res.status(200).json({ success: true, student });
  } catch (error: any) {
    console.log("Error in getUserDetails", error.message);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const updateUserDetails = async (req: Request, res: Response) => {
  // @ts-ignore
  const { userId } = req.user;
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
    let student = await Student.findOne({ _id: userId });

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    student.stud_name = firstName || student.stud_name;
    student.stud_phone = phoneNumber || student.stud_phone;
    student.stud_email = email || student.stud_email;
    student.stud_address = address || student.stud_address;
    student.stud_dob = dateOfBirth || student.stud_dob;
    student.stud_course = courseType || student.stud_course;
    student.stud_department = departmentName || student.stud_department;
    student.stud_year = admissionYear || student.stud_year;

    await student.save();

    // Clear related caches
    await redis.del(`studentDetails:${userId}`);

    return res.json({
      success: true,
      message: "Profile updated successfully",
      student,
    });
  } catch (error) {
    console.error("Error updating profile: ", error);
    return res.status(500).json({
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
    const redisKey = `studentStatistics:${user.uid}`;
    const cachedData = await redis.get(redisKey);

    if (cachedData) {
      return res.status(200).json({ success: true, ...cachedData });
    }

    const student = await Student.findOne({ googleId: user.uid }).populate("stud_info_id");

    if (!student) {
      return res.status(404).json({ success: false, msg: "Student not found" });
    }

    const appliedJobs = await Application.find({ student: student?._id });

    if (appliedJobs.length === 0) {
      const data = { success: true, student, appliedJobs: [] };
      await redis.set(redisKey, JSON.stringify(data), { EX: 600 });
      return res.status(200).json(data);
    }

    const companiesCameToCollege = await Job.find({ college: student.stud_college_id });

    const data = { success: true, appliedJobs, companiesCameToCollege };
    await redis.set(redisKey, JSON.stringify(data), { EX: 600 });

    return res.status(200).json(data);
  } catch (error: any) {
    console.log("Error in getStudentStatistics", error.message);
    return res.status(500).json({ success: false, msg: "Internal Server Error" });
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
    const redisKey = `jobDetails:${id}`;
    const cachedJobDetails = await redis.get(redisKey);

    if (cachedJobDetails) {
      return res.status(200).json({ success: true, ...cachedJobDetails });
    }

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({ success: false, msg: "Job not found" });
    }

    const student = await Student.findOne({ googleId: user.uid }).populate("stud_department");

    if (!student) {
      return res.status(404).json({ success: false, msg: "Student not found" });
    }

    const studentInfo = await StudentInfo.findOne({ _id: student.stud_info_id });

    if (!studentInfo) {
      return res.status(404).json({ success: false, msg: "Student info not found" });
    }

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

    const totalGrades = grades.reduce((sum, grade) => {
      return grade !== "" && !isNaN(Number(grade)) ? sum + Number(grade) : sum;
    }, 0);

    const validSemesters = grades.filter(grade => grade !== "" && grade !== null && !isNaN(Number(grade))).length;
    const averageCGPI = validSemesters > 0 ? totalGrades / validSemesters : 0;

    const isEligible =
      studentInfo.no_of_dead_backlogs <= job.max_no_dead_kt &&
      studentInfo.no_of_live_backlogs <= job.max_no_live_kt &&
      averageCGPI >= job.min_CGPI &&
      job.branch_allowed.includes(student?.stud_department?.dept_name);

    const data = { success: true, job: { ...job.toObject(), isEligible } };
    await redis.set(redisKey, JSON.stringify(data), { EX: 600 });

    return res.status(200).json(data);
  } catch (error: any) {
    console.error("Error in getJobDetailsById", error.message);
    return res.status(500).json({ success: false, msg: "Internal Server Error" });
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
    const user = req.user;
    const student = await Student.findOne({ googleId: user.uid });
    const { app_job_id, app_status } = req.body;

    const application = await Application.findOne({
      student: student._id,
      app_job_id,
    });

    if (application) {
      return res.status(400).json({
        success: false,
        msg: "You have already applied to this job",
      });
    }

    if (!app_job_id) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    if (!student) {
      return res.status(404).json({ success: false, msg: "Student not found" });
    }

    const job = await Job.findOne({ _id: app_job_id });

    if (!job) {
      return res.status(404).json({ success: false, msg: "Job not found" });
    }

    let uploadedCoverLetter;
    if (req.file) {
      uploadedCoverLetter = await uploadToGoogleDrive(req.file.path);
    }

    const newApplication = new Application({
      app_cover_letter: uploadedCoverLetter || "",
      app_job_id,
      student: student._id,
      app_status,
    });

    const savedApplication = await newApplication.save();
    console.log("Application Submitted Successfully for job applicationId:", savedApplication.id, "by studentId:", student.id, "for jobId:", job.id);

    // Clear related caches
    await redis.del(`studentStatistics:${user.uid}`);

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
    const redisKey = `studentsJobStatistics:${user.uid}`;
    const cachedData = await redis.get(redisKey);

    if (cachedData) {
      return res.status(200).json({ success: true, ...cachedData });
    }

    const student = await Student.findOne({ googleId: user.uid }).populate("stud_info_id stud_department");

    if (!student) {
      return res.status(404).json({ success: false, msg: "Student not found" });
    }

    const appliedJobs = await Application.find({ student: student._id });
    const studentInfo = {
      no_of_dead_backlogs: student.stud_info_id.no_of_dead_backlogs,
      no_of_live_backlogs: student.stud_info_id.no_of_live_backlogs,
      stud_department: student.stud_department,
      stud_year: student.stud_year,
    };

    const jobs = await Job.find();
    let eligibleCount = 0;
    let notEligibleCount = 0;

    jobs.forEach((job: IJob) => {
      const isEligible =
        studentInfo.no_of_dead_backlogs <= job.max_no_dead_kt &&
        studentInfo.no_of_live_backlogs <= job.max_no_live_kt &&
        job.branch_allowed.includes(studentInfo?.stud_department?.dept_name);

      if (isEligible) {
        eligibleCount++;
      } else {
        notEligibleCount++;
      }
    });

    const data = { success: true, eligibleCount, notEligibleCount, appliedJobs: appliedJobs.length };
    await redis.set(redisKey, JSON.stringify(data), { EX: 600 });

    return res.status(200).json(data);
  } catch (error: any) {
    console.log("Error in getStudentsJobStatistics", error.message);
    return res.status(500).json({ success: false, msg: "Server Error" });
  }
};

export const getJobAppliedByStudent = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const user = req.user;
    const redisKey = `jobsAppliedByStudent:${user.uid}`;
    const cachedJobs = await redis.get(redisKey);

    if (cachedJobs) {
      return res.status(200).json({ success: true, appliedJobs: cachedJobs });
    }

    const student = await Student.findOne({ googleId: user.uid });

    if (!student) {
      return res.status(404).json({ success: false, msg: "Student not found" });
    }

    const appliedJobs = await Application.find({ student: student._id }).populate("app_job_id");

    if (appliedJobs.length === 0) {
      const data = { success: true, appliedJobs: [] };
      await redis.set(redisKey, JSON.stringify(data), { EX: 600 });
      return res.status(200).json(data);
    }

    const data = { success: true, appliedJobs };
    await redis.set(redisKey, JSON.stringify(data), { EX: 600 });

    return res.status(200).json(data);
  } catch (error: any) {
    console.log("Error in getJobAppliedByStudent", error.message);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const getRecommendedJobs = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const user = req.user;
    const redisKey = `recommendedJobs:${user.uid}`;
    const cachedJobs = await redis.get(redisKey);

    if (cachedJobs) {
      return res.status(200).json({ success: true, jobs: cachedJobs });
    }

    const student = await Student.findOne({ googleId: user.uid });

    if (!student) {
      return res.status(404).json({ success: false, msg: "Student not found" });
    }

    const jobs = await Job.find({ branch_allowed: { $in: [student.stud_department] } });

    if (!jobs.length) {
      return res.status(404).json({ success: false, msg: "No recommended jobs found" });
    }

    const appliedJobs = await Application.find({
      student: student._id,
      app_job_id: { $in: jobs.map((job: any) => job._id) },
    });

    const appliedJobIds = appliedJobs.map((application: any) => application.app_job_id.toString());
    const recommendedJobs = jobs.filter((job: any) => !appliedJobIds.includes(job._id.toString()));

    const data = { success: true, jobs: recommendedJobs };
    await redis.set(redisKey, JSON.stringify(data), { EX: 600 });

    return res.status(200).json(data);
  } catch (error: any) {
    console.log("Error in getRecommendedJobs", error.message);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const getJobAppliedDetailsById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const redisKey = `jobAppliedDetails:${id}`;
    const cachedJob = await redis.get(redisKey);

    if (cachedJob) {
      return res.status(200).json({ success: true, job: cachedJob});
    }

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({ success: false, msg: "Job not found" });
    }

    const data = { success: true, job };
    await redis.set(redisKey, JSON.stringify(data), { EX: 600 });

    return res.status(200).json(data);
  } catch (error: any) {
    console.log("Error in getJobDetailsById", error.message);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};
