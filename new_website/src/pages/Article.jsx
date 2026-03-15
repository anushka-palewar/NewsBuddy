import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const Article = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [article, setArticle] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryGenerated, setSummaryGenerated] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        let res = await fetch(`http://localhost:8080/api/news/adult/${id}`);

        if (!res.ok) {
          res = await fetch(`http://localhost:8080/api/news/kids/${id}`);
        }

        if (res.ok) {
          setArticle(await res.json());
        } else {
          setArticle(null);
        }
      } catch {
        setArticle(null);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  const fetchSummary = async () => {
    if (!article) return;

    setSummaryLoading(true);

    try {
      let res = await fetch(`http://localhost:8080/api/news/adult/${id}/summary`);

      if (!res.ok) {
        res = await fetch(`http://localhost:8080/api/news/kids/${id}/summary`);
      }

      if (res.ok) {
        setSummary(await res.text());
      } else {
        setSummary("Unable to generate summary.");
      }

      setSummaryGenerated(true);
    } catch {
      setSummary("Error loading summary.");
      setSummaryGenerated(true);
    } finally {
      setSummaryLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-gray-500">
        Loading article...
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-red-500">
        Article not found.
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-6 py-10">

      {/* Back Button */}
      <button
        onClick={() =>
          navigate(article.audience === "CHILD" ? "/kids" : "/adult")
        }
        className="mb-6 text-sm text-blue-600 hover:underline"
      >
        ← Back to {article.audience === "CHILD" ? "Kids News" : "Adult News"}
      </button>

      {/* Title */}
      <h1 className="text-3xl font-bold leading-tight">
        {article.title}
      </h1>

      {/* Meta */}
      <div className="text-sm text-gray-500 mt-2">
        {article.category} • {article.publishedDate}
      </div>

      {/* Image */}
      <img
        src={article.imageUrl || "/fallback.png"}
        alt={article.title}
        onError={(e) => (e.target.src = "/fallback.png")}
        className="w-full h-[420px] object-cover rounded-lg mt-6"
      />

      {/* Full Article Content */}
      <div
        id="fullArticle"
        className="text-lg text-gray-700 mt-10 leading-relaxed"
      >
        {article.summary}
      </div>
       
      {/* Generate AI Summary Button */}
      {!summaryGenerated && (
        <div className="mt-8 text-center">
          <button
            onClick={fetchSummary}
            disabled={summaryLoading}
            className="px-7 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 disabled:bg-blue-400 transition"
          >
            {summaryLoading
              ? "Generating AI Summary..."
              : "✨ Generate AI Summary"}
          </button>
        </div>
      )}

      {/* AI Summary Box */}
      {summaryGenerated && (
        <div className="mt-10 bg-blue-50 border border-blue-200 rounded-xl p-6 shadow-sm">

          <h2 className="text-xl font-semibold text-blue-700 mb-3">
            AI Summary
          </h2>

          {summaryLoading ? (
            <p className="text-gray-600">Generating summary...</p>
          ) : (
            <p className="text-gray-700 leading-relaxed text-[15px]">
              {summary}
            </p>
          )}

          {/* Buttons */}
          <div className="flex gap-4 mt-6 flex-wrap">

            {/* Read Full Article (External Source) */}
            {article.sourceUrl && (
              <a
                href={article.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
              >
                Read Full Article →
              </a>
            )}

          </div>

        </div>
      )}

      

      <div className="flex gap-4 mt-6 flex-wrap">

            {/* Read Full Article (External Source) */}
            {article.sourceUrl && (
              <a
                href={article.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
              >
                Read Full Article →
              </a>
            )}

        </div>

    </article>
  );
};

export default Article;