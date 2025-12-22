import { useEffect, useState } from "react";
import { getWeeklyAdultSummary } from "../services/newsService";

const WeeklySummary = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getWeeklyAdultSummary()
      .then(res => {
        if (res && typeof res === "object") {
          setData(res);
        } else {
          setData({});
        }
      })
      .catch(() => setData({}))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-20 text-gray-500">
        Loading weekly summary…
      </div>
    );
  }

  const categories = Object.keys(data);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      
      {/* PAGE HEADER */}
      <h1 className="text-3xl font-bold mb-2">
        Weekly Current Affairs
      </h1>

      <p className="text-gray-600 mb-10">
        Category-wise summary for exam preparation
      </p>

      {/* EMPTY STATE */}
      {categories.length === 0 && (
        <div className="text-gray-500">
          No weekly data available.
        </div>
      )}

      {/* CATEGORY SECTIONS */}
      <div className="space-y-10">
        {categories.map(category => (
          <section key={category}>
            
            <h2 className="text-xl font-semibold border-l-4 border-blue-600 pl-3 mb-4">
              {category}
            </h2>

            <div className="space-y-4">
              {data[category].map(n => (
                <div
                  key={n.id}
                  className="border rounded-md p-4 bg-white"
                >
                  <h3 className="font-medium">
                    {n.title}
                  </h3>

                  <p className="text-sm text-gray-600 mt-2">
                    {n.summary}
                  </p>

                  <div className="text-xs text-gray-500 mt-2">
                    {n.publishedDate}
                  </div>
                </div>
              ))}
            </div>

          </section>
        ))}
      </div>
    </div>
  );
};

export default WeeklySummary;


