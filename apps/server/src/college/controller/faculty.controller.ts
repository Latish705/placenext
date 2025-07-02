import { Request, Response } from "express";
import College from "../models/college";
import Faculty from "../models/faculty";

interface FilterOptions {
  branch: string;
  role: string;
}

const generateRefreshAndAccessToken = async (faculty: any) => {
  try {
    const refreshToken = faculty.generateRefreshToken();
    const accessToken = faculty.generateAccessToken();
    faculty.refreshToken = refreshToken;
    faculty.accessToken = accessToken;
    await faculty.save();
    return { refreshToken, accessToken };
  } catch (error: any) {
    console.log(error.message);
    return null;
  }
};

export const create_faculty = async (req: Request, res: Response) => {
  try {
    //@ts-ignore
    const user = req.user;
    const { email, password } = req.body;
    const college = await College.findOne({ googleId: user.id });
    if (!college) {
      return res.status(404).json({ message: "College not found" });
    }

    // check if faculty already exists
    const faculty = await Faculty.findOne({ email });

    if (faculty) {
      return res.status(400).json({ message: "Faculty already exists" });
    }

    // create faculty
    const newFaculty = new Faculty({
      email,
      password,
      college: college._id,
    });
    await newFaculty.save();
    const createdFaculty = await Faculty.findOne({ email }).select("-password");
    return res.status(201).json({
      success: true,
      message: "New Faculty created Successfully",
      faculty: createdFaculty,
    });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const facultyLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const faculty = await Faculty.findOne({ faculty_email: email });
    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    // compare password
    const isMatch = await faculty.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const { refreshToken, accessToken }: any =
      await generateRefreshAndAccessToken(faculty);
    return res
      .status(200)
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
      })
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
      })
      .json({
        success: true,
        message: "Faculty logged in successfully",
        refreshToken,
        accessToken,
      });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const selectCollege = async (req: Request, res: Response) => {
  try {
    //@ts-ignore
    const user = req.user;
    const { collegeId } = req.body;
    const college = await College.findById(collegeId);
    if (!college) {
      return res.status(404).json({ message: "College not found" });
    }

    const faculty = await Faculty.findOne({ googleId: user.user_id });
    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    faculty.faculty_college_id = collegeId;
    await faculty.save();
    return res.status(200).json({
      success: true,
      message: "College selected successfully",
    });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkRole = async (req: Request, res: Response) => {
  try {
    //@ts-ignore
    const user = req.user;
    const faculty = await Faculty.findOne({ googleId: user.user_id });
    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }
    return res.status(200).json({
      success: true,
      role: faculty.role,
    });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getFacultyList = async (req: Request, res: Response) => {
  try {
    // Extract user and college ID
    // @ts-ignore
    const user = req.user;
    // @ts-ignore
    const college_id = req.collegeId;

    // Extract optional query parameters
    const branch = req.query.branch as string | undefined;
    const role = req.query.role as string | undefined;
    const assigned = req.query.assigned === "true";

    // Build query dynamically
    const query: any = {
      faculty_college_id: college_id,
      googleId: { $ne: user.user_id },
    };

    if (role) query.role = role;
    if (branch) query.faculty_department_id = branch;

    if (assigned) {
      query.role = { $ne: "none" }; // Assigned faculties have a role
    } else {
      query.role = "none"; // Unassigned faculties
    }

    // Fetch faculties based on the query
    const faculties = await Faculty.find(query).select("-password");

    return res.status(200).json({
      success: true,
      faculties,
    });
  } catch (error: any) {
    console.error("Error fetching faculty list:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const getFacultyDetails = async (req: Request, res: Response) => {
  try {
    //@ts-ignore
    const userId = req.user;

    if (!userId || !userId.uid) {
      return res.status(400).json({ msg: "User ID is required" });
    }

    // 1. Get the faculty by googleId
    const faculty = await Faculty.findOne({ googleId: userId.uid }).select("-password");

    if (!faculty) {
      return res.status(404).json({ msg: "Faculty not found" });
    }

    // 2. Get the college using faculty_college_id
    const college = await College.findById(faculty.faculty_college_id);

    if (!college) {
      return res.status(404).json({ msg: "Associated college not found" });
    }

    // 3. Return both
    return res.status(200).json({
      success: true,
      faculty,
      college,
      msg: "Faculty and college details fetched successfully",
    });

  } catch (error) {
    console.log("Error in getFacultyDetails:", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};
