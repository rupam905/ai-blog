import { Outlet } from "react-router-dom";
import { LogOut } from "lucide-react";
import { assets } from "../../assets/assets";
import Sidebar from "../../components/admin/Sidebar";
import { useAppContext } from "../../context/AppContext";

const Layout = () => {

  const {axios,setToken, navigate} = useAppContext();
  const logout = () => {
    localStorage.removeItem('token');
    axios.defaults.headers.common['Authorization'] = null;
    setToken(null);
    navigate("/");
  };

  return (
    <div className="bg-paper min-h-screen">
      <div className="flex items-center justify-between h-[70px] px-4 sm:px-8 border-b border-ink/10 bg-white">
        <img
          src={assets.logo}
          alt=""
          className="w-32 sm:w-36 cursor-pointer"
          onClick={() => navigate("/")}
        />
        <button
          onClick={logout}
          className="inline-flex items-center gap-2 text-sm font-medium px-5 py-2 rounded-full border border-ink/15 text-ink hover:bg-ink hover:text-white transition-colors cursor-pointer">
          <LogOut className="w-3.5 h-3.5" />
          Logout
        </button>
      </div>
      <div className="flex min-h-[calc(100vh-70px)]">
        <Sidebar />
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
