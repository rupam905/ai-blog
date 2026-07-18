import { useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { Search, ArrowRight } from "lucide-react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import Moment from "moment";

const Header = () => {
  const { setInput, input, blogs } = useAppContext();
  const inputRef = useRef();

  // Pick once per page load (not on every re-render, e.g. while typing
  // in the search box) so the featured post doesn't flicker mid-visit.
  const featured = useMemo(() => {
    if (!blogs.length) return null;
    return blogs[Math.floor(Math.random() * blogs.length)];
  }, [blogs]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setInput(inputRef.current.value);
  };

  const onClear = () => {
    setInput("");
    inputRef.current.value = "";
  };

  return (
    <div className="relative overflow-hidden">
      <img
        src={assets.gradientBackground}
        alt=""
        className="absolute -top-32 left-1/2 -translate-x-1/2 -z-10 w-[1200px] max-w-none opacity-40"
      />

      <div className="mx-8 sm:mx-16 xl:mx-24 pt-14 pb-20 sm:pt-20 sm:pb-24">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-center">
          {/* Left: headline + search */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 border border-primary/30 bg-primary/10 rounded-full text-xs font-medium tracking-wide uppercase text-primary">
              <img src={assets.star_icon} alt="" className="w-2.5" />
              New AI writing assistant
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl leading-[1.05] text-ink">
              Stories worth
              <br />
              <span className="italic text-primary">your time.</span>
            </h1>

            <p className="mt-6 max-w-md text-gray-500 text-sm sm:text-base leading-relaxed">
              A space for ideas, essays and field notes on technology,
              startups and everyday life — written by people, sharpened by
              AI.
            </p>

            <form
              onSubmit={onSubmitHandler}
              className="mt-8 flex items-center max-w-md border border-ink/15 bg-white rounded-full overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-primary/40 transition-shadow">
              <Search className="w-4 h-4 ml-4 text-gray-400 shrink-0" />
              <input
                ref={inputRef}
                id="search-blogs"
                type="text"
                placeholder="Search stories, topics..."
                className="w-full px-3 py-3 text-sm outline-none bg-transparent"
              />
              <button
                type="submit"
                className="bg-primary text-white text-sm font-medium px-6 py-3 m-1 rounded-full hover:opacity-90 active:scale-[0.98] transition cursor-pointer">
                Search
              </button>
            </form>

            {input && (
              <button
                onClick={onClear}
                className="mt-3 text-xs text-gray-500 hover:text-ink underline underline-offset-2 cursor-pointer">
                Clear search — “{input}”
              </button>
            )}
          </div>

          {/* Right: featured post */}
          {featured && (
            <Link
              to={`/blog/${featured._id}`}
              className="group block rounded-3xl border border-ink/10 bg-white shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              <div className="aspect-video w-full overflow-hidden">
                <img
                  src={featured.image}
                  alt={featured.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
                    {featured.category}
                  </span>
                  <span>{Moment(featured.createdAt).format("MMM D, YYYY")}</span>
                </div>
                <h3 className="font-serif text-xl text-ink mb-2 leading-snug">
                  {featured.title}
                </h3>
                <p
                  className="text-sm text-gray-500 line-clamp-2"
                  dangerouslySetInnerHTML={{
                    __html: featured.description.slice(0, 120),
                  }}
                />
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink">
                  Read story
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
