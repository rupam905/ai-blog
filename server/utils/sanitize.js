import sanitizeHtml from "sanitize-html";

// Matches the formatting Quill's editor actually produces, nothing more.
// Strips <script>, event handler attributes (onerror, onclick, ...),
// javascript: URLs, iframes, styles, etc.
export const sanitizeBlogHtml = (html) =>
  sanitizeHtml(html || "", {
    allowedTags: [
      "p", "br", "strong", "b", "em", "i", "u", "s", "strike",
      "h1", "h2", "h3", "h4", "h5", "h6",
      "ol", "ul", "li",
      "a", "img",
      "blockquote", "code", "pre", "span",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt", "width", "height"],
      li: ["data-list"],
      span: ["class", "contenteditable"],
      "*": ["class"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }),
    },
  });
