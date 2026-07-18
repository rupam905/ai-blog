import { useState } from "react";
import { PenSquare, Bookmark, Info, LogOut, User as UserIcon } from "lucide-react";
import { assets } from "../assets/assets";
import { Avatar, VerifiedBadge } from "./Avatar";
import { useAppContext } from "../context/AppContext";

const Navbar = () => {
  const { navigate, token, user, logoutUser } = useAppContext();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="sticky top-0 z-40 backdrop-blur-md bg-paper/80 border-b border-ink/10">
      <div className="flex justify-between items-center py-4 mx-8 sm:mx-20 xl:mx-32">
        <img
          onClick={() => navigate("/")}
          src={assets.logo}
          alt="navlogo"
          className="w-28 sm:w-36 cursor-pointer transition-opacity hover:opacity-70"
        />

        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => navigate("/about")}
            className="hidden sm:inline-flex items-center text-sm font-medium text-ink hover:text-primary transition-colors cursor-pointer">
            About
          </button>

          <button
            onClick={() => navigate("/write")}
            className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-ink hover:text-primary transition-colors cursor-pointer">
            <PenSquare className="w-4 h-4" />
            Write
          </button>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="cursor-pointer">
                <Avatar
                  src={user.avatar}
                  name={user.name}
                  className="w-9 h-9 text-sm"
                />
              </button>

              {menuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-ink/10 rounded-2xl shadow-lg z-50 overflow-hidden">
                    <div className="p-4 border-b border-ink/10">
                      <div className="flex items-center gap-1.5">
                        <p className="font-medium text-ink text-sm truncate">
                          {user.name}
                        </p>
                        {user.isVerified && <VerifiedBadge />}
                      </div>
                      <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        navigate("/profile");
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">
                      <UserIcon className="w-4 h-4" />
                      Profile
                    </button>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        navigate("/write");
                      }}
                      className="sm:hidden w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">
                      <PenSquare className="w-4 h-4" />
                      Write
                    </button>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        navigate("/about");
                      }}
                      className="sm:hidden w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">
                      <Info className="w-4 h-4" />
                      About
                    </button>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        navigate("/profile#saved");
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">
                      <Bookmark className="w-4 h-4" />
                      Saved posts
                    </button>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        logoutUser();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer">
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate("/auth")}
              className="text-sm font-medium px-5 py-2 rounded-full bg-primary text-white hover:opacity-90 transition cursor-pointer">
              Log in
            </button>
          )}

          <button
            onClick={() => navigate("/admin")}
            className="hidden sm:inline text-xs text-gray-400 hover:text-ink transition-colors cursor-pointer">
            {token ? "Dashboard" : "Admin"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
