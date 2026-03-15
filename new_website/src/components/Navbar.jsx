import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "./AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    if (e.key === "Enter" && query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setQuery("");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getNavLinks = () => {
    if (!user) {
      return [
        { to: "/", label: "Home" },
        { to: "/login", label: "Login" },
        { to: "/register", label: "Register" }
      ];
    }

    switch (user.role) {
      case "ADMIN":
        return [
          { to: "/admin/dashboard", label: "Dashboard" },
          { to: "/admin/newspapers", label: "Newspapers" },
          { to: "/admin/live-channels", label: "Live Channels" }
        ];
      case "ADULT":
        return [
          { to: "/", label: "Home" },
          { to: "/adult", label: "Adult News" },
          { to: "/weekly", label: "Weekly Summary" },
          { to: "/newspapers", label: "Newspapers" },
          { to: "/live", label: "Live TV" }
        ];
      case "CHILD":
        return [
          { to: "/", label: "Home" },
          { to: "/kids", label: "Kids News" },
          { to: "/weekly", label: "Weekly Kids Highlights" },
          { to: "/live", label: "Educational Live Channels" }
        ];
      default:
        return [{ to: "/", label: "Home" }];
    }
  };

  return (
    <>
      {/* TOP ADMIN STRIP */}
      <div className="bg-gradient-to-r from-red-600 to-indigo-600 text-white text-sm">
        <div className="max-w-7xl mx-auto px-6 py-2 flex justify-between items-center">

          {/* LEFT INFO */}
          <span>
            {new Date().toDateString()} •{" "}
            <span className="text-green-300 font-semibold">
              Breaking News Available
            </span>
          </span>

          {/* USER INFO / ADMIN PORTAL */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span>Welcome, {user.role}</span>
                <button
                  onClick={handleLogout}
                  className="hover:underline font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate("/admin/login")}
                className="flex items-center gap-2 hover:underline font-medium"
              >
                👤 Admin Portal
              </button>
            )}
          </div>

        </div>
      </div>

      {/* MAIN NAVBAR */}
      <nav className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* LEFT: LOGO + MENU */}
          <div className="flex items-center gap-10">
            {/* LOGO */}
            <h1
              className="text-2xl font-bold cursor-pointer"
              onClick={() => navigate("/")}
            >
              NewsBuddy
            </h1>

            {/* NAV LINKS */}
            <div className="flex items-center gap-6 text-sm font-medium">
              {getNavLinks().map((link) => (
                <Link key={link.to} className="hover:text-blue-600" to={link.to}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* RIGHT: SEARCH */}
          <div className="flex items-center gap-4">
            {/* SEARCH */}
            <input
              type="text"
              placeholder="Search news..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleSearch}
              className="border px-4 py-2 rounded-md text-sm w-64 focus:outline-none focus:ring"
            />
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;

