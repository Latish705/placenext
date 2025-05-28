import { Request, Response } from "express";
import Department from "../../college/models/department";
import College from "../../college/models/college";
import Job from "../../company/models/job";
export const getDeparments = async (req: Request, res: Response) => {
  try {
    //@ts-ignore
    const user = req.user;
    const { collegeId } = req.body;
    console.log(collegeId);

    const { coll_departments }: any = await College.findById(collegeId);
    console.log(coll_departments);

    if (!coll_departments) {
      return res.status(404).send("No departments found");
    }
    res.status(200).json({ departments: coll_departments });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
};



// export const getJobs = async (req: Request, res: Response) => {
//   try {
//     //@ts-ignore
//     const user = req.user;
//     const { collegeId } = req.body;
//     const college = await College.findById(collegeId);
//     if (!college) { 
//       return res.status(404).json({ msg: "College not found" });
//     }

//     const jobs = await Job.find({ college: collegeId, status: "approved" })
//       .populate("company")
//       .populate("department");

//     if (!jobs || jobs.length === 0) {
//       return res.status(404).json({ msg: "No jobs found" });
//     }

//     res.status(200).json({
//       success: true,
//       jobs: jobs,
//       msg: `Jobs fetched successfully for the college ${college.coll_name}`,
//     });
//   } catch (error: any) {
//     console.log("Error in getJobs", error);
//     return res.status(500).json({ msg: "Internal Server Error" });
//   }
// }