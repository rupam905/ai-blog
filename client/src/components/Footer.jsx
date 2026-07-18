import { Link } from "react-router-dom";
import { assets, footer_data } from "../assets/assets";

const Footer = () => {
  return (
    <footer className="mt-16 px-8 sm:px-16 xl:px-24 bg-gray-50 border-t border-ink/10">
      <div className="flex flex-col md:flex-row items-start justify-between gap-10 py-14">
        <div className="max-w-sm">
          <img src={assets.logo} alt="logo" className="w-32 sm:w-36" />
          <p className="mt-5 text-sm text-gray-500 leading-relaxed">
            A modern blogging platform where creativity meets intelligence.
            Write and publish your own stories, or use AI assistance to draft
            high-quality content in seconds.
          </p>
        </div>
        <div className="flex flex-wrap justify-between w-full md:w-[50%] gap-8">
          {footer_data.map((section, index) => (
            <div key={index}>
              <h3 className="font-medium text-sm text-ink mb-4 tracking-wide uppercase">
                {section.title}
              </h3>
              <ul className="text-sm space-y-2.5 text-gray-500">
                {section.links.map((link) => (
                  <li key={link.label}>
                    {link.to.startsWith("/") ? (
                      <Link to={link.to} className="hover:text-ink transition-colors">
                        {link.label}
                      </Link>
                    ) : (
                      <a href={link.to} className="hover:text-ink transition-colors">
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="py-5 border-t border-ink/10 flex flex-col-reverse sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
        <p>© 2026 QuickBlog by Rupam. All rights reserved.</p>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="hover:text-ink transition-colors cursor-pointer">
          Back to top ↑
        </button>
      </div>
    </footer>
  );
};

export default Footer;
