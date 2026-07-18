import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Camera, Pencil, Trash2 } from "lucide-react";
import Moment from "moment";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BlogCard from "../components/BlogCard";
import Loader from "../components/Loader";
import { Avatar, VerifiedBadge } from "../components/Avatar";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Profile = () => {
  const { id } = useParams();
  const location = useLocation();
  const { axios, user, setUser, navigate, authLoading, confirm } = useAppContext();

  const [profile, setProfile] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(location.hash === "#saved" ? "bookmarks" : "posts");
  const [bookmarks, setBookmarks] = useState([]);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [followBusy, setFollowBusy] = useState(false);

  const profileId = id || user?._id;
  const isOwnProfile = user && profileId === user._id;

  const fetchProfile = async () => {
    if (!profileId) return;
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/user/${profileId}`);
      if (data.success) {
        setProfile(data.user);
        setBlogs(data.blogs);
        setName(data.user.name);
        setBio(data.user.bio || "");
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
    if (!id && authLoading) return; // still resolving own-profile auth state
    if (!id && !user) {
      navigate("/auth");
      return;
    }
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, profileId, authLoading]);

  const fetchBookmarks = async () => {
    try {
      const { data } = await axios.get("/api/user/bookmarks");
      if (data.success) setBookmarks(data.blogs);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (isOwnProfile && tab === "bookmarks") fetchBookmarks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, isOwnProfile]);

  const handleFollow = async () => {
    try {
      setFollowBusy(true);
      const { data } = await axios.post(`/api/user/follow/${profileId}`);
      if (data.success) {
        setProfile((p) => ({
          ...p,
          isFollowing: data.following,
          followersCount: data.followersCount,
        }));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setFollowBusy(false);
    }
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("bio", bio);
      if (avatarFile) formData.append("avatar", avatarFile);

      const { data } = await axios.put("/api/user/profile", formData);
      if (data.success) {
        setUser(data.user);
        setProfile((p) => ({ ...p, ...data.user }));
        toast.success("Profile updated");
        setEditing(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const deletePost = async (blogId) => {
    const ok = await confirm({
      title: "Delete this post?",
      message: "This can't be undone.",
      confirmLabel: "Delete",
      danger: true,
    });
    if (!ok) return;
    try {
      const { data } = await axios.delete(`/api/user/blogs/${blogId}`);
      if (data.success) {
        toast.success(data.message);
        setBlogs((b) => b.filter((blog) => blog._id !== blogId));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading || !profile) return <Loader />;

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 sm:px-10 pt-12 pb-20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-8 border-b border-ink/10">
          <Avatar src={profile.avatar} name={profile.name} />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl text-ink">{profile.name}</h1>
              {profile.isVerified && <VerifiedBadge className="w-5 h-5" />}
            </div>
            {profile.bio && (
              <p className="text-sm text-gray-500 mt-2 max-w-lg">{profile.bio}</p>
            )}
            <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
              <span>
                <span className="font-medium text-ink">{profile.followersCount}</span>{" "}
                followers
              </span>
              <span>
                <span className="font-medium text-ink">{profile.followingCount}</span>{" "}
                following
              </span>
              <span>Joined {Moment(profile.createdAt).format("MMM YYYY")}</span>
            </div>
          </div>

          {isOwnProfile ? (
            <button
              onClick={() => setEditing((v) => !v)}
              className="inline-flex items-center gap-2 text-sm font-medium px-5 py-2 rounded-full border border-ink/15 text-ink hover:bg-ink hover:text-white transition-colors cursor-pointer">
              <Pencil className="w-3.5 h-3.5" />
              {editing ? "Cancel" : "Edit profile"}
            </button>
          ) : (
            user && (
              <button
                onClick={handleFollow}
                disabled={followBusy}
                className={`text-sm font-medium px-6 py-2 rounded-full transition-colors cursor-pointer disabled:opacity-60 ${
                  profile.isFollowing
                    ? "border border-ink/15 text-ink hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                    : "bg-primary text-white hover:opacity-90"
                }`}>
                {profile.isFollowing ? "Following" : "Follow"}
              </button>
            )
          )}
        </div>

        {editing && isOwnProfile && (
          <form
            onSubmit={saveProfile}
            className="mt-8 p-6 border border-ink/10 rounded-2xl bg-gray-50 flex flex-col gap-4 max-w-lg">
            <div>
              <p className="text-sm text-gray-600 mb-1.5">Avatar</p>
              <label htmlFor="profile-avatar" className="relative inline-block cursor-pointer group w-fit">
                <Avatar
                  src={avatarFile ? URL.createObjectURL(avatarFile) : profile.avatar}
                  name={name}
                  className="w-20 h-20 text-2xl"
                />
                <span className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-ink text-white flex items-center justify-center border-2 border-gray-50 group-hover:bg-primary transition-colors">
                  <Camera className="w-3.5 h-3.5" />
                </span>
              </label>
              <input
                id="profile-avatar"
                type="file"
                accept="image/*"
                onChange={(e) => setAvatarFile(e.target.files[0])}
                hidden
              />
            </div>
            <div>
              <label htmlFor="profile-name" className="block text-sm text-gray-600 mb-1.5">
                Name
              </label>
              <input
                id="profile-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full p-3 border border-ink/15 rounded-xl outline-none focus:ring-2 focus:ring-primary/40 transition-shadow bg-white"
              />
            </div>
            <div>
              <label htmlFor="profile-bio" className="block text-sm text-gray-600 mb-1.5">
                Bio
              </label>
              <textarea
                id="profile-bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell readers about yourself"
                className="w-full p-3 border border-ink/15 rounded-xl outline-none focus:ring-2 focus:ring-primary/40 transition-shadow h-24 bg-white"
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="self-start bg-primary text-white rounded-full px-6 py-2 text-sm font-medium hover:opacity-90 transition disabled:opacity-60 cursor-pointer">
              {saving ? "Saving..." : "Save changes"}
            </button>
          </form>
        )}

        <div className="flex gap-1 p-1 mt-8 rounded-full border border-ink/10 bg-white w-fit">
          <button
            onClick={() => setTab("posts")}
            className={`px-4 py-1.5 text-sm font-medium rounded-full cursor-pointer transition-colors ${
              tab === "posts" ? "bg-ink text-white" : "text-gray-500 hover:text-ink"
            }`}>
            Posts
          </button>
          {isOwnProfile && (
            <button
              onClick={() => setTab("bookmarks")}
              className={`px-4 py-1.5 text-sm font-medium rounded-full cursor-pointer transition-colors ${
                tab === "bookmarks" ? "bg-ink text-white" : "text-gray-500 hover:text-ink"
              }`}>
              Saved
            </button>
          )}
        </div>

        <div className="mt-6">
          {tab === "posts" ? (
            blogs.length === 0 ? (
              <p className="text-sm text-gray-500 border border-dashed border-ink/15 rounded-2xl py-12 text-center">
                No posts published yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.map((blog) => (
                  <div key={blog._id} className="relative group/card">
                    <BlogCard blog={blog} />
                    {isOwnProfile && (
                      <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover/card:opacity-100 transition-opacity">
                        <button
                          onClick={() => navigate(`/write/${blog._id}`)}
                          aria-label="Edit post"
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm border border-ink/10 text-ink hover:bg-ink hover:text-white transition-colors cursor-pointer">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deletePost(blog._id)}
                          aria-label="Delete post"
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm border border-ink/10 text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )
          ) : bookmarks.length === 0 ? (
            <p className="text-sm text-gray-500 border border-dashed border-ink/15 rounded-2xl py-12 text-center">
              Nothing saved yet. Bookmark a post to read later.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookmarks.map((blog) => (
                <BlogCard key={blog._id} blog={blog} />
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
