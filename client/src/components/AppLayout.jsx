import { BarChart3, FolderKanban, LogOut, Menu, UserRound, X } from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/", label: "Dashboard", icon: BarChart3 },
  { to: "/profile", label: "Profile", icon: UserRound }
];

const AppLayout = () => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-slate-200 bg-white px-5 py-6 transition-transform lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-600 text-white">
              <FolderKanban size={21} />
            </div>
            <div>
              <p className="text-base font-bold">StudyFlow AI</p>
              <p className="text-xs text-slate-500">Project workspace</p>
            </div>
          </div>
          <button className="rounded-lg p-2 hover:bg-slate-100 lg:hidden" onClick={() => setOpen(false)}>
            <X size={18} />
          </button>
        </div>

        <nav className="mt-8 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
                    isActive ? "bg-emerald-50 text-emerald-700" : "text-slate-600 hover:bg-slate-100"
                  }`
                }
              >
                <Icon size={18} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="absolute bottom-6 left-5 right-5">
          <div className="mb-3 flex items-center gap-3 rounded-lg bg-slate-50 p-3">
            <img
              src={user?.avatar || `https://api.dicebear.com/8.x/initials/svg?seed=${user?.name || "Student"}`}
              alt={user?.name}
              className="h-10 w-10 rounded-full border border-slate-200 bg-white"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{user?.name}</p>
              <p className="truncate text-xs text-slate-500">{user?.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="btn-secondary w-full">
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {open && <button className="fixed inset-0 z-30 bg-slate-950/30 lg:hidden" onClick={() => setOpen(false)} />}

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur lg:px-8">
          <div className="flex items-center justify-between">
            <button className="rounded-lg p-2 hover:bg-slate-100 lg:hidden" onClick={() => setOpen(true)}>
              <Menu size={22} />
            </button>
            <div>
              <p className="text-sm font-semibold text-slate-500">Welcome back</p>
              <h1 className="text-xl font-bold text-slate-950">{user?.name || "Student"}</h1>
            </div>
            <img
              src={user?.avatar || `https://api.dicebear.com/8.x/initials/svg?seed=${user?.name || "Student"}`}
              alt={user?.name}
              className="h-10 w-10 rounded-full border border-slate-200 bg-white"
            />
          </div>
        </header>
        <main className="px-4 py-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
