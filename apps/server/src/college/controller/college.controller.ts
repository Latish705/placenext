import { Request, Response } from "express";
import College from "../models/college";
import Student from "../../student/models/student";
import StudentInfo from "../../student/models/info_student";

export const isFirstSignIn = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const user = req.user;

    // Try finding the student by Google ID or email
    const student = await College.findOne({
      $or: [{ googleId: user.uid }, { email: user.email }],
    });

    // Return success and the isFirstSignIn status
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

    // Check if user already exists
    const existingUser = await College.findOne({ email: user.email });

    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, msg: "User already exists" });
    }

    // Create a new college
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

    // Save the college
    await college.save();

    // Return success
    return res.status(200).json({ success: true, college });
  } catch (error: any) {
    console.log("Error in applicationForm", error.message);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// export const getAllColeges = async (req: Request, res: Response) => {
//   try {
//     const colleges = await College.find();
//     return res.status(200).json({ success: true, colleges });
//   } catch (error: any) {
//     console.log("Error in getAllColeges", error.message);
//     return res.status(500).json({ msg: "Internal Server Error" });
//   }
// };

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

    // Find all students associated with the college
    const students = await Student.find({
      stud_college_id: college[0]._id.toString(),
    });
    if (!students.length) {
      return res.status(404).json({ success: false, msg: "No students found" });
    }

    // Fetch placement statuses
    const placementStatus = await Promise.all(
      students.map(async (student) => {
        const studentInfo = await StudentInfo.findById(student.stud_info_id);
        console.log("Student Info:", studentInfo);

        return studentInfo ? studentInfo.stud_placement_status : null; // Handle case where studentInfo is not found
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
