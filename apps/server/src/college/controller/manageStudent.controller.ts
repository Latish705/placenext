import { Request, Response } from "express";
import Student from "../../student/models/student";
import Faculty from "../models/faculty";

export const getAllStudents = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const user = req.user;
    const faculty_coll = await Faculty.find({ googleId: user.uid }).select(
      "faculty_college_id -_id"
    );
    //@ts-ignore
    const collegeId = faculty_coll[0].faculty_college_id;
    const allStudents = await Student.find({stud_college_id: collegeId})

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
