import { Request, Response } from "express";
import Department from "../../college/models/department";
import College from "../../college/models/college";
import { redis } from "../..";

export const getDepartments = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const user = req.user;
    const { collegeId } = req.body;
    console.log(collegeId);

    const redisKey = `departments:${collegeId}`;
    const cachedDepartments = await redis.get(redisKey);

    if (cachedDepartments) {
      return res.status(200).json({ departments: cachedDepartments });
    }

    const { coll_departments }: any = await College.findById(collegeId);
    console.log(coll_departments);

    if (!coll_departments) {
      return res.status(404).send("No departments found");
    }

    await redis.set(redisKey, JSON.stringify(coll_departments), { EX: 600 });

    res.status(200).json({ departments: coll_departments });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
};
