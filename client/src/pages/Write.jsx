import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { assets, blogCategories } from "../assets/assets";
import Quill from "quill";
import { useAppContext } from "../context/AppContext";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import toast from "react-hot-toast";
import { parse } from "marked";
import { uploadImage } from "../utils/uploadImage";

const Write = () => {
  const { axios, navigate, user, authLoading } = useAppContext();
  const { id: blogId } = useParams();
  const isEditMode = Boolean(blogId);

  const [isSaving, setIsSaving] = useState(false);
  const [loadingAi, setLoadingAi] = useState(false);

  const editorRef = useRef(null);
  const quillRef = useRef(null);

  const [image, setImage] = useState(false);
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [category, setCategory] = useState("Technology");

  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("Please log in to write a post");
      navigate("/auth");
    }
  }, [authLoading, user, navigate]);

  const generateContent = async () => {
    if (!title) return toast.error("Please enter a title");
    try {
      setLoadingAi(true);
      const { data } = await axios.post("/api/user/generate", { prompt: title });
      if (data.success) {
        quillRef.current.root.innerHTML = parse(data.content);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoadingAi(false);
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);

      let imagePath;
      if (image && typeof image !== "string") {
        imagePath = await uploadImage(axios, image);
      }

      const blog = {
        title,
        subTitle,
        description: quillRef.current.root.innerHTML,
        category,
        imagePath,
      };

      const { data } = isEditMode
        ? await axios.put(`/api/user/blogs/${blogId}`, blog)
        : await axios.post("/api/user/blogs", blog);

      if (data.success) {
        toast.success(isEditMode ? "Post updated" : "Post published!");
        navigate(isEditMode ? `/blog/${blogId}` : `/blog/${data.blog._id}`);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, { theme: "snow" });
    }
  }, [user]);

  useEffect(() => {
    if (!isEditMode) return;
    const fetchBlog = async () => {
      try {
        const { data } = await axios.get(`/api/blog/${blogId}`);
        if (!data.success) return toast.error(data.message);
        const { blog } = data;
        if (!blog.author || blog.author._id !== user?._id) {
          toast.error("You can only edit your own posts");
          return navigate("/");
        }
        setTitle(blog.title);
        setSubTitle(blog.subTitle);
        setCategory(blog.category);
        setImage(blog.image);
        if (quillRef.current) quillRef.current.root.innerHTML = blog.description;
      } catch (error) {
        toast.error(error.message);
      }
    };
    fetchBlog();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode, blogId, user]);

  if (authLoading) return <Loader />;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-paper">
      <Navbar />
      <form onSubmit={onSubmitHandler} className="max-w-3xl mx-auto p-4 md:p-10">
        <h1 className="font-serif text-2xl text-ink mb-6">
          {isEditMode ? "Edit post" : "Write a new post"}
        </h1>
        <div className="bg-white w-full p-6 md:p-10 border border-ink/10 rounded-2xl text-gray-600">
          <p className="text-sm font-medium text-ink">Cover image</p>
          <label htmlFor="image">
            <img
              src={
                !image
                  ? assets.upload_area
                  : typeof image === "string"
                    ? image
                    : URL.createObjectURL(image)
              }
              alt=""
              className="mt-2 h-32 w-full max-w-xs rounded-xl border border-ink/10 cursor-pointer object-cover"
            />
            <input
              onChange={(e) => setImage(e.target.files[0])}
              type="file"
              id="image"
              hidden
              required={!isEditMode}
            />
          </label>

          <p className="mt-6 text-sm font-medium text-ink">Title</p>
          <input
            type="text"
            placeholder="Give your post a title"
            required
            className="w-full mt-2 p-3 border border-ink/15 rounded-xl outline-none focus:ring-2 focus:ring-primary/40 transition-shadow"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />

          <p className="mt-4 text-sm font-medium text-ink">Subtitle</p>
          <input
            type="text"
            placeholder="A short one-liner"
            required
            className="w-full mt-2 p-3 border border-ink/15 rounded-xl outline-none focus:ring-2 focus:ring-primary/40 transition-shadow"
            onChange={(e) => setSubTitle(e.target.value)}
            value={subTitle}
          />

          <p className="mt-4 text-sm font-medium text-ink">Content</p>
          <div className="h-74 pb-16 sm:pb-10 pt-2 relative">
            <div ref={editorRef}></div>
            {loadingAi && (
              <div className="absolute right-0 top-0 bottom-0 left-0 flex items-center justify-center bg-black/10 mt-2">
                <div className="w-8 h-8 rounded-full border-2 border-t-white animate-spin"></div>
              </div>
            )}
            <button
              disabled={loadingAi}
              type="button"
              onClick={generateContent}
              className="absolute bottom-1 right-2 ml-2 text-xs text-white bg-ink px-4 py-1.5 rounded-full hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer">
              {loadingAi ? "Generating..." : "Generate with AI"}
            </button>
          </div>

          <div className="mt-4">
            <p className="text-sm font-medium text-ink">Category</p>
            <select
              onChange={(e) => setCategory(e.target.value)}
              value={category}
              className="mt-2 w-full sm:max-w-xs px-3 py-2.5 border text-gray-600 border-ink/15 outline-none rounded-xl focus:ring-2 focus:ring-primary/40 transition-shadow">
              {blogCategories
                .filter((item) => item !== "All")
                .map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
            </select>
          </div>

          <button
            disabled={isSaving}
            type="submit"
            className="mt-8 px-8 py-2.5 bg-primary text-white rounded-full hover:opacity-90 active:scale-[0.98] transition disabled:opacity-60 cursor-pointer text-sm font-medium">
            {isSaving
              ? isEditMode
                ? "Saving..."
                : "Publishing..."
              : isEditMode
                ? "Save changes"
                : "Publish"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Write;
