import toast from "react-hot-toast";
import { Check, Trash2 } from "lucide-react";
import { useAppContext } from "../../context/AppContext";

const CommentTableItem = ({ comment, fetchComments }) => {
  const { blog, createdAt, _id } = comment;
  const BlogDate = new Date(createdAt);

  const { axios, confirm } = useAppContext();

  const approveComment = async () => {
    try {
      const { data } = await axios.post("/api/admin/approve-comment", {
        id: _id,
      });
      if (data.success) {
        toast.success(data.message);
        fetchComments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteComment = async () => {
    try {
      const ok = await confirm({
        title: "Delete this comment?",
        message: "This can't be undone.",
        confirmLabel: "Delete",
        danger: true,
      });
      if (!ok) return;
      const { data } = await axios.post("/api/admin/delete-comment", {
        id: _id,
      });
      if (data.success) {
        toast.success(data.message);
        fetchComments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <tr className="border-b border-ink/10 last:border-b-0 hover:bg-gray-50/60 transition-colors">
      <td className="px-6 py-4 align-top">
        <p className="text-ink font-medium mb-2">{blog.title}</p>
        <p className="text-sm">
          <span className="font-medium text-gray-600">{comment.name}</span>
          <span className="text-gray-400"> — </span>
          {comment.content}
        </p>
      </td>
      <td className="px-6 py-4 max-sm:hidden align-top whitespace-nowrap">
        {BlogDate.toLocaleDateString()}
      </td>
      <td className="px-6 py-4 align-top">
        <div className="flex items-center gap-2">
          {!comment.isApproved ? (
            <button
              onClick={approveComment}
              aria-label="Approve comment"
              className="w-8 h-8 flex items-center justify-center rounded-full border border-ink/15 text-ink hover:bg-green-600 hover:text-white hover:border-green-600 transition-colors cursor-pointer">
              <Check className="w-4 h-4" />
            </button>
          ) : (
            <span className="text-xs font-medium border border-green-600 bg-green-50 text-green-600 rounded-full px-3 py-1">
              Approved
            </span>
          )}
          <button
            onClick={deleteComment}
            aria-label="Delete comment"
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default CommentTableItem;
