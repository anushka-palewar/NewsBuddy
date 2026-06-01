import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import {
  Sparkles,
  Zap,
  Target,
  Shield,
  Bell,
  Lock,
  Newspaper,
  Brain,
  ChevronRight,
  Search,
  LogIn,
  UserPlus,
  ArrowRight,
  BookOpen,
  Users,
  TrendingUp,
  Play,
  CheckCircle2,
} from "lucide-react";

// Auth Modal Component
const AuthModal = ({ isOpen, onClose, onNavigate }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Login Required
          </h2>
          <p className="text-slate-600">
            Create an account to access features
          </p>
        </div>

        <div className="space-y-3 mb-8 bg-slate-50 p-6 rounded-2xl">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
            <span className="text-slate-700">Full news articles</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
            <span className="text-slate-700">AI Digest summaries</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
            <span className="text-slate-700">Daily Quiz challenges</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
            <span className="text-slate-700">Personalized feed</span>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => {
              onClose();
              onNavigate("/login");
            }}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 rounded-xl hover:shadow-lg transition-all hover:scale-105"
          >
            Login
          </button>
          <button
            onClick={() => {
              onClose();
              onNavigate("/register");
            }}
            className="w-full bg-slate-100 text-slate-900 font-semibold py-3 rounded-xl hover:bg-slate-200 transition-all"
          >
            Register Free
          </button>
        </div>

      </motion.div>
    </motion.div>
  );
};

// Feature Card Component
const FeatureCard = ({ icon: Icon, title, description, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      className="group bg-white p-8 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-xl transition-all duration-300"
    >
      <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl mb-4 group-hover:shadow-lg transition-shadow">
        <Icon className="w-7 h-7 text-indigo-600" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
};

// Portal Card Component
const PortalCard = ({ title, gradient, features, buttonText, onClick, isDark = false }) => {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className={`${gradient} p-8 rounded-3xl backdrop-blur-sm border border-white/20 cursor-pointer group relative overflow-hidden`}
    >
      <div className="relative z-10">
        <h3 className={`text-3xl font-bold mb-6 ${isDark ? "text-white" : "text-gray-900"}`}>
          {title}
        </h3>
        <ul className="space-y-3 mb-8">
          {features.map((feature, idx) => (
            <li key={idx} className={`flex items-center gap-2 ${isDark ? "text-white/90" : "text-gray-800"}`}>
              <span className="text-xl">•</span>
              <span className="font-medium">{feature}</span>
            </li>
          ))}
        </ul>
        <button
          onClick={onClick}
          className={`${
            isDark
              ? "bg-white text-slate-900 hover:bg-slate-100"
              : "bg-white/20 text-white hover:bg-white/30"
          } px-6 py-3 rounded-xl font-semibold flex items-center gap-2 group-hover:gap-3 transition-all`}
        >
          {buttonText}
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
};

const Home = () => {
  const [news, setNews] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    // Only fetch news if user is authenticated
    if (user) {
      const endpoint = user?.role === 'CHILD'
        ? "/api/kids"
        : "/api/adult";

      fetch(endpoint)
        .then(res => res.json())
        .then(data => Array.isArray(data) ? setNews(data) : setNews([]))
        .catch(() => setNews([]));
    }
  }, [user]);

  // Show modern landing page for unauthenticated users
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} onNavigate={navigate} />

        {/* HERO SECTION */}
        <section className="relative pt-20 pb-32 px-4 md:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* LEFT CONTENT */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full mb-6 font-medium text-sm">
                  <Sparkles className="w-4 h-4" />
                  🔥 AI-Powered News Platform
                </div>

                {/* Headline */}
                <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                  Personalized News for{" "}
                  <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-red-600 bg-clip-text text-transparent">
                    Every Generation
                  </span>
                </h1>

                {/* Description */}
                <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                  Discover trending news, AI-powered summaries, daily quizzes, and age-appropriate content tailored just for you.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mb-12">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAuthModal(true)}
                    className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    Explore Features <ArrowRight className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/register")}
                    className="px-8 py-4 bg-white text-indigo-600 font-bold rounded-xl border-2 border-indigo-600 hover:bg-indigo-50 transition-all"
                  >
                    Register Free
                  </motion.button>
                </div>

              </motion.div>

              {/* RIGHT ILLUSTRATION */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="hidden lg:block relative"
              >
                <div className="relative h-96 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10" />
                  
                  {/* Main card */}
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute top-12 left-8 w-72 bg-white rounded-2xl p-6 shadow-xl border border-slate-200"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <Newspaper className="w-6 h-6 text-indigo-600" />
                      <span className="font-semibold text-slate-900">Latest Headlines</span>
                    </div>
                    <p className="text-sm text-slate-600">Stay updated with trending stories</p>
                  </motion.div>

                  {/* AI Digest floating card */}
                  <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                    className="absolute bottom-12 right-8 w-64 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-6 shadow-xl border border-purple-400/30"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <Brain className="w-6 h-6" />
                      <span className="font-semibold">AI Digest</span>
                    </div>
                    <p className="text-sm text-white/90">5-minute smart summaries of today's top stories</p>
                  </motion.div>

                  {/* Quiz card */}
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity, delay: 2 }}
                    className="absolute top-32 right-4 w-56 bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-2xl p-5 shadow-xl border border-orange-400/30"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-5 h-5" />
                      <span className="font-semibold text-sm">Daily Quiz</span>
                    </div>
                    <p className="text-xs text-white/90">Test your knowledge with fresh questions</p>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section className="py-20 px-4 md:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                Why Choose NewsBuddy?
              </h2>
              <p className="text-xl text-slate-600">
                Everything you need to stay informed and engaged
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={Brain}
                title="AI Digest"
                description="Get smart summaries of complex news stories in just 5 minutes"
                index={0}
              />
              <FeatureCard
                icon={Target}
                title="Daily Quiz"
                description="Test your knowledge with fresh questions from the latest news"
                index={1}
              />
              <FeatureCard
                icon={Users}
                title="Personalized Feed"
                description="Content curated specifically for your interests and reading level"
                index={2}
              />
              <FeatureCard
                icon={Shield}
                title="Age-Based Content"
                description="Safe, appropriate news tailored to children, teens, and adults"
                index={3}
              />
              <FeatureCard
                icon={Bell}
                title="Breaking News Alerts"
                description="Get notified instantly when important stories break"
                index={4}
              />
              <FeatureCard
                icon={Lock}
                title="Secure Authentication"
                description="Your account and personal preferences are protected with industry-standard security"
                index={5}
              />
            </div>
          </div>
        </section>

        {/* USER PORTALS SECTION */}
        <section className="py-20 px-4 md:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                Built For Every Reader
              </h2>
              <p className="text-xl text-slate-600">
                Choose your experience
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              <PortalCard
                title="Kids Zone"
                gradient="bg-gradient-to-br from-pink-400 to-orange-400"
                features={[
                  "Child-friendly content",
                  "Educational highlights",
                  "Safe browsing",
                  "Large visuals",
                ]}
                buttonText="Explore Kids Zone"
                onClick={() => setShowAuthModal(true)}
              />
              <PortalCard
                title="Adult News"
                gradient="bg-gradient-to-br from-red-500 via-purple-500 to-blue-600"
                features={[
                  "Latest headlines",
                  "In-depth analysis",
                  "Breaking updates",
                  "Trending stories",
                ]}
                buttonText="Explore Adult News"
                onClick={() => setShowAuthModal(true)}
              />
              <PortalCard
                title="Admin Portal"
                gradient="bg-gradient-to-br from-slate-700 to-slate-900"
                features={[
                  "Content management",
                  "News moderation",
                  "User management",
                  "Analytics",
                ]}
                buttonText="Admin Login"
                onClick={() => navigate("/admin/login")}
                isDark={true}
              />
            </div>
          </div>
        </section>

        {/* AI WORKFLOW SECTION */}
        <section className="py-20 px-4 md:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                Powered by Artificial Intelligence
              </h2>
              <p className="text-xl text-slate-600">
                Four AI modules working together to deliver smarter news
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 items-center">
              {["AI Digest Generation", "Smart Recommendations", "Content Classification", "Personalized Ranking"].map((step, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="w-full bg-gradient-to-br from-indigo-100 to-purple-100 p-8 rounded-2xl border border-indigo-200 mb-4 text-center"
                  >
                    <Zap className="w-8 h-8 text-indigo-600 mx-auto mb-3" />
                    <h3 className="font-bold text-slate-900">{step}</h3>
                  </motion.div>
                  {idx < 3 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      className="hidden lg:block mb-4"
                    >
                      <ChevronRight className="w-6 h-6 text-indigo-600 transform -rotate-90 lg:rotate-0" />
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* DAILY QUIZ SECTION */}
        <section className="py-20 px-4 md:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* LEFT CONTENT */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                  Sharpen your current affairs in just 2 minutes a day
                </h2>
                <p className="text-lg text-slate-600 mb-8">
                  Fresh questions generated from the latest news articles. Challenge yourself and stay informed at the same time.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAuthModal(true)}
                  className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
                >
                  Start Daily Quiz <ArrowRight className="w-5 h-5" />
                </motion.button>
              </motion.div>

              {/* RIGHT PREVIEW CARD */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-orange-50 to-red-50 p-8 rounded-3xl border-2 border-orange-200"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-slate-900">Question 1 of 5</h3>
                  <div className="text-2xl font-bold text-red-600">2:45</div>
                </div>

                <div className="bg-white rounded-2xl p-6 mb-6">
                  <p className="text-lg font-semibold text-slate-900 mb-6">
                    Which country recently launched a new lunar mission?
                  </p>

                  <div className="space-y-3">
                    {["A", "B", "C", "D"].map((option) => (
                      <button
                        key={option}
                        className="w-full p-4 text-left border-2 border-slate-200 rounded-xl font-medium text-slate-700 hover:border-indigo-500 hover:bg-indigo-50 transition-all"
                      >
                        <span className="font-bold text-indigo-600 mr-3">{option}</span>
                        Answer option {option}
                      </button>
                    ))}
                  </div>
                </div>

                <motion.div
                  animate={{ width: ["0%", "100%"] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="h-1 bg-gradient-to-r from-orange-500 to-red-600 rounded-full"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-20 px-4 md:px-6 lg:px-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-red-600">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Stay Informed?
              </h2>
              <p className="text-xl text-white/90 mb-10">
                Join thousands of readers using AI-powered news to stay ahead
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/register")}
                  className="px-8 py-4 bg-white text-indigo-600 font-bold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  Register Free <ArrowRight className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/login")}
                  className="px-8 py-4 bg-white/20 text-white font-bold rounded-xl border-2 border-white hover:bg-white/30 transition-all"
                >
                  Login
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
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
