import { Request, Response } from "express";
import Student, { IStudent } from "../../student/models/student";
import Faculty from "../models/faculty";
import Department from "../models/department";
import College from "../models/college";
import { parse } from "dotenv";
import Offer from "../../company/models/offer";
import { redis } from "../..";

export const getAllStudents = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const user = req.user;
    const redisKey = `allStudents:${user.uid}`;
    const cachedStudents = await redis.get(redisKey);

    if (cachedStudents) {
      return res.status(200).json({
        success: true,
        students: cachedStudents,
        msg: "Students fetched successfully from cache",
      });
    }

    const facultyColl = await Faculty.find({ googleId: user.uid }).select("faculty_college_id -_id");
    // @ts-ignore
    const collegeId = facultyColl[0].faculty_college_id;
    const allStudents = await Student.find({ stud_college_id: collegeId });

    if (!allStudents.length) {
      return res.status(404).json({ success: false, msg: "No students found" });
    }

    await redis.set(redisKey, JSON.stringify(allStudents), { EX: 600 });

    res.status(200).json({
      success: true,
      students: allStudents,
      msg: "Students fetched successfully",
    });
  } catch (error: any) {
    console.log("Error in getAllStudents", error.message);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const getDepartmentEligibleStudents = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const user = req.user;
    const { departmentId } = req.body;
    if (!departmentId) {
      return res.status(400).json({ success: false, msg: "Department ID is required" });
    }

    const redisKey = `eligibleStudents:${user.uid}:${departmentId}`;
    const cachedStudents = await redis.get(redisKey);

    if (cachedStudents) {
      return res.status(200).json({
        success: true,
        students: cachedStudents,
        msg: "Eligible students fetched successfully from cache",
      });
    }

    const facultyColl = await Faculty.find({ googleId: user.uid }).select("faculty_college_id -_id");
    const collegeId = facultyColl[0]?.faculty_college_id;
    if (!collegeId) {
      return res.status(404).json({ success: false, msg: "Faculty's college ID not found" });
    }

    const students = await Student.find({
      stud_college_id: collegeId,
      stud_department: departmentId,
    });

    const filteredStudents = (
      await Promise.all(
        students.map(async (student: any) => {
          const studentInfo = await Student.findById(student._id).populate("stud_info_id");
          const { no_of_live_backlogs, no_of_dead_backlogs, stud_placement_status } = studentInfo.stud_info_id;
          if (
            no_of_live_backlogs === 0 &&
            no_of_dead_backlogs === 0 &&
            stud_placement_status === false
          ) {
            return student;
          }
          return null;
        })
      )
    ).filter(Boolean);

    if (!filteredStudents.length) {
      return res.status(404).json({
        success: false,
        msg: "No eligible students found in this department",
      });
    }

    await redis.set(redisKey, JSON.stringify(filteredStudents), { EX: 600 });

    res.status(200).json({
      success: true,
      students: filteredStudents,
      msg: "Department eligible students fetched successfully",
    });
  } catch (error: any) {
    console.log("Error in getDepartmentEligibleStudents", error.message);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const getDepartmentWiseEligibleStudents = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const user = req.user;
    const year = req.query.year ? parseInt(req.query.year as string, 10) : 2026;
    const department = req.query.department as string | undefined;
    const placed = req.query.placed !== undefined ? req.query.placed === "true" : false;
    const cgpi = req.query.cgpi ? parseFloat(req.query.cgpi as string) : 0.0;

    const redisKey = `departmentWiseEligibleStudents:${user.uid}:${year}:${department}:${placed}:${cgpi}`;
    const cachedStudents = await redis.get(redisKey);

    if (cachedStudents) {
      return res.status(200).json({
        success: true,
        data: cachedStudents,
        msg: "Filtered students fetched successfully from cache",
      });
    }

    const faculty = await Faculty.findOne({ googleId: user.uid }).select("faculty_college_id -_id");
    const collegeId = faculty?.faculty_college_id;

    if (!collegeId) {
      return res.status(404).json({ success: false, msg: "Faculty's college ID not found" });
    }

    const dept = department ? await Department.findOne({ dept_name: department }) : null;

    if (department && !dept) {
      return res.status(404).json({ success: false, msg: "Department not found" });
    }

    const students = await Student.find({ stud_department: dept?._id }).populate("stud_info_id");

    if (!students || students.length === 0) {
      return res.status(404).json({ success: false, msg: "No students found for the given filters" });
    }

    const filteredStudents = students.filter((student: any) => {
      const studentInfo = student.stud_info_id;
      if (!studentInfo || !student.stud_department || typeof studentInfo.stud_aggregate !== "number") {
        return false;
      }
      const matchesCGPI = studentInfo.stud_aggregate >= cgpi;
      const matchesDept = !dept || student.stud_department.toString() === dept._id.toString();
      const matchesPlacement = typeof placed === "boolean" ? studentInfo.stud_placement_status === placed : true;
      return matchesCGPI && matchesDept && matchesPlacement;
    });

    await redis.set(redisKey, JSON.stringify(filteredStudents), { EX: 600 });

    res.status(200).json({
      success: true,
      msg: "Filtered students for dashboard",
      data: filteredStudents,
    });
  } catch (error: any) {
    console.error("Error in getDepartmentWiseEligibleStudents:", error.message);
    res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
};

export const getDepartmentWisePlacementStatus = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const user = req.user;
    const redisKey = `departmentWisePlacementStatus:${user.uid}`;
    const cachedData = await redis.get(redisKey);

    if (cachedData) {
      return res.status(200).json({
        success: true,
        data: cachedData,
        msg: "Department-wise placement data fetched successfully from cache",
      });
    }

    const facultyColl = await Faculty.find({ googleId: user.uid }).select("faculty_college_id -_id");
    const collegeId = facultyColl[0]?.faculty_college_id;

    if (!collegeId) {
      return res.status(404).json({ success: false, msg: "Faculty's college ID not found" });
    }

    const departments = await Department.find({ department_college_id: collegeId });
    const result = {};

    for (const dept of departments) {
      const students = await Student.find({
        stud_college_id: collegeId,
        stud_department: dept._id
      });

      const placed = [];
      const unplaced = [];

      for (const student of students) {
        const fullStudent = await Student.findById(student._id).populate("stud_info_id");
        const { stud_placement_status } = fullStudent.stud_info_id;

        if (stud_placement_status === true) {
          placed.push(student);
        } else {
          unplaced.push(student);
        }
      }

      const result: {
  [key: string]: {
    placed: typeof students;
    unplaced: typeof students;
  };
} = {};

    }

    await redis.set(redisKey, JSON.stringify(result), { EX: 600 });

    res.status(200).json({
      success: true,
      msg: "Department-wise placement data fetched successfully",
      data: result
    });
  } catch (error: any) {
    console.error("Error in getDepartmentWisePlacementStatus:", error.message);
    res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
};

export const markAsPlaced = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const user = req.user;
    const { studentId, company, year } = req.body;
    if (!studentId || !company || !year) {
      return res.status(400).json({ success: false, msg: "All fields are required" });
    }

    const facultyColl = await Faculty.find({ googleId: user.uid }).select("faculty_college_id -_id");
    const collegeId = facultyColl[0]?.faculty_college_id;

    if (!collegeId) {
      return res.status(404).json({ success: false, msg: "Faculty's college ID not found" });
    }

    const student = await Student.findById(studentId).populate("stud_info_id");

    if (!student) {
      return res.status(404).json({ success: false, msg: "Student not found" });
    }

    student.stud_info_id.stud_placement_status = true;
    student.stud_info_id.stud_placement_company = company;
    student.stud_info_id.stud_placement_year = year;
    await student.stud_info_id.save();

    // Clear related caches
    await redis.del(`allStudents:${user.uid}`);
    await redis.del(`departmentWisePlacementStatus:${user.uid}`);

    res.status(200).json({
      success: true,
      msg: "Student marked as placed successfully",
      data: student
    });
  } catch (error: any) {
    console.error("Error in markAsPlaced:", error.message);
    res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
};

export const totalNoOfOffers = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const user = req.user;
    const redisKey = `totalNoOfOffers:${user.uid}`;
    const cachedCount = await redis.get(redisKey);

    if (cachedCount) {
      return res.status(200).json({
        success: true,
        totalOffers: cachedCount,
        msg: "Total number of offers fetched successfully from cache",
      });
    }

    const faculty = await Faculty.findOne({ googleId: user.uid }).select("faculty_college_id");
    // console.log("Faculty fetched:", faculty);
    if (!faculty?.faculty_college_id) {
      return res.status(404).json({ success: false, msg: "Faculty's college ID not found" });
    }

    const collegeId = faculty.faculty_college_id;
    // console.log("College ID:", collegeId);
    // Step 1: Get all student IDs from the same college
    const students = await Student.find({ stud_college_id: collegeId }).select("_id");
    const studentIds = students.map((s: IStudent) => s._id);
    // console.log("Student IDs:", studentIds);

    // Step 2: Count offers linked to those students
    const totalOffers = await Offer.countDocuments({ studentId: { $in: studentIds } });
    // console.log("Total offers found:", totalOffers);
    res.status(200).json({
      success: true,
      totalOffers,
      msg: "Total number of offers fetched successfully"
    });
  } catch (error: any) {
    console.error("Error in totalNoOfOffers:", error.message);
    res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
};

export const studentsAcceptedUnder6LPA = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const user = req.user;
    const redisKey = `studentsAcceptedUnder6LPA:${user.uid}`;
    const cachedCount = await redis.get(redisKey);

    if (cachedCount) {
      return res.status(200).json({
        success: true,
        count: cachedCount,
        msg: "Students who accepted offers < 6 LPA fetched successfully from cache",
      });
    }

    const faculty = await Faculty.findOne({ googleId: user.uid }).select("faculty_college_id");
    // console.log("Faculty fetched:", faculty);
    if (!faculty?.faculty_college_id) {
      return res.status(404).json({ success: false, msg: "Faculty's college ID not found" });
    }

    const collegeId = faculty.faculty_college_id;
    // console.log("College ID:", collegeId);
    // Get students in the same college
    const students = await Student.find({ stud_college_id: collegeId }).select("_id");


    const studentIds: string[] = students.map((s: IStudent) => s._id);
    // console.log("Student IDs:", studentIds);
    const count = await Offer.countDocuments({
      studentId: { $in: studentIds },
      status: 'accepted',
      package: { $lt: 600000 }
    });
    // console.log("Count of students who accepted offers < 6 LPA:", count);

    res.status(200).json({
      success: true,
      count,
      msg: "Students who accepted offers < 6 LPA fetched successfully"
    });
  } catch (error: any) {
    console.error("Error in studentsAcceptedUnder6LPA:", error.message);
    res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
};

export const studentsAcceptedSecondOfferOver6LPA = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const user = req.user;
    // console.log("API triggered by user:", user.uid);

    const faculty = await Faculty.findOne({ googleId: user.uid }).select("faculty_college_id");
    // console.log("Faculty fetched:", faculty);
    if (!faculty?.faculty_college_id) {
      return res.status(404).json({ success: false, msg: "Faculty's college ID not found" });
    }

    const collegeId = faculty.faculty_college_id;
    const students = await Student.find({ stud_college_id: collegeId }).select("_id");
    const studentIds = students.map((s: IStudent) => s._id);
    const count = await Offer.countDocuments({
      studentId: { $in: studentIds },
      status: 'accepted',
      package: { $gte: 600000 },
      offerNumber: 2
    });
    // console.log("Count of students who accepted 2nd offer ≥ 6 LPA:", count);

    res.status(200).json({
      success: true,
      count,
      msg: "Students who accepted 2nd offer ≥ 6 LPA fetched successfully"
    });
  } catch (error: any) {
    console.error("Error in studentsAcceptedSecondOfferOver6LPA:", error.message);
    res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
};

export const getOffersAbove6LPA = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const user = req.user;
    // console.log("API triggered by user in getOffersAbove6LPA:", user.uid);

    const faculty = await Faculty.findOne({ googleId: user.uid }).select("faculty_college_id");
    // console.log("Faculty fetched:", faculty);
    if (!faculty?.faculty_college_id) {
      return res.status(404).json({ success: false, msg: "Faculty's college ID not found" });
    }

    const collegeId = faculty.faculty_college_id;
    // console.log("College ID:", collegeId);

    const students = await Student.find({ stud_college_id: collegeId }).select("_id");
    const studentIds = students.map((s: IStudent) => s._id);
    // console.log("Student IDs in getOffersAbove6LPA:", studentIds);

    const offers = await Offer.find({
      studentId: { $in: studentIds },
      package: { $gte: 600000 },
    }).populate('studentId jobId');
    // console.log("Offers fetched in getOffersAbove6LPA:", offers.length);

    res.status(200).json({
      success: true,
      offers,
      count: offers.length,
      msg: "Offers greater than or equal to 6 LPA fetched successfully",
    });
  } catch (error: any) {
    console.error("Error in getOffersAbove6LPA:", error.message);
    res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
};



//filter 8 *************************************************
export const getOffersBelow6lpa = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const user = req.user;
    // console.log("API triggered by user in getOffersBelow6LPA:", user.uid);

    const faculty = await Faculty.findOne({ googleId: user.uid }).select("faculty_college_id");
    // console.log("Faculty fetched:", faculty);
    if (!faculty?.faculty_college_id) {
      res.status(404).json({ success: false, msg: "Faculty's college ID not found" });
      return;
    }

    const collegeId = faculty.faculty_college_id;
    // console.log("College ID:", collegeId);

    const students = await Student.find({ stud_college_id: collegeId }).select("_id");
    const studentIds = students.map((s: IStudent) => s._id);
    // console.log("Student IDs in getOffersBelow6LPA:", studentIds);

    const offers = await Offer.find({
      studentId: { $in: studentIds },
      package: { $lt: 600000 },
    }).populate('studentId jobId');
    // console.log("Offers fetched in getOffersBelow6LPA:", offers.length);

    res.status(200).json({
      success: true,
      offers,
      count: offers.length,
      msg: "Offers less than 6 LPA fetched successfully",
    });

  } catch (error: any) {
    console.error("Error in getOffersBelow6LPA:", error.message);
    res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
};




