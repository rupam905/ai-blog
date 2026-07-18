import { useEffect, useState } from "react";
import { BadgeCheck } from "lucide-react";
import Moment from "moment";
import { Avatar } from "../../components/Avatar";
import Pagination from "../../components/Pagination";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const PAGE_SIZE = 10;

const Users = () => {
  const { axios } = useAppContext();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = async (targetPage = page) => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/admin/users", {
        params: { page: targetPage, limit: PAGE_SIZE },
      });
      if (data.success) {
        setUsers(data.users);
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
    fetchUsers(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const toggleVerify = async (id) => {
    try {
      const { data } = await axios.post("/api/admin/toggle-verify-user", { id });
      if (data.success) {
        toast.success(data.message);
        setUsers((prev) =>
          prev.map((u) => (u._id === id ? { ...u, isVerified: !u.isVerified } : u)),
        );
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex-1 p-4 md:p-10">
      <h1 className="font-serif text-2xl text-ink">Users</h1>
      <p className="text-sm text-gray-500 mt-1">
        Grant the verified badge to trusted authors.
      </p>

      {!loading && users.length === 0 ? (
        <div className="max-w-4xl mt-6 flex flex-col items-center justify-center text-center py-16 border border-dashed border-ink/15 rounded-2xl bg-white">
          <p className="font-serif text-lg text-ink mb-2">No users yet</p>
          <p className="text-sm text-gray-500">
            Registered readers and writers will show up here.
          </p>
        </div>
      ) : (
        <>
          <div className="relative mt-6 max-w-4xl overflow-x-auto rounded-2xl border border-ink/10 bg-white">
            <table className="w-full text-sm text-gray-500">
              <thead className="text-xs text-gray-500 text-left uppercase border-b border-ink/10">
                <tr>
                  <th scope="col" className="px-4 py-3 xl:px-6">#</th>
                  <th scope="col" className="px-2 py-3">User</th>
                  <th scope="col" className="px-2 py-3 max-sm:hidden">Joined</th>
                  <th scope="col" className="px-2 py-3 max-sm:hidden">Followers</th>
                  <th scope="col" className="px-2 py-3">Verified</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, index) => (
                  <tr
                    key={u._id}
                    className="border-b border-ink/10 last:border-b-0 hover:bg-gray-50/60 transition-colors">
                    <th className="px-4 py-4 xl:px-6 font-normal text-gray-400">
                      {(page - 1) * PAGE_SIZE + index + 1}
                    </th>
                    <td className="px-2 py-4">
                      <div className="flex items-center gap-2.5">
                        <Avatar src={u.avatar} name={u.name} className="w-8 h-8 text-xs" />
                        <div className="min-w-0">
                          <p className="text-ink font-medium truncate">{u.name}</p>
                          <p className="text-xs text-gray-400 truncate">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-2 py-4 max-sm:hidden">
                      {Moment(u.createdAt).format("MMM D, YYYY")}
                    </td>
                    <td className="px-2 py-4 max-sm:hidden">
                      {u.followers?.length || 0}
                    </td>
                    <td className="px-2 py-4">
                      <button
                        onClick={() => toggleVerify(u._id)}
                        className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-colors cursor-pointer ${
                          u.isVerified
                            ? "border-primary/30 bg-primary/10 text-primary"
                            : "border-ink/15 text-gray-500 hover:bg-ink hover:text-white"
                        }`}>
                        <BadgeCheck className="w-3.5 h-3.5" />
                        {u.isVerified ? "Verified" : "Verify"}
                      </button>
                    </td>
                  </tr>
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

export default Users;
