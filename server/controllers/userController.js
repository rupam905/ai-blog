import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Blog from "../models/Blog.js";
import Comment from "../models/Comments.js";
import main from "../configs/gemini.js";
import { sanitizeBlogHtml } from "../utils/sanitize.js";
import { buildAvatarUrl, buildBlogImageUrl } from "../utils/imageUrl.js";

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

const toPublicUser = (user, extra = {}) => ({
  _id: user._id,
  name: user.name,
  bio: user.bio,
  avatar: user.avatar,
  isVerified: user.isVerified,
  followersCount: user.followers?.length || 0,
  followingCount: user.following?.length || 0,
  createdAt: user.createdAt,
  ...extra,
});

const toOwnUser = (user, extra = {}) => ({
  ...toPublicUser(user, extra),
  email: user.email,
});

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      !name ||
      !email ||
      !password
    ) {
      return res.json({ success: false, message: "Missing required fields" });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.json({ success: false, message: "Email is already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    const token = generateToken(user._id);
    res.json({ success: true, token, user: toOwnUser(user) });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (typeof email !== "string" || typeof password !== "string") {
      return res.json({ success: false, message: "Invalid email or password" });
    }
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid email or password" });
    }

    const token = generateToken(user._id);
    res.json({ success: true, token, user: toOwnUser(user) });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    res.json({ success: true, user: toOwnUser(req.user) });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, bio, avatarPath } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (avatarPath) user.avatar = buildAvatarUrl(avatarPath);

    await user.save();
    res.json({ success: true, message: "Profile updated", user: toOwnUser(user) });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getPublicProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    let isFollowing = false;
    const token = req.headers["x-auth-token"];
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        isFollowing = user.followers.some((f) => f.toString() === decoded.id);
      } catch {
        // not logged in / invalid token — ignore, isFollowing stays false
      }
    }

    const blogs = await Blog.find({ author: id, isPublished: true })
      .populate("author", "name avatar isVerified")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      user: toPublicUser(user, { isFollowing }),
      blogs,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const toggleFollow = async (req, res) => {
  try {
    const { id } = req.params;
    if (id === req.user._id.toString()) {
      return res.json({ success: false, message: "You can't follow yourself" });
    }

    const target = await User.findById(id);
    if (!target) {
      return res.json({ success: false, message: "User not found" });
    }

    const me = await User.findById(req.user._id);
    const alreadyFollowing = target.followers.some(
      (f) => f.toString() === me._id.toString(),
    );

    if (alreadyFollowing) {
      target.followers = target.followers.filter(
        (f) => f.toString() !== me._id.toString(),
      );
      me.following = me.following.filter((f) => f.toString() !== id);
    } else {
      target.followers.push(me._id);
      me.following.push(id);
    }

    await target.save();
    await me.save();

    res.json({
      success: true,
      following: !alreadyFollowing,
      followersCount: target.followers.length,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const toggleBookmark = async (req, res) => {
  try {
    const { blogId } = req.params;
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.json({ success: false, message: "Blog not found" });
    }

    const user = await User.findById(req.user._id);
    const alreadyBookmarked = user.bookmarks.some(
      (b) => b.toString() === blogId,
    );

    if (alreadyBookmarked) {
      user.bookmarks = user.bookmarks.filter((b) => b.toString() !== blogId);
    } else {
      user.bookmarks.push(blogId);
    }

    await user.save();
    res.json({ success: true, bookmarked: !alreadyBookmarked });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getBookmarks = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "bookmarks",
      populate: { path: "author", select: "name avatar isVerified" },
      options: { sort: { createdAt: -1 } },
    });
    res.json({ success: true, blogs: user.bookmarks });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getMyBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.user._id })
      .populate("author", "name avatar isVerified")
      .sort({ createdAt: -1 });
    res.json({ success: true, blogs });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const createUserBlog = async (req, res) => {
  try {
    const { title, subTitle, description, category, imagePath } = req.body;

    if (!title || !description || !category || !imagePath) {
      return res.json({ success: false, message: "Missing required fields" });
    }

    const image = buildBlogImageUrl(imagePath);

    const blog = await Blog.create({
      title,
      subTitle,
      description: sanitizeBlogHtml(description),
      category,
      image,
      isPublished: true,
      author: req.user._id,
    });

    res.json({ success: true, message: "Blog published successfully", blog });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const updateUserBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subTitle, description, category, imagePath } = req.body;

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.json({ success: false, message: "Blog not found" });
    }
    if (!blog.author || blog.author.toString() !== req.user._id.toString()) {
      return res.json({ success: false, message: "Not authorized" });
    }

    if (imagePath) {
      blog.image = buildBlogImageUrl(imagePath);
    }

    blog.title = title;
    blog.subTitle = subTitle;
    blog.description = sanitizeBlogHtml(description);
    blog.category = category;

    await blog.save();
    res.json({ success: true, message: "Blog updated successfully", blog });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const deleteUserBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.json({ success: false, message: "Blog not found" });
    }
    if (!blog.author || blog.author.toString() !== req.user._id.toString()) {
      return res.json({ success: false, message: "Not authorized" });
    }

    await Blog.findByIdAndDelete(id);
    await Comment.deleteMany({ blog: id });
    res.json({ success: true, message: "Blog deleted successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const generateUserContent = async (req, res) => {
  try {
    const { prompt } = req.body;
    const content = await main(
      prompt + "Generate a blog content for this topic in simple text format",
    );
    res.json({ success: true, content });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
