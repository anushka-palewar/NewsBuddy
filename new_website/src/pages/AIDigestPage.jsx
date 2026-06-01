import { useEffect, useState } from "react";
import { useAuth } from "../components/AuthContext";
import {
  getAiDailyDigest,
  getAiWeeklyDigest,
  generateAiDailyDigest,
  generateAiWeeklyDigest,
} from "../services/newsService";

const AIDigestPage = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  // Daily state
  const [daily, setDaily] = useState(null);
  const [dailyLoading, setDailyLoading] = useState(true);
  const [dailyError, setDailyError] = useState("");
  const [dailyRefreshing, setDailyRefreshing] = useState(false);

  // Weekly state
  const [weekly, setWeekly] = useState(null);
  const [weeklyLoading, setWeeklyLoading] = useState(true);
  const [weeklyError, setWeeklyError] = useState("");
  const [weeklyRefreshing, setWeeklyRefreshing] = useState(false);

  // Fetch data on mount
  useEffect(() => {
    fetchDaily();
    fetchWeekly();
  }, []);

  const fetchDaily = async () => {
    setDailyLoading(true);
    setDailyError("");
    try {
      const data = await getAiDailyDigest();
      setDaily(data);
    } catch (err) {
      setDailyError("Failed to load daily digest.");
    } finally {
      setDailyLoading(false);
    }
  };

  const fetchWeekly = async () => {
    setWeeklyLoading(true);
    setWeeklyError("");
    try {
      const data = await getAiWeeklyDigest();
      setWeekly(data);
    } catch (err) {
      setWeeklyError("Failed to load weekly digest.");
    } finally {
      setWeeklyLoading(false);
    }
  };

  const handleRefreshDaily = async () => {
    setDailyRefreshing(true);
    setDailyError("");
    try {
      const result = await generateAiDailyDigest();
      if (result?.digest) {
        setDaily(result.digest);
      } else {
        await fetchDaily();
      }
    } catch (err) {
      setDailyError("Failed to generate daily digest.");
    } finally {
      setDailyRefreshing(false);
    }
  };

  const handleRefreshWeekly = async () => {
    setWeeklyRefreshing(true);
    setWeeklyError("");
    try {
      const result = await generateAiWeeklyDigest();
      if (result?.digest) {
        setWeekly(result.digest);
      } else {
        await fetchWeekly();
      }
    } catch (err) {
      setWeeklyError("Failed to generate weekly digest.");
    } finally {
      setWeeklyRefreshing(false);
    }
  };

  // Parse bullet points from summary text
  const parseBullets = (text) => {
    if (!text) return [];
    return text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.startsWith("•") || line.startsWith("-") || line.startsWith("*"))
      .map((line) => line.replace(/^[•\-*]\s*/, ""));
  };

  // Parse weekly sections (## Header followed by bullets)
  const parseWeeklySections = (text) => {
    if (!text) return [];
    const sections = [];
    let currentSection = null;

    text.split("\n").forEach((line) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("## ") || trimmed.startsWith("**") && trimmed.endsWith("**")) {
        if (currentSection) sections.push(currentSection);
        currentSection = {
          title: trimmed.replace(/^##\s*/, "").replace(/\*\*/g, "").trim(),
          bullets: [],
        };
      } else if (
        currentSection &&
        (trimmed.startsWith("•") || trimmed.startsWith("-") || trimmed.startsWith("*"))
      ) {
        currentSection.bullets.push(
          trimmed.replace(/^[•\-*]\s*/, "")
        );
      }
    });

    if (currentSection) sections.push(currentSection);
    return sections;
  };

  const formatTimestamp = (ts) => {
    if (!ts) return "";
    try {
      const date = new Date(ts);
      return date.toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch {
      return ts;
    }
  };

  // Section color mapping for weekly digest
  const sectionColors = {
    "Key Events": { border: "border-red-500", bg: "bg-red-50", icon: "🔴", text: "text-red-700" },
    "Technology Updates": { border: "border-blue-500", bg: "bg-blue-50", icon: "💻", text: "text-blue-700" },
    "Business Updates": { border: "border-green-500", bg: "bg-green-50", icon: "📈", text: "text-green-700" },
    "Sports Updates": { border: "border-orange-500", bg: "bg-orange-50", icon: "⚽", text: "text-orange-700" },
  };

  const getSectionStyle = (title) => {
    for (const [key, val] of Object.entries(sectionColors)) {
      if (title.toLowerCase().includes(key.toLowerCase().split(" ")[0])) {
        return val;
      }
    }
    return { border: "border-indigo-500", bg: "bg-indigo-50", icon: "📰", text: "text-indigo-700" };
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">

      {/* PAGE HEADER */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">🤖</span>
          <h1 className="text-3xl font-bold text-gray-900">AI Digest</h1>
        </div>
        <p className="text-gray-600 ml-14">
          AI-generated news summaries powered by intelligent analysis of today's top stories.
        </p>
      </div>

      {/* TWO-COLUMN GRID */}
      <div className="grid lg:grid-cols-2 gap-8">

        {/* ==================== TODAY'S BRIEF ==================== */}
        <div className="bg-white border rounded-xl shadow-sm overflow-hidden">

          {/* Card Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📋</span>
                <div>
                  <h2 className="text-lg font-bold text-white">Today's Brief</h2>
                  <p className="text-indigo-200 text-sm">AI-generated daily summary</p>
                </div>
              </div>
              {isAdmin && (
                <button
                  onClick={handleRefreshDaily}
                  disabled={dailyRefreshing}
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50 flex items-center gap-2"
                >
                  {dailyRefreshing ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Generating...
                    </>
                  ) : (
                    <>🔄 Refresh</>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Card Body */}
          <div className="p-6">
            {dailyLoading ? (
              <div className="flex flex-col items-center py-12">
                <svg className="animate-spin h-8 w-8 text-indigo-500 mb-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <p className="text-gray-500 text-sm">Loading daily digest...</p>
              </div>
            ) : dailyError ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm font-medium">⚠️ {dailyError}</p>
                <button
                  onClick={fetchDaily}
                  className="mt-2 text-red-600 underline text-sm hover:text-red-800"
                >
                  Try again
                </button>
              </div>
            ) : (
              <>
                {/* Timestamp */}
                {daily?.generatedAt && (
                  <div className="flex items-center gap-2 mb-5 text-sm text-gray-500">
                    <span>🕐</span>
                    <span>Generated: {formatTimestamp(daily.generatedAt)}</span>
                  </div>
                )}

                {/* Bullet Points */}
                {(() => {
                  const bullets = parseBullets(daily?.summary || "");
                  if (bullets.length > 0) {
                    return (
                      <ul className="space-y-4">
                        {bullets.map((bullet, i) => (
                          <li key={i} className="flex gap-3">
                            <span className="flex-shrink-0 w-7 h-7 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-sm font-bold">
                              {i + 1}
                            </span>
                            <p className="text-gray-700 text-sm leading-relaxed pt-1">
                              {bullet}
                            </p>
                          </li>
                        ))}
                      </ul>
                    );
                  }
                  // Fallback: show raw summary
                  return (
                    <p className="text-gray-600 text-sm whitespace-pre-line leading-relaxed">
                      {daily?.summary || "No daily digest available yet. An admin can generate one using the Refresh button."}
                    </p>
                  );
                })()}
              </>
            )}
          </div>
        </div>

        {/* ==================== WEEKLY SUMMARY ==================== */}
        <div className="bg-white border rounded-xl shadow-sm overflow-hidden">

          {/* Card Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📊</span>
                <div>
                  <h2 className="text-lg font-bold text-white">Weekly Summary</h2>
                  <p className="text-emerald-200 text-sm">
                    {weekly?.weekStart && weekly?.weekEnd
                      ? `${weekly.weekStart} → ${weekly.weekEnd}`
                      : "Categorized weekly digest"}
                  </p>
                </div>
              </div>
              {isAdmin && (
                <button
                  onClick={handleRefreshWeekly}
                  disabled={weeklyRefreshing}
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50 flex items-center gap-2"
                >
                  {weeklyRefreshing ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Generating...
                    </>
                  ) : (
                    <>🔄 Refresh</>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Card Body */}
          <div className="p-6">
            {weeklyLoading ? (
              <div className="flex flex-col items-center py-12">
                <svg className="animate-spin h-8 w-8 text-emerald-500 mb-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <p className="text-gray-500 text-sm">Loading weekly digest...</p>
              </div>
            ) : weeklyError ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm font-medium">⚠️ {weeklyError}</p>
                <button
                  onClick={fetchWeekly}
                  className="mt-2 text-red-600 underline text-sm hover:text-red-800"
                >
                  Try again
                </button>
              </div>
            ) : (
              <>
                {/* Timestamp */}
                {weekly?.generatedAt && (
                  <div className="flex items-center gap-2 mb-5 text-sm text-gray-500">
                    <span>🕐</span>
                    <span>Generated: {formatTimestamp(weekly.generatedAt)}</span>
                  </div>
                )}

                {/* Parsed Sections */}
                {(() => {
                  const sections = parseWeeklySections(weekly?.summary || "");
                  if (sections.length > 0) {
                    return (
                      <div className="space-y-5">
                        {sections.map((section, i) => {
                          const style = getSectionStyle(section.title);
                          return (
                            <div
                              key={i}
                              className={`border-l-4 ${style.border} ${style.bg} rounded-r-lg p-4`}
                            >
                              <h3 className={`font-semibold ${style.text} mb-3 flex items-center gap-2`}>
                                <span>{style.icon}</span>
                                {section.title}
                              </h3>
                              <ul className="space-y-2">
                                {section.bullets.map((b, j) => (
                                  <li key={j} className="text-gray-700 text-sm flex gap-2">
                                    <span className="text-gray-400 mt-0.5">•</span>
                                    <span>{b}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          );
                        })}
                      </div>
                    );
                  }
                  // Fallback: show raw summary
                  return (
                    <p className="text-gray-600 text-sm whitespace-pre-line leading-relaxed">
                      {weekly?.summary || "No weekly digest available yet. An admin can generate one using the Refresh button."}
                    </p>
                  );
                })()}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIDigestPage;
