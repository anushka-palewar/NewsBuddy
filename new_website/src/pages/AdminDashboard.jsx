import { useEffect, useMemo, useState } from "react";
import { getAdminStatus, getAdminUsers, getWeeklyAdultSummary, getWeeklyKidsSummary } from "../services/newsService";
import AdminLayout from "../components/AdminLayout";

const AUDIENCES = {
  ADULT: "Adult",
  CHILD: "Kids",
};

const AdminDashboard = () => {
  const [audience, setAudience] = useState("ADULT");
  const [status, setStatus] = useState({});
  const [users, setUsers] = useState([]);
  const [categoryCounts, setCategoryCounts] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      const [statusData, userData] = await Promise.all([
        getAdminStatus(),
        getAdminUsers(),
      ]);

      setStatus(statusData);
      setUsers(userData || []);

      // Category distribution
      const summaryFn = audience === "ADULT" ? getWeeklyAdultSummary : getWeeklyKidsSummary;
      const summaryItems = await summaryFn();

      const items = Array.isArray(summaryItems)
        ? summaryItems
        : Object.values(summaryItems).flat();

      const counts = items.reduce((acc, item) => {
        const category = item.category || "Uncategorized";
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {});

      const data = Object.entries(counts)
        .map(([category, count]) => ({ category, count }))
        .sort((a, b) => b.count - a.count);

      setCategoryCounts(data);

      // Recent activity (latest 5 news)
      const recent = items
        .slice()
        .sort((a, b) => {
          const dateA = new Date(a.publishedDate || 0).getTime();
          const dateB = new Date(b.publishedDate || 0).getTime();
          return dateB - dateA;
        })
        .slice(0, 5)
        .map((item) => ({
          type: "News",
          title: item.title,
          category: item.category || "-",
          audience: audience,
          date: item.publishedDate,
        }));

      setRecentActivities(recent);

      setLoading(false);
    };

    load();
  }, [audience]);

  const totalUsers = users.length;
  const dashboardCards = useMemo(() => {
    const activeChannels = audience === "ADULT" ? status.activeAdultChannels : status.activeKidsChannels;
    const activePapers = audience === "ADULT" ? status.activeAdultNewspapers : status.activeKidsNewspapers;

    return [
      {
        title: `${AUDIENCES[audience]} News`,
        value: audience === "ADULT" ? status.totalAdultNews : status.totalKidsNews,
        description: "Items imported today",
      },
      {
        title: "Active Channels",
        value: activeChannels,
        description: "Live TV channels",
      },
      {
        title: "Active Newspapers",
        value: activePapers,
        description: "Available sources",
      },
      {
        title: "Registered Users",
        value: totalUsers,
        description: "Total user accounts",
      },
    ];
  }, [audience, status, totalUsers]);

  const maxCount = Math.max(...categoryCounts.map((c) => c.count), 1);

  return (
    <AdminLayout
      title="Dashboard"
      subtitle="Overview of system activity and content distribution"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-600">View context:</span>
          {Object.entries(AUDIENCES).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setAudience(key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                audience === key
                  ? "bg-black text-white"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="text-sm text-gray-500">
          {loading ? "Refreshing…" : `Last updated ${new Date().toLocaleTimeString()}`}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardCards.map((card) => (
          <div
            key={card.title}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              {card.title}
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-900">
                {card.value ?? 0}
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-500">{card.description}</p>
          </div>
        ))}
      </div>

      {/* Charts and activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Category distribution
            </h3>
            <span className="text-sm text-gray-500">
              Last 7 days • {AUDIENCES[audience]}
            </span>
          </div>

          {categoryCounts.length === 0 ? (
            <p className="text-sm text-gray-500">
              Not enough content to show a breakdown.
            </p>
          ) : (
            <div className="space-y-3">
              {categoryCounts.map((item) => {
                const barWidth = Math.round((item.count / maxCount) * 100);
                return (
                  <div key={item.category} className="flex items-center gap-3">
                    <div className="w-32 text-sm text-gray-600">{item.category}</div>
                    <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                    <div className="w-12 text-right text-sm text-gray-600">{item.count}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Recent activity
          </h3>

          {recentActivities.length === 0 ? (
            <p className="text-sm text-gray-500">
              No recent activity to display.
            </p>
          ) : (
            <div className="space-y-3">
              {recentActivities.map((item, index) => (
                <div
                  key={`${item.type}-${index}`}
                  className="flex items-center justify-between border rounded-lg p-3"
                >
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {item.title}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {item.type} • {item.category} • {item.audience}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">
                    {item.date || "today"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">System Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatusCard label="Server time" value={status.serverTime} />
          <StatusCard
            label="Users"
            value={status.totalUsers?.toString() ?? "—"}
          />
          <StatusCard
            label="Health"
            value={status.serverTime ? "OK" : "Unknown"}
            highlight
          />
        </div>
      </div>
    </AdminLayout>
  );
};

const StatusCard = ({ label, value, highlight }) => (
  <div
    className={`rounded-lg border px-4 py-3 ${
      highlight ? "border-green-200 bg-green-50" : "border-gray-100 bg-white"
    }`}
  >
    <div className="text-xs font-semibold text-gray-500">{label}</div>
    <div className="mt-1 text-lg font-semibold text-gray-900">{value ?? "—"}</div>
  </div>
);

export default AdminDashboard;

