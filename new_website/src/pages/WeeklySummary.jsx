import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getWeeklyAdultSummary,
  getWeeklyKidsSummary
} from "../services/newsService";

const WeeklySummary = () => {
  const [mode, setMode] = useState("ADULT"); // ADULT | KIDS
  const [adultData, setAdultData] = useState({});
  const [kidsData, setKidsData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getWeeklyAdultSummary().then(setAdultData);
    getWeeklyKidsSummary().then(setKidsData);
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">

      {/* HEADER */}
      <h1 className="text-3xl font-bold mb-2">
        Weekly Current Affairs
      </h1>
      <p className="text-gray-600 mb-6">
        Important news from the last 7 days
      </p>

      {/* TOGGLE BUTTONS */}
      <div className="flex gap-4 mb-10">
        <button
          onClick={() => setMode("ADULT")}
          className={`px-4 py-2 rounded text-sm font-medium ${
            mode === "ADULT"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          Adult Summary
        </button>

        <button
          onClick={() => setMode("KIDS")}
          className={`px-4 py-2 rounded text-sm font-medium ${
            mode === "KIDS"
              ? "bg-green-600 text-white"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          Kids Summary
        </button>
      </div>

      {/* ================= ADULT WEEKLY ================= */}
      {mode === "ADULT" && (
        <>
          {Object.keys(adultData).length === 0 ? (
            <p className="text-gray-500">
              No adult weekly summary available.
            </p>
          ) : (
            Object.keys(adultData).map(category => (
              <section key={category} className="mb-10">

                <h2 className="text-xl font-semibold border-l-4 border-blue-600 pl-3 mb-4">
                  {category}
                </h2>

                <div className="space-y-4">
                  {adultData[category].map(n => (
                    <div
                      key={n.id}
                      onClick={() => navigate(`/article/${n.id}`)}
                      className="bg-white border rounded-lg p-4 hover:shadow cursor-pointer transition"
                    >
                      <h3 className="font-semibold text-lg mb-1 hover:text-blue-600">
                        {n.title}
                      </h3>

                      <p className="text-sm text-gray-600 line-clamp-3">
                        {n.summary}
                      </p>

                      <div className="flex justify-between text-xs text-gray-400 mt-3">
                        <span>{n.source}</span>
                        <span>{n.publishedDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))
          )}
        </>
      )}

      {/* ================= KIDS WEEKLY ================= */}
      {mode === "KIDS" && (
        <>
          {kidsData.length === 0 ? (
            <p className="text-gray-500">
              No kids weekly summary available.
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {kidsData.map(n => (
                <div
                  key={n.id}
                  onClick={() => navigate(`/article/${n.id}`)}
                  className="bg-white border rounded-lg p-4 hover:shadow cursor-pointer transition"
                >
                  <h3 className="font-semibold text-lg mb-2 hover:text-green-600">
                    {n.title}
                  </h3>

                  <p className="text-sm text-gray-600 line-clamp-4">
                    {n.summary}
                  </p>

                  <p className="text-xs text-gray-400 mt-3">
                    {n.publishedDate}
                  </p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default WeeklySummary;



