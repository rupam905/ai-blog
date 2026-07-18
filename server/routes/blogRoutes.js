import express from "express";
import {
  addBlog,
  addComment,
  deleteBlogById,
  generateContent,
  getAllBlogs,
  getBlogById,
  getBlogComments,
  toggleLike,
  togglePublish,
  updateBlog,
} from "../controllers/blogController.js";
import auth from "../middlewares/auth.js";
import userAuth from "../middlewares/userAuth.js";
import { commentLimiter, generateLimiter } from "../middlewares/rateLimit.js";

const blogRouter = express.Router();

blogRouter.post("/add", auth, addBlog);
blogRouter.post("/update", auth, updateBlog);
blogRouter.get("/all", getAllBlogs);
blogRouter.get("/:blogId", getBlogById);
blogRouter.post("/delete",auth, deleteBlogById);
blogRouter.post("/toggle-publish",auth, togglePublish);
blogRouter.post("/add-comment", commentLimiter, userAuth, addComment);
blogRouter.post("/comments", getBlogComments);
blogRouter.post("/generate", generateLimiter, auth, generateContent);
blogRouter.post("/:blogId/like", userAuth, toggleLike);

export default blogRouter;
