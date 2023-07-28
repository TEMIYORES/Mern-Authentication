import express from "express";
import {
  registerUser,
  updateUserProfile,
  getUserProfile,
  authUser,
  logoutUser,
} from "../../controllers/userController.js";
import { protect } from "../../middleware/authMiddlewares.js";

const router = express.Router();

router.route("/").post(registerUser);
router.route("/auth").post(authUser);
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router.route("/logout").post(logoutUser);

export default router;
