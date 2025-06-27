import { Request, Response } from "express";
import Student from "../../student/models/student";
import Faculty from "../models/faculty";
import Department from "../models/department";
import College from "../models/college";
import { parse } from "dotenv";
import Offer from "../../student/models/offers";

export const getAllStudents = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const user = req.user;
    const faculty_coll = await Faculty.find({ googleId: user.uid }).select(
      "faculty_college_id -_id"
    );
    //@ts-ignore
    const collegeId = faculty_coll[0].faculty_college_id;
    const allStudents = await Student.find({ stud_college_id: collegeId })

    if (!allStudents.length) {
      return res.status(404).json({ success: false, msg: "No students found" });
    }

    res.status(200).json({
      success: true,
      students: allStudents,
      msg: "Students fetched successfully",
    });
    return;

  } catch (error: any) {
    console.log("Error in getAllStudents", error.message);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};


// export const getEligibleStudents = async (req: Request, res: Response) => {
//   try {
//     // @ts-ignore
//     const user = req.user.uid || req.faculty; // Assuming the user object has a uid field
//     const faculty_coll = await Faculty.find({ googleId: user.uid })   
//     //@ts-ignore
//     const collegeId = faculty_coll[0].faculty_college_id;
//     const eligibleStudents = await Student.find({
//       stud_college_id: collegeId,
//       stud_eligible: true,
//     });




//     if (!eligibleStudents.length) {
//       return res.status(404).json({ success: false, msg: "No eligible students found" });
//     }

//     res.status(200).json({
//       success: true,
//       students: eligibleStudents,
//       msg: "Eligible students fetched successfully",
//     });
//     return;

//   } catch (error: any) {
//     console.log("Error in getEligibleStudents", error.message);
//     return res.status(500).json({ msg: "Internal Server Error" });
//   }
// } 

//filter 1
export const getDeparmentEligibleStudents = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const user = req.user;
    const { departmentId } = req.body;

    if (!departmentId) {
      return res.status(400).json({ success: false, msg: "Department ID is required" });
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
          const { no_of_live_backlogs, no_of_dead_backlogs, stud_placement_status } = studentInfo;

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
    ).filter(Boolean); // removes nulls

    if (!filteredStudents.length) {
      return res.status(404).json({
        success: false,
        msg: "No eligible students found in this department",
      });
    }

    res.status(200).json({
      success: true,
      students: filteredStudents,
      msg: " department Eligible students fetched successfully",
    });
    return;
  } catch (error: any) {
    console.log("Error in getDeparmentEligibleStudents", error.message);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};


export const getDepartmentWiseEligibleStudents = async (req: Request, res: Response) => {
  try {
    // @ts-ignore - user is injected by auth middleware
    const user = req.user;

    console.log("API triggered by user:", user.uid);

    const year = req.query.year ? parseInt(req.query.year as string, 10) : 2026;
    const department = req.query.department as string | undefined;
    const placed = req.query.placed !== undefined ? req.query.placed === "true" : false;
    const cgpi = req.query.cgpi ? parseFloat(req.query.cgpi as string) : 0.0;

    console.log("Query filters:", { year, department, placed, cgpi });

    const faculty = await Faculty.findOne({ googleId: user.uid }).select("faculty_college_id -_id");
    const collegeId = faculty?.faculty_college_id;

    if (!collegeId) {
      return res.status(404).json({ success: false, msg: "Faculty's college ID not found" });
    }

    const dept = department ? await Department.findOne({ dept_name: department }) : null;
    if (department && !dept) {
      return res.status(404).json({ success: false, msg: "Department not found" });
    }


    console.log("department fetched:", dept ? dept.dept_name : "All departments");

    // Fetch students based on filters
    const students = await Student.find({ stud_department: dept._id }).populate("stud_info_id");

    if (!students || students.length === 0) {
      return res.status(404).json({ success: false, msg: "No students found for the given filters" });
    }

    console.log(`Total students fetched: ${students.length}`);

    const filteredStudents = students.filter((student: any) => {
      const studentInfo = student.stud_info_id;

      // Validate required fields exist
      if (!studentInfo || !student.stud_department || typeof studentInfo.stud_aggregate !== "number") {
        return false;
      }

      const matchesCGPI = studentInfo.stud_aggregate >= cgpi;
      const matchesDept = !dept || student.stud_department.toString() === dept.id.toString();
      const matchesPlacement = typeof placed === "boolean" ? studentInfo.stud_placement_status === placed : true;

      return matchesCGPI && matchesDept && matchesPlacement;
    });


    console.log(`Students after CGPI filter: ${filteredStudents.length}`);

    console.log("Returning filtered students:", filteredStudents.map((s: any) => s.stud_name));

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


//filter 2*****************************************
export const getDepartmentWisePlacementStatus = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const user = req.user;

    const facultyColl = await Faculty.find({ googleId: user.uid }).select("faculty_college_id -_id");
    const collegeId = facultyColl[0]?.faculty_college_id;

    if (!collegeId) {
      return res.status(404).json({ success: false, msg: "Faculty's college ID not found" });
    }

    const departments = await Department.find({ department_college_id: collegeId });

    const result: {
      [departmentName: string]: {
        placed: any[],
        unplaced: any[]
      };
    } = {};

    for (const dept of departments) {
      const students = await Student.find({
        stud_college_id: collegeId,
        stud_department: dept._id
      });

      const placed: any[] = [];
      const unplaced: any[] = [];

      for (const student of students) {
        const fullStudent = await Student.findById(student._id).populate("stud_info_id");
        const { stud_placement_status } = fullStudent;

        if (stud_placement_status === true) {
          placed.push(student);
        } else {
          unplaced.push(student);
        }
      }

      result[dept.department_name] = {
        placed,
        unplaced
      };
    }

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



//filter 3 ******************************************
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
    // student.stud_info_id.stud_placement_package = placementPackage;
    student.stud_info_id.stud_placement_company = company;
    student.stud_info_id.stud_placement_year = year;

    await student.stud_info_id.save();

    res.status(200).json({
      success: true,
      msg: "Student marked as placed successfully",
      data: student
    });

  } catch (error: any) {
    console.error("Error in markAsPlaced:", error.message);
    res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
}


interface IStudent {
  _id: string | number;
}


//filter 4 ******************************************
// This function counts the total number of offers made to students

export const totalNoOfOffers = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const user = req.user;

    const faculty = await Faculty.findOne({ googleId: user.uid }).select("faculty_college_id");

    if (!faculty?.faculty_college_id) {
      return res.status(404).json({ success: false, msg: "Faculty's college ID not found" });
    }

    const collegeId = faculty.faculty_college_id;

    // Step 1: Get all student IDs from the same college
    const students = await Student.find({ collegeId }).select("_id");
    const studentIds = students.map((s: IStudent) => s._id);

    // Step 2: Count offers linked to those students
    const totalOffers = await Offer.countDocuments({ studentId: { $in: studentIds } });

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




//filter 5***********************************************
export const studentsAcceptedUnder6LPA = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const user = req.user;

    const faculty = await Faculty.findOne({ googleId: user.uid }).select("faculty_college_id");

    if (!faculty?.faculty_college_id) {
      return res.status(404).json({ success: false, msg: "Faculty's college ID not found" });
    }

    const collegeId = faculty.faculty_college_id;

    // Get students in the same college
    const students = await Student.find({ collegeId }).select("_id");


    const studentIds: string[] = students.map((s: IStudent) => s._id);

    const count = await Offer.countDocuments({
      studentId: { $in: studentIds },
      status: 'accepted',
      package: { $lt: 600000 }
    });

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



//filter 6 ******************************************
export const studentsAcceptedSecondOfferOver6LPA = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const user = req.user;

    const faculty = await Faculty.findOne({ googleId: user.uid }).select("faculty_college_id");

    if (!faculty?.faculty_college_id) {
      return res.status(404).json({ success: false, msg: "Faculty's college ID not found" });
    }

    const collegeId = faculty.faculty_college_id;

    const students = await Student.find({ collegeId }).select("_id");
    const studentIds = students.map((s: IStudent) => s._id);

    const count = await Offer.countDocuments({
      studentId: { $in: studentIds },
      status: 'accepted',
      package: { $gte: 600000 },
      offerNumber: 2
    });

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



// filter 7 ********************************

export const getOffersAbove6LPA = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const user = req.user;

    const faculty = await Faculty.findOne({ googleId: user.uid }).select("faculty_college_id");

    if (!faculty?.faculty_college_id) {
      return res.status(404).json({ success: false, msg: "Faculty's college ID not found" });
    }

    const collegeId = faculty.faculty_college_id;

    const students = await Student.find({ collegeId }).select("_id");
    const studentIds = students.map((s: IStudent) => s._id);

    // Step 2: Fetch all offers >= 6 LPA
    const offers = await Offer.find({
      studentId: { $in: studentIds },
      package: { $gte: 600000 }
    }).populate('studentId jobId');

    res.status(200).json({
      success: true,
      offers,
      msg: "Offers greater than or equal to 6 LPA fetched successfully"
    });

  } catch (error: any) {
    console.error("Error in getOffersAbove6LPA:", error.message);
    res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
};


//filter 8 *************************************************
export const getOffersBelow6LPA = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const user = req.user;

    const faculty = await Faculty.findOne({ googleId: user.uid }).select("faculty_college_id");

    if (!faculty?.faculty_college_id) {
      return res.status(404).json({ success: false, msg: "Faculty's college ID not found" });
    }

    const collegeId = faculty.faculty_college_id;

    // Step 1: Get all students from this college
    const students = await Student.find({ collegeId }).select("_id");
    const studentIds = students.map((s: IStudent) => s._id);

    // Step 2: Fetch all offers < 6 LPA
    const offers = await Offer.find({
      studentId: { $in: studentIds },
      package: { $lt: 600000 }
    }).populate('studentId jobId');

    res.status(200).json({
      success: true,
      offers,
      msg: "Offers less than 6 LPA fetched successfully"
    });
  } catch (error: any) {
    console.error("Error in getOffersBelow6LPA:", error.message);
    res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
};



