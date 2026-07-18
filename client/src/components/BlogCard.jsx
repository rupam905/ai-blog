import { useNavigate } from "react-router-dom";
import { ArrowRight, Heart } from "lucide-react";
import Moment from "moment";
import { Avatar, VerifiedBadge } from "./Avatar";

const BlogCard = ({ blog }) => {
  const { title, description, category, image, createdAt, likes, author, _id } = blog;
  const navigate = useNavigate();

  const goToBlog = () => navigate(`/blog/${_id}`);

  const goToAuthor = (e) => {
    e.stopPropagation();
    if (author) navigate(`/author/${author._id}`);
  };

  return (
    <div
      onClick={goToBlog}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          goToBlog();
        }
      }}
      role="link"
      tabIndex={0}
      aria-label={`Read ${title}`}
      className="group w-full rounded-2xl overflow-hidden border border-ink/10 bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50">
      <div className="aspect-video w-full overflow-hidden bg-gray-100">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-5">
        <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
            {category}
          </span>
          <span>{Moment(createdAt).format("MMM D, YYYY")}</span>
        </div>
        <h5 className="font-serif text-lg mb-2 text-ink leading-snug line-clamp-2">
          {title}
        </h5>
        <p
          className="mb-4 text-sm text-gray-500 line-clamp-2"
          dangerouslySetInnerHTML={{ __html: description.slice(0, 100) }}></p>

        <div className="flex items-center justify-between">
          <button
            onClick={goToAuthor}
            disabled={!author}
            className={`flex items-center gap-1.5 min-w-0 ${author ? "cursor-pointer" : "cursor-default"}`}>
            <Avatar
              src={author?.avatar}
              name={author?.name || "QuickBlog Team"}
              className="w-6 h-6 text-[10px]"
            />
            <span className="text-xs text-gray-500 truncate max-w-[7rem]">
              {author?.name || "QuickBlog Team"}
            </span>
            {author?.isVerified && <VerifiedBadge className="w-3.5 h-3.5" />}
          </button>

          <div className="flex items-center gap-3 shrink-0">
            {likes?.length > 0 && (
              <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                <Heart className="w-3.5 h-3.5" />
                {likes.length}
              </span>
            )}
            <span className="inline-flex items-center gap-1 text-sm font-medium text-ink">
              Read
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
