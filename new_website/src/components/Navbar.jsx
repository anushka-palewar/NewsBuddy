import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem("admin");
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    if (e.key === "Enter" && query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setQuery("");
    }
  };

  return (
    <>
      {/* TOP ADMIN STRIP */}
      <div className="bg-gradient-to-r from-red-600 to-indigo-600 text-white text-sm">
        <div className="max-w-7xl mx-auto px-6 py-2 flex justify-between items-center">
          <span>
            {new Date().toDateString()} •{" "}
            <span className="text-green-300 font-semibold">
              Breaking News Available
            </span>
          </span>

          <button
            onClick={() =>
              navigate(isAdmin ? "/admin/dashboard" : "/admin/login")
            }
            className="flex items-center gap-2 hover:underline"
          >
            👤 Admin Portal
          </button>
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
              <Link className="hover:text-blue-600" to="/">Home</Link>
              <Link className="hover:text-blue-600" to="/kids">Kids</Link>
              <Link className="hover:text-blue-600" to="/adult">Adult</Link>
              <Link className="hover:text-blue-600" to="/weekly">Weekly</Link>
              <Link className="hover:text-blue-600" to="/newspapers">Newspapers</Link>
              <Link className="hover:text-blue-600" to="/live">Live TV</Link>
            </div>
          </div>

          {/* RIGHT: SEARCH + MODE */}
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

            {/* DARK MODE PLACEHOLDER */}
            <button className="text-xl">🌙</button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;

