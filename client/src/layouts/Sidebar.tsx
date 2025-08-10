import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { BarChart2, Pencil, BookMarked, LogOut, Sparkle, Menu, X } from "lucide-react";
import Logo from "/logo.svg";

const Sidebar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <>
      {/* Hamburger Button - Mobile only. Only show when sidebar is closed */}
      {!isOpen && (
        <button
          aria-label="Open menu"
          className="md:hidden fixed top-4 left-4 z-50 p-2 rounded bg-yellow-700 text-white shadow-sm focus:outline-none"
          onClick={() => setIsOpen(true)}
        >
          <Menu size={22} />
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-yellow-700 text-slate-200 p-5 flex flex-col transform transition-transform duration-300 z-40
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Header: logo + title + mobile close */}
        <div className="flex items-center justify-between gap-2 mb-4 pt-4 md:pt-0">
          <div className="flex items-center gap-2">
            <img src={Logo} alt="edutrack logo" className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8" />
            <h1 className="text-base sm:text-lg md:text-2xl lg:text-3xl font-semibold leading-tight">
              <NavLink to="/dashboard" onClick={() => setIsOpen(false)}>
                edutrack
              </NavLink>
            </h1>
          </div>

          {/* Close button inside sidebar header (mobile only) */}
          <button
            aria-label="Close menu"
            className="md:hidden text-white p-1 rounded hover:bg-yellow-800 focus:outline-none"
            onClick={() => setIsOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Menu */}
        <nav>
          <ul className="space-y-2 text-sm md:text-base md:pt-5">
            <li>
              <NavLink
                to="/preferences-form"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  isActive
                    ? "flex items-center space-x-3 p-2 rounded bg-yellow-800"
                    : "flex items-center space-x-3 p-2 rounded hover:bg-yellow-800"
                }
              >
                <Pencil className="w-4 h-4 md:w-5 md:h-5" />
                <span>Create Course</span>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  isActive
                    ? "flex items-center space-x-3 p-2 rounded bg-yellow-800"
                    : "flex items-center space-x-3 p-2 rounded hover:bg-yellow-800"
                }
              >
                <BarChart2 className="w-4 h-4 md:w-5 md:h-5" />
                <span>Dashboard</span>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/mycourses"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  isActive
                    ? "flex items-center space-x-3 p-2 rounded bg-yellow-800"
                    : "flex items-center space-x-3 p-2 rounded hover:bg-yellow-800"
                }
              >
                <BookMarked className="w-4 h-4 md:w-5 md:h-5" />
                <span>My Courses</span>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/ask-ai"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  isActive
                    ? "flex items-center space-x-3 p-2 rounded bg-yellow-800"
                    : "flex items-center space-x-3 p-2 rounded hover:bg-yellow-800"
                }
              >
                <Sparkle className="w-4 h-4 md:w-5 md:h-5" />
                <span>Ask AI</span>
              </NavLink>
            </li>

            <li>
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="flex items-center space-x-3 p-2 rounded hover:bg-yellow-800 w-full text-left"
              >
                <LogOut className="w-4 h-4 md:w-5 md:h-5" />
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </nav>

        {/* Footer (optional: keep spacing consistent) */}
        <div className="text-xs text-yellow-50/80">
          {/* you can add app version or small footer links here */}
        </div>
      </aside>

      {/* Overlay for mobile when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;