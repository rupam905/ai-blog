import { ChevronLeft, ChevronRight } from "lucide-react";

const getPageNumbers = (page, totalPages) => {
  const pages = [];
  const windowSize = 1;
  const start = Math.max(2, page - windowSize);
  const end = Math.min(totalPages - 1, page + windowSize);

  pages.push(1);
  if (start > 2) pages.push("…");
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < totalPages - 1) pages.push("…");
  if (totalPages > 1) pages.push(totalPages);

  return pages;
};

const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-1.5 mt-8">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
        className="w-9 h-9 flex items-center justify-center rounded-full border border-ink/15 text-ink hover:bg-ink hover:text-white transition-colors cursor-pointer disabled:opacity-40 disabled:pointer-events-none">
        <ChevronLeft className="w-4 h-4" />
      </button>

      {getPageNumbers(page, totalPages).map((p, i) =>
        p === "…" ? (
          <span key={`ellipsis-${i}`} className="w-9 h-9 flex items-center justify-center text-sm text-gray-400">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            aria-current={p === page ? "page" : undefined}
            className={`w-9 h-9 flex items-center justify-center rounded-full text-sm font-medium transition-colors cursor-pointer ${
              p === page
                ? "bg-ink text-white"
                : "text-gray-500 hover:bg-gray-100 hover:text-ink"
            }`}>
            {p}
          </button>
        ),
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
        className="w-9 h-9 flex items-center justify-center rounded-full border border-ink/15 text-ink hover:bg-ink hover:text-white transition-colors cursor-pointer disabled:opacity-40 disabled:pointer-events-none">
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Pagination;
