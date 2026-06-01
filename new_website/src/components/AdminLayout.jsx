import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/admin/dashboard", label: "Dashboard" },
  { to: "/admin/content", label: "Content" },
  { to: "/admin/live-channels", label: "Live TV" },
  { to: "/admin/newspapers", label: "Newspapers" },
  { to: "/admin/users", label: "Users" },
  { to: "/admin/analytics", label: "Analytics" },
  { to: "/admin/system", label: "System" },
];

const AdminLayout = ({ title, subtitle, children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <aside className="w-72 bg-white border-r border-gray-200 min-h-screen">
          <div className="px-6 py-8">
            <h1 className="text-xl font-bold text-gray-900">NewsBuddy Admin</h1>
            <p className="text-sm text-gray-500 mt-1">Manage content & settings</p>
          </div>

          <nav className="px-4">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `block rounded-lg px-4 py-3 mb-1 text-sm font-medium transition ${
                    isActive
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:bg-gray-50"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="px-6 mt-8">
            <div className="text-xs text-gray-400 uppercase tracking-wide">
              Pro tips
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Use the Content dashboard to switch between Kids and Adult contexts.
            </p>
          </div>
        </aside>

        <main className="flex-1 p-8">
          <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
              {subtitle && (
                <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
              )}
            </div>
          </header>
          <div className="space-y-8">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
