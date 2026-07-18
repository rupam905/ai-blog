import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Bookmark, Heart } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BlogCard from "../components/BlogCard";
import { Avatar, VerifiedBadge } from "../components/Avatar";
import Moment from "moment";
import Loader from "../components/Loader";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const getReadingTime = (html) => {
  const text = html.replace(/<[^>]*>/g, " ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
};

const Blog = () => {
  const { id } = useParams();
  const { axios, blogs, user, navigate } = useAppContext();

  const [data, setData] = useState(null);
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [liked, setLiked] = useState(false);

  const fetchBlogData = async () => {
    try {
      const { data } = await axios.get(`/api/blog/${id}`);
      if (data.success) {
        setData(data.blog);
        setLikesCount(data.blog.likes?.length || 0);
        setLiked(user ? data.blog.likes?.includes(user._id) : false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchComments = async () => {
    try {
      const { data } = await axios.post("/api/blog/comments", { blogId: id });
      if (data.success) {
        setComments(data.comments);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const addComment = async (e) => {
    e.preventDefault();
    if (!e.currentTarget.checkValidity()) {
      toast.error("Please write a comment before posting");
      return;
    }
    try {
      setSubmitting(true);
      const { data } = await axios.post("/api/blog/add-comment", {
        blog: id,
        content,
      });
      if (data.success) {
        toast.success("Comment posted");
        setContent("");
        fetchComments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleLike = async () => {
    if (!user) return toast.error("Log in to like posts");
    try {
      const { data } = await axios.post(`/api/blog/${id}/like`);
      if (data.success) {
        setLiked(data.liked);
        setLikesCount(data.likesCount);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const toggleBookmark = async () => {
    if (!user) return toast.error("Log in to save posts");
    try {
      const { data } = await axios.post(`/api/user/bookmark/${id}`);
      if (data.success) setBookmarked(data.bookmarked);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchBlogData();
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user]);

  useEffect(() => {
    if (!user) return setBookmarked(false);
    axios
      .get("/api/user/bookmarks")
      .then(({ data }) => {
        if (data.success) setBookmarked(data.blogs.some((b) => b._id === id));
      })
      .catch(() => {});
  }, [id, user, axios]);

  useEffect(() => {
    const onScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? Math.min(100, (window.scrollY / docHeight) * 100) : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [data]);

  const moreStories = (() => {
    if (!data) return [];
    const sameCategory = blogs.filter(
      (b) => b._id !== data._id && b.category === data.category,
    );
    const rest = blogs.filter(
      (b) => b._id !== data._id && b.category !== data.category,
    );
    return [...sameCategory, ...rest].slice(0, 3);
  })();

  const author = data?.author;
  const goToAuthor = () => author && navigate(`/author/${author._id}`);

  return data ? (
    <div className="relative">
      <div
        className="fixed top-0 left-0 h-[3px] bg-primary z-50 transition-[width] duration-150"
        style={{ width: `${progress}%` }}
      />
      <Navbar />

      {/* Hero */}
      <div className="relative h-[52vh] min-h-[360px] max-h-[560px] w-full overflow-hidden bg-ink">
        <img
          src={data.image}
          alt={data.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />

        <Link
          to="/"
          className="absolute top-6 left-6 sm:left-10 inline-flex items-center gap-2 text-sm text-white/90 hover:text-white bg-black/30 hover:bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to stories
        </Link>

        <div className="absolute bottom-0 inset-x-0 px-6 sm:px-10 pb-10 sm:pb-14 max-w-4xl mx-auto text-white">
          <div className="flex items-center gap-3 text-xs mb-4">
            <span className="px-3 py-1 rounded-full bg-white text-ink font-medium">
              {data.category}
            </span>
            <span className="text-white/70">
              {Moment(data.createdAt).format("MMMM D, YYYY")} · {getReadingTime(data.description)} min read
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl leading-tight max-w-3xl">
            {data.title}
          </h1>
          {data.subTitle && (
            <h2 className="mt-4 max-w-xl text-white/80 line-clamp-2 font-normal text-base sm:text-lg">
              {data.subTitle}
            </h2>
          )}
          <button
            onClick={goToAuthor}
            disabled={!author}
            className="mt-6 inline-flex items-center gap-2 py-1.5 px-4 rounded-full border border-white/25 bg-white/10 backdrop-blur-sm text-sm font-medium cursor-pointer">
            <Avatar src={author?.avatar} name={author?.name || "QuickBlog Team"} className="w-6 h-6 text-[10px]" />
            {author?.name || "QuickBlog Team"}
            {author?.isVerified && <VerifiedBadge className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-5xl mx-auto px-6 sm:px-10">
        <div className="py-10 sm:py-14">
          <div
            className="rich-text max-w-3xl"
            dangerouslySetInnerHTML={{ __html: data.description }}></div>

          {/* like + bookmark */}
          <div className="flex items-center gap-3 mt-10 max-w-3xl">
            <button
              onClick={toggleLike}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-colors cursor-pointer ${
                liked
                  ? "bg-red-50 border-red-200 text-red-600"
                  : "border-ink/15 text-ink hover:bg-gray-50"
              }`}>
              <Heart className={`w-4 h-4 ${liked ? "fill-red-600" : ""}`} />
              {likesCount}
            </button>
            <button
              onClick={toggleBookmark}
              aria-label="Save post"
              className={`inline-flex items-center justify-center w-10 h-10 rounded-full border transition-colors cursor-pointer ${
                bookmarked
                  ? "bg-primary/10 border-primary/30 text-primary"
                  : "border-ink/15 text-ink hover:bg-gray-50"
              }`}>
              <Bookmark className={`w-4 h-4 ${bookmarked ? "fill-primary" : ""}`} />
            </button>
          </div>

          {/* author bio */}
          <button
            onClick={goToAuthor}
            disabled={!author}
            className="mt-10 max-w-3xl flex items-center gap-4 p-6 rounded-2xl border border-ink/10 bg-gray-50 text-left w-full cursor-pointer">
            <Avatar src={author?.avatar} name={author?.name || "QuickBlog Team"} className="w-14 h-14 text-lg" />
            <div>
              <div className="flex items-center gap-1.5">
                <p className="font-medium text-ink">{author?.name || "QuickBlog Team"}</p>
                {author?.isVerified && <VerifiedBadge />}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {author
                  ? author.bio || "Hasn't written a bio yet."
                  : "The editorial team behind QuickBlog, curating stories on technology, startups and life."}
              </p>
            </div>
          </button>

          {/* comment section */}
          <div className="mt-16 mb-10 max-w-3xl">
            <p className="font-serif text-xl text-ink mb-6">
              Comments ({comments.length})
            </p>
            <div className="flex flex-col gap-4">
              {comments.length === 0 && (
                <p className="text-sm text-gray-500 border border-dashed border-ink/15 rounded-2xl py-8 text-center">
                  No comments yet — be the first to share your thoughts.
                </p>
              )}
              {comments.map((item) => (
                <div
                  key={item._id}
                  className="relative bg-white border border-ink/10 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar
                      src={item.author?.avatar}
                      name={item.name}
                      className="w-6 h-6 text-[10px]"
                    />
                    <p className="font-medium text-ink text-sm">{item.name}</p>
                    {item.author?.isVerified && <VerifiedBadge className="w-3.5 h-3.5" />}
                  </div>
                  <p className="text-sm text-gray-600 ml-8">{item.content}</p>
                  <div className="absolute right-4 bottom-3 text-xs text-gray-400">
                    {Moment(item.createdAt).fromNow()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* add comment section */}
          <div className="max-w-3xl">
            {user ? (
              <>
                <p className="font-serif text-xl text-ink mb-6">Add your comment</p>
                <form onSubmit={addComment} noValidate className="flex flex-col gap-4 max-w-lg">
                  <div>
                    <label htmlFor="comment-content" className="block text-sm text-gray-600 mb-1.5">
                      Comment as {user.name}
                    </label>
                    <textarea
                      id="comment-content"
                      onChange={(e) => setContent(e.target.value)}
                      value={content}
                      placeholder="Share your thoughts..."
                      required
                      className="w-full p-3 border border-ink/15 rounded-xl outline-none focus:ring-2 focus:ring-primary/40 transition-shadow h-32"></textarea>
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="self-start bg-primary text-white rounded-full px-8 py-2.5 text-sm font-medium hover:opacity-90 active:scale-[0.98] transition disabled:opacity-60 cursor-pointer">
                    {submitting ? "Posting..." : "Post comment"}
                  </button>
                </form>
              </>
            ) : (
              <div className="border border-dashed border-ink/15 rounded-2xl py-8 text-center">
                <p className="text-sm text-gray-500 mb-3">
                  Log in to join the discussion.
                </p>
                <Link
                  to="/auth"
                  className="inline-block bg-primary text-white rounded-full px-6 py-2 text-sm font-medium hover:opacity-90 transition">
                  Log in
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* more stories */}
      {moreStories.length > 0 && (
        <div className="max-w-5xl mx-auto px-6 sm:px-10 mt-4 mb-24">
          <p className="text-xs font-medium tracking-widest uppercase text-primary mb-2">
            Keep reading
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl text-ink mb-8">
            More stories
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {moreStories.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        </div>
      )}

      <Footer />
    </div>
  ) : (
    <Loader />
  );
};

export default Blog;
