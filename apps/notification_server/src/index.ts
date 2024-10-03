import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import Queue from "bull";
import mongoose, { Schema, Document } from "mongoose";
import connectDB from "./config/connectdb";

dotenv.config();

const app = express();
const port = process.env.PORT || 8081;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// MongoDB connection
connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  });

// Define the Notification model
interface INotification extends Document {
  userId: string;
  message: string;
  date: Date;
}

const NotificationSchema = new Schema({
  userId: { type: String, required: true },
  message: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const Notification = mongoose.model<INotification>(
  "Notification",
  NotificationSchema
);

// Create queues for notifications and emails
const notificationQueue = new Queue("notificationQueue");
const emailQueue = new Queue("emailQueue");

// Controller functions
const sendNotificationToUser = async (req: Request, res: Response) => {
  try {
    const { userId, message } = req.body;
    const notification = new Notification({ userId, message });

    await notification.save(); // Save the notification to the database
    await notificationQueue.add({ userId, message }); // Add notification to the queue

    res.status(200).json({ message: "Notification sent to user" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const sendEmailToUser = async (req: Request, res: Response) => {
  try {
    const { userId, message } = req.body;
    await emailQueue.add({ userId, message }); // Add email to the queue

    res.status(200).json({ message: "Email sent to user" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Routes
const notificationRoutes = express.Router();
notificationRoutes.post("/send_notification", sendNotificationToUser);
notificationRoutes.post("/send_email", sendEmailToUser);

// Use the notification routes
app.use("/notifications", notificationRoutes);

// Health check route
app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

// Worker for processing notification jobs
notificationQueue.process(async (job) => {
  const { userId, message } = job.data;
  // Implement the actual notification sending logic here
  console.log(`Notification sent to user ${userId}: ${message}`);
});

// Worker for processing email jobs
emailQueue.process(async (job) => {
  const { userId, message } = job.data;
  // Implement the actual email sending logic here
  console.log(`Email sent to user ${userId}: ${message}`);
});
