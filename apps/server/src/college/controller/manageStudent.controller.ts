import { Request, Response } from "express";

export const getAllStudents = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const user = req.user;
    // const students = await College.find({ collegeId: user.uid });

    // return res.status(200).json({ success: true, students });
  } catch (error: any) {
    console.log("Error in getAllStudents", error.message);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};
