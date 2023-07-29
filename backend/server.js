import express from "express";
import dotenv from "dotenv";
import path from "path";
import userRoute from "./routes/api/users.js";
import { errorHandler, notFound } from "./middleware/errorMIddleware.js";
import connectDB from "./config/Db.js";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import corsOptions from "./config/corsOptions.js";
dotenv.config();
const port = process.env.PORT || 3300;
connectDB();
const app = express();
// Handle options Credentials check - before CORS!
// and fetch cookies credentials requirement
// THIRD-PARTY MIDDLEWARE
app.use(cookieParser());
app.use(cors(corsOptions));
//  BUILT-IN MIDDLEWARE
// middleware to handle urlencoded data e.g form data:
// 'content-type: application/x-www-form-urlencoded'
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/users", userRoute);

if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, "frontend/dist")));
  console.log("ready!");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("Server is ready!");
  });
}

app.use(notFound);
app.use(errorHandler);
mongoose.connection.once("open", () => {
  app.listen(port, () => {
    console.log("Server is running on port", port);
  });
});
