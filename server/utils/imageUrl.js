import imagekit from "../configs/imageKit.js";

export const buildBlogImageUrl = (path) =>
  imagekit.url({
    path,
    transformation: [{ quality: "auto" }, { format: "webp" }, { width: "1280" }],
  });

export const buildAvatarUrl = (path) =>
  imagekit.url({
    path,
    transformation: [
      { quality: "auto" },
      { format: "webp" },
      { width: "256", height: "256", cropMode: "extract" },
    ],
  });
