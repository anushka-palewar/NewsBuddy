import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const SearchResults = () => {
  const [params] = useSearchParams();
  const query = params.get("q");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) return;

    fetch("http://localhost:8080/api/news/adult")
      .then(res => res.json())
      .then(data => {
        if (!Array.isArray(data)) return [];

        const filtered = data.filter(n =>
          n.title?.toLowerCase().includes(query.toLowerCase()) ||
          n.summary?.toLowerCase().includes(query.toLowerCase())
        );

        setResults(filtered);
      })
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-6">
        Search results for "{query}"
      </h1>

      {loading && <p className="text-gray-500">Searching…</p>}

      {!loading && results.length === 0 && (
        <p className="text-gray-500">No results found.</p>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map(n => (
          <article key={n.id} className="border rounded p-4 hover:shadow">
            <h2 className="font-semibold text-lg mb-2">{n.title}</h2>
            <p className="text-sm text-gray-600 line-clamp-4">
              {n.summary}
            </p>
            <p className="text-xs text-gray-400 mt-3">
              {n.category} • {n.publishedDate}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
