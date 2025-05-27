import { NextFunction, Request, Response } from "express";
import Faculty from "../models/faculty";

export const verifyRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //@ts-ignore
    const user = req.user;
    const faculty = await Faculty.findOne({ googleId: user.user_id });
    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }
    if (faculty.role !== "faculty" && faculty.role !== "college-admin") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    console.log(
      "Role:",
      faculty.role,
      "College ID:",
      faculty.faculty_college_id
    );

    //@ts-ignore
    req.role = faculty.role;
    //@ts-ignore
    req.collegeId = faculty.faculty_college_id;
    next();
  } catch (error: any) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
