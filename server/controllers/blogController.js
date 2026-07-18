import fs from "fs";
import imagekit from "../configs/imageKit.js";
import Blog from "../models/Blog.js";
import Comment from "../models/Comments.js";
import main from "../configs/gemini.js";
import { sanitizeBlogHtml } from "../utils/sanitize.js";

export const addBlog = async (req, res) => {
  try {
    const { title, subTitle, description, category, isPublished } = JSON.parse(
      req.body.blog,
    );
    const imageFile = req.file;

    if (!title || !description || !category || !imageFile) {
      return res.json({ success: false, message: "Missing required fields" });
    }

    const fileBuffer = fs.readFileSync(imageFile.path);

    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: "/blogs",
    });
    fs.unlink(imageFile.path, () => {});

    const optimizedImageURL = imagekit.url({
      path: response.filePath,
      transformation: [
        { quality: "auto" },
        { format: "webp" },
        { width: "1280" },
      ],
    });
    const image = optimizedImageURL;

    await Blog.create({
      title,
      subTitle,
      description: sanitizeBlogHtml(description),
      category,
      image,
      isPublished,
    });
    res.json({ success: true, message: "Blog added succesfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const { id, title, subTitle, description, category, isPublished } =
      JSON.parse(req.body.blog);
    const imageFile = req.file;

    if (!id || !title || !description || !category) {
      return res.json({ success: false, message: "Missing required fields" });
    }

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.json({ success: false, message: "Blog not found" });
    }

    let image = blog.image;
    if (imageFile) {
      const fileBuffer = fs.readFileSync(imageFile.path);

      const response = await imagekit.upload({
        file: fileBuffer,
        fileName: imageFile.originalname,
        folder: "/blogs",
      });
      fs.unlink(imageFile.path, () => {});

      image = imagekit.url({
        path: response.filePath,
        transformation: [
          { quality: "auto" },
          { format: "webp" },
          { width: "1280" },
        ],
      });
    }

    blog.title = title;
    blog.subTitle = subTitle;
    blog.description = sanitizeBlogHtml(description);
    blog.category = category;
    blog.image = image;
    blog.isPublished = isPublished;

    await blog.save();
    res.json({ success: true, message: "Blog updated successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ isPublished: true })
      .populate("author", "name avatar isVerified")
      .sort({ createdAt: -1 });
    res.json({ success: true, blogs });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getBlogById = async (req, res) => {
  try {
    const { blogId } = req.params;
    const blog = await Blog.findById(blogId).populate(
      "author",
      "name avatar isVerified bio",
    );
    if (!blog) {
      return res.json({ success: false, message: "Blog not found" });
    }
    res.json({ success: true, blog });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const deleteBlogById = async (req, res) => {
  try {
    const { id } = req.body;
    await Blog.findByIdAndDelete(id);
    await Comment.deleteMany({ blog: id });
    res.json({ success: true, message: "Blog deleted successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const togglePublish = async (req, res) => {
  try {
    const { id } = req.body;
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.json({ success: false, message: "Blog not found" });
    }
    blog.isPublished = !blog.isPublished;
    await blog.save();
    res.json({ success: true, message: "Blog status updated" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const { blog, content } = req.body;
    await Comment.create({
      blog,
      content,
      name: req.user.name,
      author: req.user._id,
    });
    res.json({ success: true, message: "Comment added successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getBlogComments = async (req, res) => {
  try {
    const { blogId } = req.body;
    const comments = await Comment.find({
      blog: blogId,
      isApproved: true,
    })
      .populate("author", "name avatar isVerified")
      .sort({ createdAt: -1 });
    res.json({ success: true, comments });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const toggleLike = async (req, res) => {
  try {
    const { blogId } = req.params;
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.json({ success: false, message: "Blog not found" });
    }

    const userId = req.user._id.toString();
    const alreadyLiked = blog.likes.some((id) => id.toString() === userId);

    if (alreadyLiked) {
      blog.likes = blog.likes.filter((id) => id.toString() !== userId);
    } else {
      blog.likes.push(req.user._id);
    }

    await blog.save();
    res.json({ success: true, liked: !alreadyLiked, likesCount: blog.likes.length });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const generateContent = async (req, res) => {
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
