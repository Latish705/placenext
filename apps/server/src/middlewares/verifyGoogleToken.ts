import { Request, Response, NextFunction } from "express";
import admin from "../config/firebaseAdmin";

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token =
      req.headers.authorization?.split(" ")[1] ||
      req.body.refreshToken.toString();

    console.log(token);

    if (!token) {
      return res.status(401).json({ error: "Access Denied" });
    }

    try {
      const decodedUser = await admin.auth().verifyIdToken(token);
      if (decodedUser.exp * 1000 < Date.now()) {
        // Token has expired

        return res.status(403).json({ error: "Token Expired" });
      }

      // @ts-ignore
      req.user = decodedUser;
      next();
    } catch (error: any) {
      if (error.code === "auth/id-token-expired") {
        // Refresh token logic here
        console.error("Token expired, need to refresh");
      } else {
        console.error("Error verifying token:", error);
        return res.status(403).json({ error: "Invalid Token" });
      }
    }
  } catch (error: any) {
    console.log("Error in authenticateToken", error.message);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};
