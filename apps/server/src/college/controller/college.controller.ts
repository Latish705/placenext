import { Request, Response } from "express";
import College from "../models/college";
import Student from "../../student/models/student";
import StudentInfo from "../../student/models/info_student";
import Job from "../../company/models/job";
import Application from "../../student/models/application";

export const isFirstSignIn = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const user = req.user;

    const student = await College.findOne({
      $or: [{ googleId: user.uid }, { email: user.email }],
    });

    return res.status(200).json({ success: true, isFirstSignIn: !student });
  } catch (error: any) {
    console.log("Error in isFirstSignIn", error.message);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
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

export const applicationFrom = async (req: Request, res: Response) => {
  try {
    const {
      collegeName,
      collegeWebsite,
      collegeNoOfStudents,
      collegeLocation,
      collegeContactNo,
      collegeNoOfEmployees,
      collegeAddress,
      collegeAffiliation,
      collegeCoursesOffered,
      collegeDepartment,
    } = req.body;

    // @ts-ignore
    const user = req.user;

    const existingUser = await College.findOne({ email: user.email });

    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, msg: "User already exists" });
    }

    const college = new College({
      googleId: user.uid,
      email: user.email,
      coll_name: collegeName,
      coll_website: collegeWebsite,
      coll_no_of_stud: collegeNoOfStudents,
      coll_location: collegeLocation,
      colLcontact_no: collegeContactNo,
      coll_no_employs: collegeNoOfEmployees,
      coll_address: collegeAddress,
      coll_affiliated_to: collegeAffiliation,
      coll_courses_offered: collegeCoursesOffered,
      coll_departments: collegeDepartment,
    });

    await college.save();

    return res.status(200).json({ success: true, college });
  } catch (error: any) {
    console.log("Error in applicationForm", error.message);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const getAllStudentList = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const user = req.user;
    console.log("User UID:", user.uid);

    // Find college by Google ID
    const college = await College.find({ googleId: user.uid });
    if (!college.length) {
      return res.status(404).json({ success: false, msg: "College not found" });
    }

    console.log("College ID:", college[0]._id.toString());

    const students = await Student.find({
      stud_college_id: college[0]._id.toString(),
    });
    if (!students.length) {
      return res.status(404).json({ success: false, msg: "No students found" });
    }

    const placementStatus = await Promise.all(
      students.map(async (student) => {
        const studentInfo = await StudentInfo.findById(student.stud_info_id);
        console.log("Student Info:", studentInfo);

        return studentInfo ? studentInfo.stud_placement_status : null;
      })
    );

    console.log("Students:", students);

    return res.status(200).json({ success: true, students, placementStatus });
  } catch (error: any) {
    console.error("Error in getAllStudentList:", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const getStudentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const student = await Student.findById(id).populate("stud_info_id");
    return res.status(200).json({ success: true, student });
  } catch (error: any) {
    console.log("Error in getStudentById", error.message);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const verifyStudent = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const user = req.user;
    const { studentId } = req.params;

    // Find college by Google ID
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, msg: "Student not found" });
    }
    if (!student.isSystemVerified) {
      return res
        .status(400)
        .json({ success: false, msg: "Student not verified by system" });
    }
    if (student.isCollegeVerified) {
      return res
        .status(400)
        .json({ success: false, msg: "Student already verified" });
    }
    student.isCollegeVerified = true;
    await student.save();
    console.log("Student Verified with Id:", student.id);
    return res.status(200).json({ success: true, student });
  } catch (error: any) {
    console.log("Error in verifyStudents", error.message);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const acceptStudent = async (req: Request, res: Response) => {
  try {
    const { student_Id } = req.body;
    console.log("Student ID:", student_Id);

    const student = await Student.findById(student_Id);
    if (!student) {
      return res.status(404).json({ success: false, msg: "Student not found" });
    }
    if (!student.isSystemVerified) {
      return res
        .status(400)
        .json({ success: false, msg: "Student not verified by system" });
    }
    if (student.isCollegeVerified) {
      return res
        .status(400)
        .json({ success: false, msg: "Student already verified" });
    }
    student.isCollegeVerified = true;
    await student.save();
    console.log("Student Verified with Id:", student.id);
    return res.status(200).json({ success: true, student });
  } catch (error: any) {
    console.log("Error in acceptStudent", error.message);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const rejectStudent = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.body;
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, msg: "Student not found" });
    }
    if (!student.isSystemVerified) {
      return res
        .status(400)
        .json({ success: false, msg: "Student not verified by system" });
    }
    if (student.isCollegeVerified) {
      return res
        .status(400)
        .json({ success: false, msg: "Student already verified" });
    }
    student.isCollegeVerified = false;
    await student.save();
    console.log("Student Rejected with Id:", student.id);
    return res.status(200).json({ success: true, student });
  } catch (error: any) {
    console.log("Error in rejectStudent", error.message);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const getStudentStatistics = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const user = req.user;

    // Find college by Google ID
    const college = await College.findOne({ googleId: user.uid });
    if (!college) {
      return res.status(404).json({ success: false, msg: "College not found" });
    }

    // Find all students associated with the college
    const students = await Student.find({
      stud_college_id: college._id.toString(),
    });
    if (!students.length) {
      return res.status(404).json({ success: false, msg: "No students found" });
    }

    // Fetch student information and placement statuses
    const placementData = await Promise.all(
      students.map(async (student) => {
        const studentInfo = await StudentInfo.findById(student.stud_info_id);
        return studentInfo ? studentInfo : null; // Return null if not found
      })
    );

    // Calculate statistics
    const totalStudents = students.length;
    const totalPlaced = placementData.filter(
      (info) => info && info.stud_placement_status
    ).length;
    const totalNotPlaced = totalStudents - totalPlaced;

    const studentsByDepartment = placementData.reduce(
      (acc, info) => {
        if (info) {
          const dept = students.find((s) =>
            s.stud_info_id.equals(info._id)
          )?.stud_department;
          if (dept) {
            acc[dept] = (acc[dept] || 0) + 1;
          }
        }
        return acc;
      },
      {} as { [key: string]: number }
    );

    // Calculate average package if students are placed
    const totalPackage = placementData.reduce((sum, info) => {
      return (
        sum +
        (info?.stud_placement_status ? info.stud_placement_package || 0 : 0)
      );
    }, 0);
    const averagePackage = totalPlaced > 0 ? totalPackage / totalPlaced : 0;

    return res.status(200).json({
      success: true,
      totalStudents,
      totalPlaced,
      totalNotPlaced,
      averagePackage,
      studentsByDepartment,
      placementData, // Optional: Include all placement data if needed
    });
  } catch (error: any) {
    console.error("Error in getStudentStatistics:", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const getCollegeJobs = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const user = req.user;
    console.log(user);

    // Find college by Google ID
    const college = await College.findOne({ googleId: user.uid });
    if (!college) {
      return res.status(404).json({ success: false, msg: "College not found" });
    }
    console.log(college);

    // Find all jobs associated with the college
    const jobs = await Job.find({
      job_college_id: college._id.toString(),
    });
    if (!jobs.length) {
      return res.status(404).json({ success: false, msg: "No jobs found" });
    }

    return res.status(200).json({ success: true, jobs });
  } catch (error: any) {
    console.error("Error in getCollegeJobs:", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const createJobByCollege = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const LogincollegeUser = req.user;
    const {
      job_title,
      job_type,
      job_location,
      job_salary,
      job_description,
      job_requirements,
      job_posted_date,
      yr_of_exp_req,
      job_timing,
      status,
      min_CGPI,
      max_no_dead_kt,
      max_no_live_kt,
      branch_allowed,
      passing_year,
      company_name,
    } = req.body;

    console.log(req.body); // Debugging output

    // Check for required fields, including company_name
    if (
      [
        job_title,
        job_type,
        job_location,
        job_salary,
        job_description,
        job_requirements,
        job_posted_date,
        yr_of_exp_req,
        min_CGPI,
        max_no_dead_kt,
        max_no_live_kt,
        branch_allowed,
        passing_year,
        job_timing,
        status,
        company_name, // Ensure company_name is checked
      ].some((field) => field === "" || field === undefined) // Check for empty or undefined fields
    ) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    // Check for existing job
    const existingJob = await Job.findOne({ job_title, job_location });

    if (existingJob) {
      return res.status(400).json({ msg: "Job already exists" });
    }

    // Find the college based on the logged-in user
    const foundCollege = await College.findOne({
      googleId: LogincollegeUser.uid,
    });

    if (!foundCollege) {
      return res.status(400).json({ msg: "College not found" });
    }

    // Create new job
    const newJob = new Job({
      job_title,
      job_type,
      job_location,
      company_name,
      job_salary,
      job_description,
      job_requirements,
      job_posted_date,
      yr_of_exp_req,
      min_CGPI,
      max_no_dead_kt,
      max_no_live_kt,
      branch_allowed,
      passing_year,
      job_timing,
      status,
      college: foundCollege._id, // Link to college
    });

    await newJob.save();
    return res.status(200).json({ success: true, msg: "Job created" });
  } catch (error: any) {
    console.log("Error in createJobByCompany", error.message);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// export const getCollegeJobById = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const job = await Job.findById(id);
//     if (!job) {
//       return res.status(404).json({ success: false, msg: "Job not found" });
//     }
//     return res.status(200).json({ success: true, job });
//   } catch (error: any) {
//     console.log("Error in getCollegeJobById", error.message);
//     return res.status(500).json({ msg: "Internal Server Error" });
//   }
// };

export const collegeAuth = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const user = req.user;
    const student = await College.findOne({ googleId: user.uid });

    if (!student) {
      return res.status(404).json({ success: false, msg: "Student not found" });
    }

    return res.status(200).json({ success: true, student });
  } catch (error: any) {
    console.log("Error in authStudent", error.message);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const getCollegeJob = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const user = req.user;
    const college = await College.findOne({ googleId: user.uid });
    if (!college) {
      return res.status(404).json({ success: false, msg: "College not found" });
    }

    const jobs = await Job.find({ college: college._id });
    return res.status(200).json({ success: true, jobs });
  } catch (error: any) {
    console.log("Error in getCollegeJob", error.message);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const getJobDetailsById = async (req: Request, res: Response) => {
  try {
    // here we have to return two things one is job details and other is student details who applied for that job
    const { id } = req.params;
    console.log("Job ID:", id);

    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ success: false, msg: "Job not found" });
    }

    const jobApplicants = await Application.find({ app_job_id: id }).populate(
      "student"
    );

    return res.status(200).json({ success: true, job, jobApplicants });
  } catch (error: any) {
    console.log("Error in getJobDetailsById", error.message);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};
