import expressAsyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import UserDB from "../model/User.js";

const protect = expressAsyncHandler(async (req, res, next) => {
  if (!req?.cookies?.jwt) {
    res.status(401);
    throw new Error("Not Authorized, no token!");
  }
  const token = req.cookies.jwt;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (!decoded) {
    res.status(401);
    throw new Error("Not Authorized, Invalid token!");
  }
  req.user = await UserDB.findById(decoded.userId).select("-password");
  next();
});

export { protect };
