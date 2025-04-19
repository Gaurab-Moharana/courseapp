import express from "express";
import fileUpload from "express-fileupload";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import courseRoute from "./routes/course.route.js";
import userRoute from "./routes/user.route.js";
import adminRoute from "./routes/admin.route.js";
import orderRoute from "./routes/order.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();
const app = express();

const port = process.env.PORT || 3000;
const DB_URL = process.env.MONGO_URL;

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  process.env.FRONTEND_URL, // from Render or .env
].filter(Boolean); // r

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server or curl requests (no origin)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error("Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

//Middlewares
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
try {
  await mongoose.connect(DB_URL);
  console.log("Connected to database");
} catch (error) {
  console.log(error);
}
// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});
//defining routes
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/order", orderRoute);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
