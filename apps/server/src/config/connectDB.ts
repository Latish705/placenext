import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || "");
    console.log("Database Connected Successfull", conn.connection.host);
    return;
  } catch (error: any) {
    console.log("Error Connecting Database", error);
  }
};

export default connectDB;
