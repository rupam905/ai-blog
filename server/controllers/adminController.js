import crypto from "crypto";
import jwt from "jsonwebtoken";
import Blog from "../models/Blog.js";
import Comment from "../models/Comments.js";
import User from "../models/User.js";
import { buildPaginationMeta, getPagination } from "../utils/pagination.js";

const safeCompare = (a = "", b = "") => {
  const bufA = crypto.createHash("sha256").update(String(a)).digest();
  const bufB = crypto.createHash("sha256").update(String(b)).digest();
  return crypto.timingSafeEqual(bufA, bufB);
};

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !safeCompare(email, process.env.ADMIN_EMAIL) ||
      !safeCompare(password, process.env.ADMIN_PASSWORD)
    ) {
      return res.json({ success: false, message: "invalid credentials" });
    }
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ success: true, token });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getAllBlogsAdmin = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const total = await Blog.countDocuments();
    const blogs = await Blog.find({})
      .populate("author", "name avatar isVerified")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    res.json({ success: true, blogs, pagination: buildPaginationMeta(page, limit, total) });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getAllComments = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const { status } = req.query;
    const filter =
      status === "approved"
        ? { isApproved: true }
        : status === "not-approved"
          ? { isApproved: false }
          : {};

    const total = await Comment.countDocuments(filter);
    const comments = await Comment.find(filter)
      .populate("blog")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    res.json({ success: true, comments, pagination: buildPaginationMeta(page, limit, total) });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getDashboard = async (req, res) => {
  try {
    const recentBlogs = await Blog.find({})
      .populate("author", "name avatar isVerified")
      .sort({ createdAt: -1 })
      .limit(5);
    const blogs = await Blog.countDocuments();
    const comments = await Comment.countDocuments();
    const drafts = await Blog.countDocuments({ isPublished: false });
    const users = await User.countDocuments();
    const dashboardData = {
      blogs,
      comments,
      drafts,
      users,
      recentBlogs,
    };
    res.json({ success: true, dashboardData });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const total = await User.countDocuments();
    const users = await User.find({})
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    res.json({ success: true, users, pagination: buildPaginationMeta(page, limit, total) });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const toggleVerifyUser = async (req, res) => {
  try {
    const { id } = req.body;
    const user = await User.findById(id);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    user.isVerified = !user.isVerified;
    await user.save();
    res.json({ success: true, message: "User verification status updated" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const deleteCommentById = async (req, res) => {
  try {
    const { id } = req.body;
    await Comment.findByIdAndDelete(id);
    res.json({ success: true, message: "Comment deleted successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const approveCommentById = async (req, res) => {
  try {
    const { id } = req.body;
    await Comment.findByIdAndUpdate(id, { isApproved: true });
    res.json({ success: true, message: "Comment approved successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
