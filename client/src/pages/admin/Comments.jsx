import { useEffect, useState } from "react";
import { motion } from "motion/react";
import CommentTableItem from "../../components/admin/CommentTableItem";
import Pagination from "../../components/Pagination";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const filters = [
  { label: "Approved", value: "approved" },
  { label: "Not Approved", value: "not-approved" },
];
const PAGE_SIZE = 10;

const Comments = () => {
  const [comments, setComments] = useState([]);
  const [filter, setFilter] = useState("approved");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { axios } = useAppContext();

  const fetchComments = async (targetFilter = filter, targetPage = page) => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/admin/comments", {
        params: { status: targetFilter, page: targetPage, limit: PAGE_SIZE },
      });
      if (data.success) {
        if (data.comments.length === 0 && targetPage > 1) {
          setPage(targetPage - 1);
          return;
        }
        setComments(data.comments);
        setTotalPages(data.pagination.totalPages);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments(filter, page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, page]);

  const changeFilter = (value) => {
    setFilter(value);
    setPage(1);
  };

  const filterLabel = filters.find((f) => f.value === filter)?.label || "";

  return (
    <div className="flex-1 p-4 md:p-10">
      <div className="flex flex-wrap items-center justify-between gap-4 max-w-3xl">
        <h1 className="font-serif text-2xl text-ink">Comments</h1>
        <div className="inline-flex gap-1 p-1 rounded-full border border-ink/10 bg-white">
          {filters.map((item) => (
            <button
              key={item.value}
              onClick={() => changeFilter(item.value)}
              className={`relative isolate px-4 py-1.5 text-xs font-medium rounded-full cursor-pointer transition-colors ${
                filter === item.value ? "text-white" : "text-gray-500 hover:text-ink"
              }`}>
              {filter === item.value && (
                <motion.div
                  layoutId="comment-filter-pill"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="absolute inset-0 -z-10 bg-ink rounded-full"
                />
              )}
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {!loading && comments.length === 0 ? (
        <div className="max-w-3xl mt-6 flex flex-col items-center justify-center text-center py-16 border border-dashed border-ink/15 rounded-2xl bg-white">
          <p className="font-serif text-lg text-ink mb-2">
            No {filterLabel.toLowerCase()} comments
          </p>
          <p className="text-sm text-gray-500">
            {filter === "approved"
              ? "Approved comments will show up here."
              : "You're all caught up — nothing pending review."}
          </p>
        </div>
      ) : (
        <>
          <div className="relative max-w-3xl overflow-x-auto mt-6 rounded-2xl border border-ink/10 bg-white">
            <table className="w-full text-sm text-gray-500">
              <thead className="text-xs text-gray-500 text-left uppercase border-b border-ink/10">
                <tr>
                  <th scope="col" className="px-6 py-3">Blog Title & Comment</th>
                  <th scope="col" className="px-6 py-3 max-sm:hidden">Date</th>
                  <th scope="col" className="px-6 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {comments.map((comment, index) => (
                  <CommentTableItem
                    key={comment._id}
                    comment={comment}
                    index={index + 1}
                    fetchComments={() => fetchComments(filter, page)}
                  />
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
};

export default Comments;
