import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import Footer from "../components/Footer";

const Home = () => {
  const [news, setNews] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Fetch news based on user role or show general content
    const endpoint = user?.role === 'CHILD'
      ? "http://localhost:8080/api/kids"
      : "http://localhost:8080/api/adult";

    fetch(endpoint)
      .then(res => res.json())
      .then(data => Array.isArray(data) ? setNews(data) : setNews([]))
      .catch(() => setNews([]));
  }, [user]);

  // Show welcome screen for unauthenticated users
  if (!user) {
    return (
      <>
        {/* BREAKING NEWS MARQUEE */}
        <div className="bg-red-700 text-white overflow-hidden">
          <div className="flex items-center px-6 py-2 gap-4">
            <span className="font-bold text-sm whitespace-nowrap">
              WELCOME TO NEWSBUDDY:
            </span>
            <div className="overflow-hidden flex-1">
              <div className="animate-marquee-slow whitespace-nowrap text-sm font-medium">
                <span className="mx-6">Age-Appropriate News • </span>
                <span className="mx-6">Role-Based Dashboards • </span>
                <span className="mx-6">Secure Authentication • </span>
                <span className="mx-6">Educational Content • </span>
              </div>
            </div>
          </div>
        </div>

        {/* WELCOME CONTENT */}
        <main className="max-w-7xl mx-auto px-6 mt-12">
          <div className="text-center py-20">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Welcome to NewsBuddy
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
              Your personalized news platform with age-appropriate content and role-based dashboards.
              Register to access content tailored to your age group.
            </p>

            <div className="grid md:grid-cols-3 gap-8 mt-16">
              {/* Child Section */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-xl border">
                <div className="text-6xl mb-4">👶</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Kids Zone</h3>
                <p className="text-gray-600 mb-6">
                  Simple, engaging news with larger images and friendly colors.
                  Perfect for children under 13.
                </p>
                <ul className="text-left text-gray-700 space-y-2">
                  <li>• Age-appropriate content</li>
                  <li>• Educational live channels</li>
                  <li>• Weekly kids highlights</li>
                  <li>• Safe browsing environment</li>
                </ul>
              </div>

              {/* Adult Section */}
              <div className="bg-gradient-to-br from-green-50 to-blue-50 p-8 rounded-xl border">
                <div className="text-6xl mb-4">👨‍💼</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Adult News</h3>
                <p className="text-gray-600 mb-6">
                  Comprehensive news coverage with detailed analysis and
                  breaking news updates.
                </p>
                <ul className="text-left text-gray-700 space-y-2">
                  <li>• Breaking news alerts</li>
                  <li>• In-depth analysis</li>
                  <li>• Category-based content</li>
                  <li>• Newspaper archives</li>
                </ul>
              </div>

              {/* Admin Section */}
              <div className="bg-gradient-to-br from-gray-50 to-red-50 p-8 rounded-xl border">
                <div className="text-6xl mb-4">⚙️</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Admin Panel</h3>
                <p className="text-gray-600 mb-6">
                  Complete platform management with content moderation
                  and system administration tools.
                </p>
                <ul className="text-left text-gray-700 space-y-2">
                  <li>• News source management</li>
                  <li>• Live channel control</li>
                  <li>• Content moderation</li>
                  <li>• System monitoring</li>
                </ul>
              </div>
            </div>

            <div className="mt-16 space-x-6">
              <button
                onClick={() => navigate('/register')}
                className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-indigo-700 transition"
              >
                Get Started - Register Now
              </button>
              <button
                onClick={() => navigate('/login')}
                className="bg-white text-indigo-600 border-2 border-indigo-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-indigo-50 transition"
              >
                Already have an account? Login
              </button>
            </div>
          </div>
        </main>

        <Footer />
      </>
    );
  }

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
      {/* BREAKING NEWS MARQUEE */}
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

        {/* WELCOME MESSAGE */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
          <h2 className="text-lg font-semibold text-blue-900">
            Welcome back, {user.role} User!
          </h2>
          <p className="text-blue-700">
            {user.role === 'CHILD'
              ? 'Enjoy age-appropriate news and educational content.'
              : user.role === 'ADULT'
              ? 'Stay informed with comprehensive news coverage.'
              : 'Manage the platform content and settings.'
            }
          </p>
        </div>

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
