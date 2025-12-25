import { useEffect, useState } from "react";

const LiveNews = () => {
  const [channels, setChannels] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/live-channels")
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) {
          setChannels([]);
          return;
        }

        // show only active channels
        const activeOnly = data.filter((ch) => ch.active);

        setChannels(activeOnly);
      })
      .catch(() => setChannels([]));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Page Header */}
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Live News TV
      </h1>
      <p className="text-gray-600 mb-8">
        Watch live Indian news channels
      </p>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {channels.map((channel) => {
          const videoId = extractVideoId(channel.youtubeUrl);

          return (
            <div
              key={channel.id}
              className="bg-white border rounded-lg overflow-hidden hover:shadow-md transition"
            >
              {/* Thumbnail */}
              <div className="relative">
                <img
                  src={
                    videoId
                      ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
                      : "https://via.placeholder.com/640x360?text=Live+News"
                  }
                  alt={channel.name}
                  className="w-full h-48 object-cover"
                />

                {/* LIVE badge */}
                <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                  LIVE
                </span>
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900">
                  {channel.name}
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Language: {channel.language}
                </p>

                <a
                  href={channel.youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block mt-3 text-sm font-medium text-blue-600 hover:underline"
                >
                  Watch Live →
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      {channels.length === 0 && (
        <p className="text-gray-500 mt-10">
          No live channels available right now.
        </p>
      )}
    </div>
  );
};

/* Utility: extract YouTube video ID (NULL SAFE) */
const extractVideoId = (url) => {
  if (!url || typeof url !== "string") {
    return "";
  }

  if (url.includes("v=")) {
    return url.split("v=")[1].split("&")[0];
  }

  if (url.includes("youtu.be/")) {
    return url.split("youtu.be/")[1].split("?")[0];
  }

  return "";
};

export default LiveNews;
