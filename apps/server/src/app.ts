import express from "express";
import appRoutes from "./routes/routes";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();

export const Document_server_url: string =
  process.env.DOCUMENT_SERVER_URL || "";

// app.use(
//   cors()
//   // {
//   // origin: [
//   //   process.env.CLIENT_URL!,
//   //   "http://192.168.29.192",
//   //   "http://localhost:",
//   //   "http://10.0.2.2",
//   //   "http://192.168.29.192:8080",
//   // ],
//   // credentials: true,
//   // }
// );

app.use(cors({
  origin:"http://localhost:3000"
}))

app.use(express.json());

app.get("/", (req, res) => {
  return res.send("hello world");
});

app.use("/api", appRoutes);

export default app;
