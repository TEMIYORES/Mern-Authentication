import expressAsyncHandler from "express-async-handler";
import UserDB from "../model/User.js";
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";

// @desc    Register New User
// route    POST  /api/users
// @access  Public
const registerUser = expressAsyncHandler(async (req, res) => {
  if (!req?.body?.name || !req?.body?.password || !req?.body?.email)
    return res
      .status(400)
      .json({ "error Message": "Name, Email and Password are required!" });
  const { name, password, email } = req.body;
  const duplicate = await UserDB.findOne({ name }).exec();
  const confirmDuplicate = await UserDB.findOne({ email }).exec();
  if (duplicate) {
    return res
      .status(409)
      .json({ "error Message": "User with the same name already exists!" });
  }
  if (confirmDuplicate) {
    return res
      .status(409)
      .json({ "error Message": "User with the same email already exists!" });
  }
  const hashedPwd = await bcrypt.hash(password, 10);
  const new_user = await UserDB.create({
    name,
    email,
    password: hashedPwd,
  });
  if (new_user) {
    generateToken(res, new_user._id);
    return res
      .status(201)
      .json({ id: new_user._id, name: new_user.name, email: new_user.email });
  }

  res.statusCode = 400;
  throw new Error("Invalid user data");
});

// @desc    Auth  User/ set token
// route    POST  /api/users/auth
// @access  Public
const authUser = expressAsyncHandler(async (req, res) => {
  if (!req?.body?.email || !req?.body?.password)
    return res
      .status(400)
      .json({ "error Message": "Email and Password are required!" });
  const { email, password } = req.body;
  const user = await UserDB.findOne({ email }).exec();
  if (!user) {
    return res.status(401).json({ error: "Invalid Email or Password" });
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (user && isPasswordValid) {
    generateToken(res, user._id);
    return res
      .status(201)
      .json({ id: user._id, name: user.name, email: user.email });
  } else {
    return res.status(401).json({ error: "Invalid Email or Password" });
  }
});

// @desc    Logout User
// route    POST  /api/users/logout
// @access  Public
const logoutUser = expressAsyncHandler(async (req, res) => {
  if (!req?.cookies?.jwt)
    return res.status(200).json({ message: "User Logged Out!" });
  res.clearCookie("jwt", {
    httpOnly: true,
  });

  return res.status(200).json({ message: `User Logged Out!` });
});

// @desc    Get User Profile
// route    GET  /api/users/profile
// @access  Private
const getUserProfile = expressAsyncHandler(async (req, res) => {
  const user = req.user;
  res.json(user);
});

// @desc    Update User Profile
// route    PUT  /api/users/profile
// @access  Private
const updateUserProfile = expressAsyncHandler(async (req, res) => {
  const { name, email, password } = req?.body;
  if (!name && !email && !password)
    return res.status(200).json({ message: "Nothing to Update" });
  const user = await UserDB.findById(req.user._id);
  if (!user) return res.status(404).json({ error: "User Not Found!" });
  if (req.body?.name) user.name = name;
  if (req.body?.email) user.email = email;
  if (req.body?.password) {
    const hashedPwd = await bcrypt.hash(password, 10);
    user.password = hashedPwd;
  }
  const updatedUser = await user.save();
  return res.status(200).json(updatedUser);
});
export {
  registerUser,
  authUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
};
