import { Request, Response } from "express";
import Department from "../../college/models/department";
import College from "../../college/models/college";
import { redis } from "../..";
import Student from "../models/student";
import Offer from "../../company/models/offer";

export const getDeparments = async (req: Request, res: Response) => {
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


export const getOfferByStudentId = async (req: Request, res: Response) => {
  // @ts-ignore
  const user = req.user;
  console.log("inside the sudo");
  console.log(user.uid);
  

  const dbUser = await Student.findOne({googleId:user.uid})
  console.log(dbUser);
  
  try {
      const studentId  = dbUser._id;
      if (!studentId) {
          return res.status(400).json({ success: false, message: "Student ID is required" });
      }

      const redisKey = `offers:student:${studentId}`;
      const cachedOffers = await redis.get(redisKey);

      if (cachedOffers) {
          return res.status(200).json({ success: true, data: cachedOffers });
      }

      const student = await Student.findById(studentId);
      if (!student) {
          return res.status(404).json({ success: false, message: "Student not found" });
      }

      const offers = await Offer.find({ studentId: studentId }).populate("jobId").populate("studentId");
      await redis.set(redisKey, JSON.stringify(offers), { EX: 600 });

      return res.status(200).json({ success: true, data: offers });
  } catch (error: any) {
      console.error("Error in getOfferByStudentId:", error.message);
      return res.status(500).json({ success: false, message: "Internal Server Error", data: error.message });
  }
};

export const getOfferByOfferId = async (req: Request, res: Response) => {
  //@ts-ignore
  const user = req.user;

  const {offerId} = req.params


  try {
      
      if (!offerId) {
          return res.status(400).json({ success: false, message: "Offer ID is required" });
      }

      const redisKey = `offer:${offerId}`;
      const cachedOffer = await redis.get(redisKey);

      if (cachedOffer) {
          return res.status(200).json({ success: true, data: JSON.parse(cachedOffer) });
      }

      const offer = await Offer.findById(offerId).populate("jobId").populate("studentId");
      await redis.set(redisKey, JSON.stringify(offer), { EX: 600 });

      return res.status(200).json({ success: true, data: offer });
  } catch (error: any) {
      console.error("Error in getOfferByOfferId:", error.message);
      return res.status(500).json({ success: false, message: "Internal Server Error", data: error.message });
  }
};
