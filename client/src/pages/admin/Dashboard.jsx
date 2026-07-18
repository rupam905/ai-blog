import { useEffect, useState } from "react";
import { FileText, MessageSquare, PenLine, Newspaper, Users2 } from "lucide-react";
import BlogTableItem from "../../components/admin/BlogTableItem";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const StatCard = ({ icon: Icon, value, label }) => (
  <div className="flex items-center gap-4 bg-white p-5 min-w-56 flex-1 rounded-2xl border border-ink/10 hover:shadow-md transition-shadow">
    <div className="w-12 h-12 shrink-0 rounded-full bg-primary/10 text-primary flex items-center justify-center">
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <p className="text-2xl font-serif text-ink leading-none">{value}</p>
      <p className="text-gray-500 text-sm mt-1">{label}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    blogs: 0,
    comments: 0,
    drafts: 0,
    users: 0,
    recentBlogs: [],
  });
  const [loading, setLoading] = useState(true);

  const { axios, navigate } = useAppContext();

  const fetchDashboard = async () => {
    try {
      const { data } = await axios.get("/api/admin/dashboard");
      data.success
        ? setDashboardData(data.dashboardData)
        : toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <div className="flex-1 p-4 md:p-10">
      <div>
        <h1 className="font-serif text-2xl text-ink">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          An overview of your blog's activity.
        </p>
      </div>

      <div className="flex flex-wrap gap-4 mt-6">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 bg-white p-5 min-w-56 flex-1 rounded-2xl border border-ink/10 animate-pulse">
              <div className="w-12 h-12 rounded-full bg-gray-100" />
              <div className="flex-1">
                <div className="h-5 w-10 bg-gray-100 rounded mb-2" />
                <div className="h-3 w-16 bg-gray-100 rounded" />
              </div>
            </div>
          ))
        ) : (
          <>
            <StatCard icon={FileText} value={dashboardData.blogs} label="Blogs" />
            <StatCard icon={MessageSquare} value={dashboardData.comments} label="Comments" />
            <StatCard icon={PenLine} value={dashboardData.drafts} label="Drafts" />
            <StatCard icon={Users2} value={dashboardData.users} label="Users" />
          </>
        )}
      </div>

      <div className="mt-10">
        <div className="flex items-center gap-2 mb-4 text-ink">
          <Newspaper className="w-4 h-4" />
          <p className="font-medium">Latest Blogs</p>
        </div>

        {!loading && dashboardData.recentBlogs.length === 0 ? (
          <div className="max-w-4xl flex flex-col items-center justify-center text-center py-16 border border-dashed border-ink/15 rounded-2xl bg-white">
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
          <div className="relative max-w-4xl overflow-x-auto rounded-2xl border border-ink/10 bg-white">
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
                {dashboardData.recentBlogs.map((blog, index) => (
                  <BlogTableItem
                    key={blog._id}
                    blog={blog}
                    fetchBlogs={fetchDashboard}
                    index={index + 1}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
