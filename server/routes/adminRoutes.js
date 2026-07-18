import express from "express";
import {
  adminLogin,
  approveCommentById,
  deleteCommentById,
  getAllBlogsAdmin,
  getAllComments,
  getAllUsers,
  getDashboard,
  toggleVerifyUser,
} from "../controllers/adminController.js";
import auth from "../middlewares/auth.js";
import { authLimiter } from "../middlewares/rateLimit.js";

const adminRouter = express.Router();

adminRouter.post("/login", authLimiter, adminLogin);
adminRouter.get("/comments", auth, getAllComments);
adminRouter.get("/blogs", auth, getAllBlogsAdmin);
adminRouter.post("/delete-comment", auth, deleteCommentById);
adminRouter.post("/approve-comment", auth, approveCommentById);
adminRouter.get("/dashboard", auth, getDashboard);
adminRouter.get("/users", auth, getAllUsers);
adminRouter.post("/toggle-verify-user", auth, toggleVerifyUser);

export default adminRouter;
