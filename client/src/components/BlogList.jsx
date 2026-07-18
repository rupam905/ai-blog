import { useEffect, useRef, useState } from "react";
import { blogCategories } from "../assets/assets";
import { motion } from "motion/react";
import BlogCard from "./BlogCard";
import Pagination from "./Pagination";
import { useAppContext } from "../context/AppContext";

const PAGE_SIZE = 8;

const BlogList = () => {
  const [menu, setMenu] = useState("All");
  const [page, setPage] = useState(1);
  const { blogs, input } = useAppContext();
  const isFirstRender = useRef(true);

  useEffect(() => {
    setPage(1);
  }, [menu, input]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    // runs after the new page's content has rendered, so the target
    // position reflects the actual (often shorter) layout
    document
      .getElementById("stories")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [page]);

  const filteredBlogs = () => {
    if (input === "") {
      return blogs;
    }
    const query = input.toLowerCase();
    return blogs.filter(
      (blog) =>
        blog.title.toLowerCase().includes(query) ||
        blog.category.toLowerCase().includes(query),
    );
  };

  const visibleBlogs = filteredBlogs().filter((blog) =>
    menu === "All" ? true : blog.category === menu,
  );
  const totalPages = Math.max(1, Math.ceil(visibleBlogs.length / PAGE_SIZE));
  const pagedBlogs = visibleBlogs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div id="stories" className="mx-8 sm:mx-16 xl:mx-24 pt-4 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
        <div>
          <p className="text-xs font-medium tracking-widest uppercase text-primary mb-2">
            Latest
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl text-ink">
            Fresh off the press
          </h2>
        </div>

        <div className="inline-flex flex-wrap gap-1 p-1 rounded-3xl border border-ink/10 bg-white w-fit">
          {blogCategories.map((item) => (
            <button
              key={item}
              onClick={() => setMenu(item)}
              className={`relative isolate px-4 py-2 text-sm rounded-full cursor-pointer transition-colors ${
                menu === item
                  ? "text-white"
                  : "text-gray-500 hover:text-ink"
              }`}>
              {menu === item && (
                <motion.div
                  layoutId="category-pill"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="absolute inset-0 -z-10 bg-ink rounded-full"
                />
              )}
              {item}
            </button>
          ))}
        </div>
      </div>

      {visibleBlogs.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-24 border border-dashed border-ink/15 rounded-3xl">
          <p className="font-serif text-xl text-ink mb-2">No stories found</p>
          <p className="text-sm text-gray-500 max-w-sm">
            Try a different category or clear your search to see all stories.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {pagedBlogs.map((blog, index) => (
              <motion.div
                key={blog._id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.35, delay: Math.min(index, 8) * 0.05 }}>
                <BlogCard blog={blog} />
              </motion.div>
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
};

export default BlogList;
