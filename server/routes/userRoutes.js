import express from "express";
import {
  createUserBlog,
  deleteUserBlog,
  generateUserContent,
  getBookmarks,
  getMe,
  getMyBlogs,
  getPublicProfile,
  login,
  register,
  toggleBookmark,
  toggleFollow,
  updateProfile,
  updateUserBlog,
} from "../controllers/userController.js";
import userAuth from "../middlewares/userAuth.js";
import { authLimiter, generateLimiter } from "../middlewares/rateLimit.js";

const userRouter = express.Router();

userRouter.post("/register", authLimiter, register);
userRouter.post("/login", authLimiter, login);
userRouter.get("/me", userAuth, getMe);
userRouter.put("/profile", userAuth, updateProfile);

userRouter.get("/bookmarks", userAuth, getBookmarks);
userRouter.post("/bookmark/:blogId", userAuth, toggleBookmark);

userRouter.get("/my-blogs", userAuth, getMyBlogs);
userRouter.post("/blogs", userAuth, createUserBlog);
userRouter.put("/blogs/:id", userAuth, updateUserBlog);
userRouter.delete("/blogs/:id", userAuth, deleteUserBlog);

userRouter.post("/generate", generateLimiter, userAuth, generateUserContent);

userRouter.post("/follow/:id", userAuth, toggleFollow);
userRouter.get("/:id", getPublicProfile);

export default userRouter;
