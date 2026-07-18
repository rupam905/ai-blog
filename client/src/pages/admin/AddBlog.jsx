import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { assets, blogCategories } from "../../assets/assets";
import Quill from "quill";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { parse } from "marked";
import { uploadImage } from "../../utils/uploadImage";

const AddBlog = () => {
  const { axios, navigate } = useAppContext();
  const { id: blogId } = useParams();
  const isEditMode = Boolean(blogId);

  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);

  const editorRef = useRef(null);
  const quillRef = useRef(null);

  const [image, setImage] = useState(false);
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [category, setCategory] = useState("Startup");
  const [isPublished, setIsPublished] = useState(false);

  const generateContent = async () => {
    if (!title) return toast.error("Please enter a title");

    try {
      setLoading(true);
      const { data } = await axios.post("/api/blog/generate", {
        prompt: title,
      });
      if (data.success) {
        quillRef.current.root.innerHTML = parse(data.content);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      setIsAdding(true);

      let imagePath;
      if (image && typeof image !== "string") {
        imagePath = await uploadImage(axios, image);
      }

      const blog = {
        title,
        subTitle,
        description: quillRef.current.root.innerHTML,
        category,
        isPublished,
        imagePath,
      };
      if (isEditMode) {
        blog.id = blogId;
      }

      const { data } = await axios.post(
        isEditMode ? "/api/blog/update" : "/api/blog/add",
        blog,
      );
      if (data.success) {
        toast.success(data.message);
        if (isEditMode) {
          navigate("/admin/listBlog");
        } else {
          setImage(false);
          setTitle("");
          setSubTitle("");
          quillRef.current.root.innerHTML = "";
          setCategory("Startup");
          setIsPublished(false);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsAdding(false);
    }
  };

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, { theme: "snow" });
    }
  }, []);

  useEffect(() => {
    if (!isEditMode) return;

    const fetchBlog = async () => {
      try {
        const { data } = await axios.get(`/api/blog/${blogId}`);
        if (data.success) {
          const { blog } = data;
          setTitle(blog.title);
          setSubTitle(blog.subTitle);
          setCategory(blog.category);
          setIsPublished(blog.isPublished);
          setImage(blog.image);
          if (quillRef.current) {
            quillRef.current.root.innerHTML = blog.description;
          }
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchBlog();
  }, [isEditMode, blogId, axios]);

  return (
    <form onSubmit={onSubmitHandler} className="flex-1 h-full overflow-scroll">
      <div className="p-4 md:p-10">
        <h1 className="font-serif text-2xl text-ink mb-6">
          {isEditMode ? "Edit Blog" : "Add Blog"}
        </h1>
        <div className="bg-white w-full max-w-3xl p-6 md:p-10 border border-ink/10 rounded-2xl text-gray-600">
          <p className="text-sm font-medium text-ink">Upload Thumbnail</p>
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
              className="mt-2 h-24 rounded-xl border border-ink/10 cursor-pointer object-cover"
            />
            <input
              onChange={(e) => setImage(e.target.files[0])}
              type="file"
              id="image"
              hidden
              required={!isEditMode}
            />
          </label>

          <p className="mt-6 text-sm font-medium text-ink">Blog title</p>
          <input
            type="text"
            placeholder="Type here"
            required
            className="w-full max-w-lg mt-2 p-3 border border-ink/15 rounded-xl outline-none focus:ring-2 focus:ring-primary/40 transition-shadow"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
          <p className="mt-4 text-sm font-medium text-ink">Sub title</p>
          <input
            type="text"
            placeholder="Type here"
            required
            className="w-full max-w-lg mt-2 p-3 border border-ink/15 rounded-xl outline-none focus:ring-2 focus:ring-primary/40 transition-shadow"
            onChange={(e) => setSubTitle(e.target.value)}
            value={subTitle}
          />
          <p className="mt-4 text-sm font-medium text-ink">Blog Description</p>
          <div className="max-w-lg h-74 pb-16 sm:pb-10 pt-2 relative">
            <div ref={editorRef}></div>
            {loading && (
              <div className="absolute right-0 top-0 bottom-0 left-0 flex items-center justify-center bg-black/10 mt-2">
                <div className="w-8 h-8 rounded-full border-2 border-t-white animate-spin"></div>
              </div>
            )}
            <button
              disabled={loading}
              type="button"
              onClick={generateContent}
              className="absolute bottom-1 right-2 ml-2 text-xs text-white bg-ink px-4 py-1.5 rounded-full hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer">
              {loading ? "Generating..." : "Generate with AI"}
            </button>
          </div>
          <p className="mt-4 text-sm font-medium text-ink">Blog category</p>
          <select
            onChange={(e) => setCategory(e.target.value)}
            name="category"
            value={category}
            className="mt-2 px-3 py-2.5 border text-gray-600 border-ink/15 outline-none rounded-xl focus:ring-2 focus:ring-primary/40 transition-shadow">
            <option value="">Select category</option>
            {blogCategories
              .filter((item) => item !== "All")
              .map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
          </select>

          <div className="flex items-center gap-2 mt-5">
            <input
              id="isPublished"
              type="checkbox"
              checked={isPublished}
              className="scale-110 cursor-pointer accent-primary"
              onChange={(e) => setIsPublished(e.target.checked)}
            />
            <label htmlFor="isPublished" className="text-sm cursor-pointer">
              Publish Now
            </label>
          </div>
          <button
            disabled={isAdding}
            type="submit"
            className="mt-8 px-8 py-2.5 bg-primary text-white rounded-full hover:opacity-90 active:scale-[0.98] transition disabled:opacity-60 cursor-pointer text-sm font-medium">
            {isAdding
              ? isEditMode
                ? "Updating..."
                : "Adding..."
              : isEditMode
                ? "Update Blog"
                : "Add Blog"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddBlog;
