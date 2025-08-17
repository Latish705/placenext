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

const allowedOrigins = ["http://localhost:3000", process.env.CLIENT_URL].filter(Boolean) as (string | RegExp)[];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ["Content-Type", "Authorization"]
}))

app.use(express.json());

app.get("/", (req, res) => {
  return res.send("hello world");
});

app.use("/api", appRoutes);

export default app;
