import { Request, Response, NextFunction } from "express";
import admin from "../config/firebaseAdmin";

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Safely extract token either from Authorization header or refreshToken in body
    let token: string | null = null;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.body.refreshToken) {
      token = req.body.refreshToken.toString();
    }

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
        // Refresh token logic here (optional)
        console.error("Token expired, need to refresh");
        return res.status(403).json({ error: "Token Expired" });
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
