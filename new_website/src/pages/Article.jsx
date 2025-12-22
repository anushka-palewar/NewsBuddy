import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Article = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8080/api/news/adult/${id}`)
      .then(res => res.json())
      .then(setArticle)
      .catch(() => setArticle(null));
  }, [id]);

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-gray-500">
        Loading article...
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-6 py-10">
      
      <h1 className="text-3xl font-bold leading-tight">
        {article.title}
      </h1>

      <div className="text-sm text-gray-500 mt-2">
        {article.category} • {article.publishedDate}
      </div>

      {article.imageUrl && (
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-[400px] object-cover rounded mt-6"
        />
      )}

      <p className="text-lg text-gray-700 mt-6 leading-relaxed">
        {article.summary}
      </p>

      {article.source && (
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
