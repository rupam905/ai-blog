import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";
import { VerifiedBadge } from "../Avatar";
import { useAppContext } from "../../context/AppContext";

const BlogTableItem = ({ blog, fetchBlogs, index }) => {
  const { title, createdAt, author } = blog;
  const BlogDate = new Date(createdAt);

  const { axios, navigate, confirm } = useAppContext();
  const deleteBlog = async () => {
    const ok = await confirm({
      title: "Delete this blog?",
      message: "This will permanently delete the post and its comments. This can't be undone.",
      confirmLabel: "Delete",
      danger: true,
    });
    if (!ok) return;
    try {
      const { data } = await axios.post("/api/blog/delete", { id: blog._id });
      if (data.success) {
        toast.success(data.message);
        await fetchBlogs();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const togglePublish = async () => {
    try {
      const { data } = await axios.post("/api/blog/toggle-publish", {
        id: blog._id,
      });
      if (data.success) {
        toast.success(data.message);
        await fetchBlogs();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <tr className="border-b border-ink/10 last:border-b-0 hover:bg-gray-50/60 transition-colors">
      <th className="px-4 py-4 xl:px-6 font-normal text-gray-400">{index}</th>
      <td className="px-2 py-4">
        <p className="text-ink font-medium">{title}</p>
        <span className="inline-flex items-center gap-1 text-xs text-gray-400">
          {author?.name || "QuickBlog Team"}
          {author?.isVerified && <VerifiedBadge className="w-3 h-3" />}
        </span>
      </td>
      <td className="px-2 py-4 max-sm:hidden">{BlogDate.toDateString()}</td>
      <td className="px-2 py-4 max-sm:hidden">
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-medium ${
            blog.isPublished ? "text-green-600" : "text-orange-600"
          }`}>
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              blog.isPublished ? "bg-green-600" : "bg-orange-600"
            }`}
          />
          {blog.isPublished ? "Published" : "Unpublished"}
        </span>
      </td>
      <td className="px-2 py-4">
        <div className="flex items-center gap-2">
          <button
            onClick={togglePublish}
            className="text-xs font-medium px-3 py-1.5 rounded-full border border-ink/15 text-ink hover:bg-ink hover:text-white transition-colors cursor-pointer">
            {blog.isPublished ? "Unpublish" : "Publish"}
          </button>
          <button
            onClick={() => navigate(`/admin/editBlog/${blog._id}`)}
            className="text-xs font-medium px-3 py-1.5 rounded-full border border-ink/15 text-ink hover:bg-ink hover:text-white transition-colors cursor-pointer">
            Edit
          </button>
          <button
            onClick={deleteBlog}
            aria-label="Delete blog"
            className="w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default BlogTableItem;
