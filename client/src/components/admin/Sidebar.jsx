import { NavLink } from "react-router-dom";
import { LayoutDashboard, SquarePen, Rows3, MessageSquare, Users2 } from "lucide-react";

const navItems = [
  { to: "/admin", end: true, label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/addBlog", label: "Add Blog", icon: SquarePen },
  { to: "/admin/listBlog", label: "List Blog", icon: Rows3 },
  { to: "/admin/comments", label: "Comments", icon: MessageSquare },
  { to: "/admin/users", label: "Users", icon: Users2 },
];

const Sidebar = () => {
  return (
    <div className="flex flex-col gap-1 border-r border-ink/10 min-h-full pt-6 px-2 md:px-4 md:min-w-64 bg-white">
      {navItems.map(({ to, end, label, icon: Icon }) => (
        <NavLink
          key={to}
          end={end}
          to={to}
          className={({ isActive }) =>
            `flex items-center gap-3 py-3 px-3 md:px-5 rounded-full cursor-pointer transition-colors ${
              isActive
                ? "bg-ink text-white"
                : "text-gray-500 hover:bg-gray-100 hover:text-ink"
            }`
          }>
          <Icon className="w-4 h-4 shrink-0" />
          <p className="hidden md:inline-block text-sm font-medium">{label}</p>
        </NavLink>
      ))}
    </div>
  );
};

export default Sidebar;
