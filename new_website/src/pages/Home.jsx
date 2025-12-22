import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

const Home = () => {
  const [news, setNews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8080/api/news/adult")
      .then(res => res.json())
      .then(data => Array.isArray(data) ? setNews(data) : setNews([]))
      .catch(() => setNews([]));
  }, []);

  if (news.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500">
        Loading latest headlines…
      </div>
    );
  }

  const featured = news[0];
  const sideNews = news.slice(1, 5);
  const gridNews = news.slice(5, 11);

  return (
    <>
      {/* 🔴 BREAKING NEWS MARQUEE */}
      <div className="bg-red-700 text-white overflow-hidden">
        <div className="flex items-center px-6 py-2 gap-4">
          
          {/* FIXED LABEL */}
          <span className="font-bold text-sm whitespace-nowrap">
            BREAKING NEWS:
          </span>

          {/* SCROLLING HEADLINES */}
          <div className="overflow-hidden flex-1">
            <div className="animate-marquee-slow whitespace-nowrap text-sm font-medium">
              {news.slice(0, 8).map((n, i) => (
                <span
                  key={i}
                  className="mx-6 cursor-pointer hover:underline"
                  onClick={() => navigate(`/article/${n.id}`)}
                >
                  {n.title} •
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-6 mt-6">

        {/* HERO SECTION */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* FEATURED STORY */}
          <div className="lg:col-span-2">
            <img
              src={featured.imageUrl || "/fallback.png"}
              alt={featured.title}
              className="w-full h-[380px] object-cover"
            />

            <h1
              className="text-3xl font-bold mt-4 cursor-pointer hover:text-blue-600"
              onClick={() => navigate(`/article/${featured.id}`)}
            >
              {featured.title}
            </h1>

            <p className="text-gray-600 mt-2">
              {featured.summary}
            </p>
          </div>

          {/* SIDE HEADLINES */}
          <div className="space-y-4">
            {sideNews.map(n => (
              <div key={n.id} className="border-b pb-3">
                <h3
                  className="font-semibold cursor-pointer hover:text-blue-600"
                  onClick={() => navigate(`/article/${n.id}`)}
                >
                  {n.title}
                </h3>
                <p className="text-xs text-gray-500">
                  {n.category}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* TOP STORIES GRID */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold border-b pb-2 mb-6">
            Top Stories
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {gridNews.map(n => (
              <article
                key={n.id}
                className="border hover:shadow transition"
              >
                <img
                  src={n.imageUrl || "/fallback.png"}
                  alt={n.title}
                  className="w-full h-[180px] object-cover"
                />

                <div className="p-4">
                  <h3
                    className="font-semibold cursor-pointer hover:text-blue-600"
                    onClick={() => navigate(`/article/${n.id}`)}
                  >
                    {n.title}
                  </h3>

                  <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                    {n.summary}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
};

export default Home;
