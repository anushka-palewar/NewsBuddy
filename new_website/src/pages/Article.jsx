import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const Article = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

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

      {/* 🔙 BACK BUTTON */}
      <button
        onClick={() =>
          navigate(article.audience === "CHILD" ? "/kids" : "/adult")
        }
        className="mb-6 text-sm text-blue-600 hover:underline"
      >
        ← Back to {article.audience === "CHILD" ? "Kids News" : "Adult News"}
      </button>

      <h1 className="text-3xl font-bold leading-tight">
        {article.title}
      </h1>

      <div className="text-sm text-gray-500 mt-2">
        {article.category} • {article.publishedDate}
      </div>

      <img
        src={article.imageUrl || "/fallback.png"}
        alt={article.title}
        onError={(e) => (e.target.src = "/fallback.png")}
        className="w-full h-[400px] object-cover rounded mt-6"
      />

      <p className="text-lg text-gray-700 mt-6 leading-relaxed">
        {article.summary}
      </p>

      {article.sourceUrl && (
        <p className="text-sm text-gray-500 mt-6">
          Source:{" "}
          <a
            href={article.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 hover:underline"
          >
            {article.source}
          </a>
        </p>
      )}
    </article>
  );
};

export default Article;
