import { useEffect, useState } from "react";
import BlogTableItem from "../../components/admin/BlogTableItem";
import Pagination from "../../components/Pagination";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const PAGE_SIZE = 10;

const ListBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { axios, navigate } = useAppContext();

  const fetchBlogs = async (targetPage = page) => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/admin/blogs", {
        params: { page: targetPage, limit: PAGE_SIZE },
      });
      if (data.success) {
        if (data.blogs.length === 0 && targetPage > 1) {
          setPage(targetPage - 1);
          return;
        }
        setBlogs(data.blogs);
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
    fetchBlogs(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <div className="flex-1 p-4 md:p-10">
      <h1 className="font-serif text-2xl text-ink">All Blogs</h1>

      {!loading && blogs.length === 0 ? (
        <div className="max-w-4xl mt-6 flex flex-col items-center justify-center text-center py-16 border border-dashed border-ink/15 rounded-2xl bg-white">
          <p className="font-serif text-lg text-ink mb-2">No blogs yet</p>
          <p className="text-sm text-gray-500 mb-5">
            Create your first post to see it show up here.
          </p>
          <button
            onClick={() => navigate("/admin/addBlog")}
            className="bg-primary text-white text-sm font-medium px-6 py-2.5 rounded-full hover:opacity-90 transition cursor-pointer">
            Add Blog
          </button>
        </div>
      ) : (
        <>
          <div className="relative mt-6 max-w-4xl overflow-x-auto rounded-2xl border border-ink/10 bg-white">
            <table className="w-full text-sm text-gray-500">
              <thead className="text-xs text-gray-500 text-left uppercase border-b border-ink/10">
                <tr>
                  <th scope="col" className="px-4 py-3 xl:px-6">#</th>
                  <th scope="col" className="px-2 py-3">Blog Title</th>
                  <th scope="col" className="px-2 py-3 max-sm:hidden">Date</th>
                  <th scope="col" className="px-2 py-3 max-sm:hidden">Status</th>
                  <th scope="col" className="px-2 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogs.map((blog, index) => (
                  <BlogTableItem
                    key={blog._id}
                    blog={blog}
                    fetchBlogs={() => fetchBlogs(page)}
                    index={(page - 1) * PAGE_SIZE + index + 1}
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

export default ListBlog;
