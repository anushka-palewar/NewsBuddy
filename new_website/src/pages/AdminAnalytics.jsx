import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { getWeeklyAdultSummary, getWeeklyKidsSummary } from "../services/newsService";

const AUDIENCES = {
  ADULT: "Adult",
  CHILD: "Kids",
};

const AdminAnalytics = () => {
  const [audience, setAudience] = useState("ADULT");
  const [categoryCounts, setCategoryCounts] = useState([]);

  useEffect(() => {
    const load = async () => {
      const summaryFn = audience === "ADULT" ? getWeeklyAdultSummary : getWeeklyKidsSummary;
      const summaryItems = await summaryFn();
      const items = Array.isArray(summaryItems) ? summaryItems : Object.values(summaryItems).flat();

      const counts = items.reduce((acc, item) => {
        const category = item.category || "Uncategorized";
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {});

      setCategoryCounts(
        Object.entries(counts)
          .map(([category, count]) => ({ category, count }))
          .sort((a, b) => b.count - a.count)
      );
    };

    load();
  }, [audience]);

  const maxCount = Math.max(...categoryCounts.map((c) => c.count), 1);

  return (
    <AdminLayout title="Analytics" subtitle="Content trends and category breakdown">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Audience:</span>
          {Object.entries(AUDIENCES).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setAudience(key)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                audience === key
                  ? "bg-black text-white"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Category distribution (last 7 days)
        </h3>

        {categoryCounts.length === 0 ? (
          <p className="text-sm text-gray-500">Not enough content to show a breakdown.</p>
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
    </AdminLayout>
  );
};

export default AdminAnalytics;
