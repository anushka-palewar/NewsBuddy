import { useEffect, useState } from "react";

const Newspapers = () => {
  const [papers, setPapers] = useState([]);
  const [language, setLanguage] = useState("ALL");

  useEffect(() => {
    fetch("http://localhost:8080/api/newspapers")
      .then(res => res.json())
      .then(data => {
        // ✅ show only active newspapers
        const activeOnly = data.filter(p => p.active);

        // ✅ basic duplicate guard (by id)
        const unique = Array.from(
          new Map(activeOnly.map(p => [p.id, p])).values()
        );

        setPapers(unique);
      });
  }, []);

  const filteredPapers =
    language === "ALL"
      ? papers
      : papers.filter(p => p.language === language);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Header */}
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Newspaper Directory
      </h1>
      <p className="text-gray-600 mb-6">
        Browse popular Indian newspapers by language
      </p>

      {/* Filters */}
      <div className="flex gap-3 mb-8">
        {["ALL", "English", "Hindi", "Marathi"].map(lang => (
          <button
            key={lang}
            onClick={() => setLanguage(lang)}
            className={`px-4 py-2 rounded-full border text-sm font-medium transition
              ${
                language === lang
                  ? "bg-black text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
          >
            {lang}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPapers.map(paper => (
          <div
            key={paper.id}
            className="border rounded-lg p-5 bg-white shadow-sm hover:shadow-md transition"
          >
            {/* Logo */}
            <img
              src={paper.imageUrl}
              alt={paper.name}
              className="w-20 h-20 object-contain mb-4"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/80?text=Logo";
              }}
            />

            <div className="flex items-start justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {paper.name}
              </h3>
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                {paper.language}
              </span>
            </div>

            <p className="text-sm text-gray-600 mt-2">
              Format: {paper.format}
            </p>

            <a
              href={paper.url}
              target="_blank"
              rel="noreferrer"
              className="inline-block mt-4 text-sm font-medium text-blue-600 hover:underline"
            >
              Visit Website →
            </a>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {filteredPapers.length === 0 && (
        <p className="text-gray-500 mt-10">
          No newspapers available for selected language.
        </p>
      )}
    </div>
  );
};

export default Newspapers;
