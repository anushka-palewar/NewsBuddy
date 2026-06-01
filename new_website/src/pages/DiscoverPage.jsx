import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTopics, getTrendingTopics, getArticlesByTopic } from "../services/newsService";

const DiscoverPage = () => {
  const navigate = useNavigate();

  // Data states
  const [topics, setTopics] = useState([]);
  const [trending, setTrending] = useState([]);
  const [topicsLoading, setTopicsLoading] = useState(true);
  const [trendingLoading, setTrendingLoading] = useState(true);
  const [error, setError] = useState("");

  // Topic Feed states
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [articles, setArticles] = useState([]);
  const [feedLoading, setFeedLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setError("");
    try {
      const [topicsData, trendingData] = await Promise.all([
        getTopics(),
        getTrendingTopics(),
      ]);
      setTopics(topicsData || []);
      setTrending(trendingData || []);
    } catch (err) {
      setError("Failed to load discover data.");
    } finally {
      setTopicsLoading(false);
      setTrendingLoading(false);
    }
  };

  const handleTopicClick = async (topic) => {
    setSelectedTopic(topic);
    setPage(0);
    loadTopicArticles(topic.id, 0);
  };

  const loadTopicArticles = async (topicId, pageNum) => {
    setFeedLoading(true);
    try {
      const res = await getArticlesByTopic(topicId, pageNum, 6);
      setArticles(res.content || []);
      setTotalPages(res.totalPages || 0);
    } catch (err) {
      console.error("Failed to load feed", err);
    } finally {
      setFeedLoading(false);
    }
  };

  const handlePageChange = (newPageNum) => {
    if (newPageNum >= 0 && newPageNum < totalPages) {
      setPage(newPageNum);
      loadTopicArticles(selectedTopic.id, newPageNum);
    }
  };

  const getTopicIcon = (name) => {
    const icons = {
      Technology: "💻",
      Politics: "⚖️",
      Business: "📈",
      Sports: "⚽",
      Science: "🔬",
      Health: "🏥",
      Entertainment: "🎬",
    };
    return icons[name] || "📰";
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-12">
      {/* PAGE HEADER */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">🧭</span>
          <h1 className="text-3xl font-bold text-gray-900 font-sans">Discover News</h1>
        </div>
        <p className="text-gray-600">
          Explore topics in depth and see what is currently trending across the platform.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 font-medium">
          ⚠️ {error}
        </div>
      )}

      {/* SECTION 1: TRENDING NOW */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          ⚡ Trending Now
        </h2>
        {trendingLoading ? (
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-8 w-24 bg-gray-100 animate-pulse rounded-full" />
            ))}
          </div>
        ) : trending.length === 0 ? (
          <p className="text-sm text-gray-400">No trending topics calculated yet.</p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {trending.map((t) => (
              <button
                key={t.id}
                onClick={() => navigate(`/search?q=${encodeURIComponent(t.keyword)}`)}
                className="bg-orange-50 hover:bg-orange-100 text-orange-700 font-semibold px-4 py-1.5 rounded-full text-sm border border-orange-200 shadow-sm transition flex items-center gap-1.5"
              >
                <span>🔥</span>
                <span>{t.keyword}</span>
                <span className="text-xs text-orange-400 font-normal">({t.frequency})</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 2: TOPIC EXPLORER */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-gray-900">Topic Explorer</h2>

        {topicsLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-100 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : topics.length === 0 ? (
          <p className="text-gray-500">No topics available.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {topics.map((t) => {
              const isSelected = selectedTopic?.id === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => handleTopicClick(t)}
                  className={`cursor-pointer border-2 rounded-xl p-5 shadow-sm transition flex flex-col justify-between h-36 ${
                    isSelected
                      ? "border-blue-600 bg-blue-50/50"
                      : "border-gray-100 hover:border-blue-200 hover:shadow-md bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{getTopicIcon(t.name)}</span>
                    <div>
                      <h3 className="font-bold text-gray-900">{t.name}</h3>
                      <p className="text-xs text-gray-500 line-clamp-2 mt-1">{t.description}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100/80">
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                      {t.articleCount} articles
                    </span>
                    <span className="text-xs text-gray-400 hover:underline">Browse →</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SECTION 3: TOPIC FEED */}
      {selectedTopic && (
        <div className="space-y-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
              <span>{getTopicIcon(selectedTopic.name)}</span>
              {selectedTopic.name} Feed
            </h2>
            <button
              onClick={() => setSelectedTopic(null)}
              className="text-sm font-semibold text-gray-500 hover:text-gray-700"
            >
              Clear Feed ✕
            </button>
          </div>

          {feedLoading ? (
            <div className="flex flex-col items-center py-12">
              <svg className="animate-spin h-8 w-8 text-blue-500 mb-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <p className="text-sm text-gray-400">Loading feed articles...</p>
            </div>
          ) : articles.length === 0 ? (
            <p className="text-gray-400 text-sm italic py-4">No articles published under this topic category yet.</p>
          ) : (
            <div className="space-y-8">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((n) => (
                  <div
                    key={n.id}
                    className="bg-white border rounded-xl overflow-hidden hover:shadow-md transition flex flex-col justify-between"
                  >
                    <div>
                      {/* Image */}
                      <img
                        src={n.imageUrl || "/fallback.png"}
                        alt={n.title}
                        onError={(e) => (e.target.src = "/fallback.png")}
                        onClick={() => navigate(`/article/${n.id}`)}
                        className="w-full h-48 object-cover cursor-pointer hover:opacity-95 transition"
                      />

                      {/* Content */}
                      <div className="p-4 space-y-2">
                        <h3
                          className="font-bold text-gray-900 leading-snug cursor-pointer hover:text-blue-600 line-clamp-2"
                          onClick={() => navigate(`/article/${n.id}`)}
                        >
                          {n.title}
                        </h3>
                        <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">
                          {n.summary}
                        </p>
                      </div>
                    </div>

                    {/* Metadata Footer */}
                    <div className="p-4 pt-0 flex justify-between items-center text-[10px] font-bold text-gray-400">
                      <span>{n.source || "NewsBuddy"}</span>
                      <span>
                        {new Date(n.publishedDate).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 pt-4">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 0}
                    className="px-4 py-2 border rounded-lg text-sm font-semibold hover:bg-gray-50 transition disabled:opacity-40"
                  >
                    ← Previous
                  </button>
                  <span className="text-sm font-semibold text-gray-600">
                    Page {page + 1} of {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages - 1}
                    className="px-4 py-2 border rounded-lg text-sm font-semibold hover:bg-gray-50 transition disabled:opacity-40"
                  >
                    Next →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DiscoverPage;
