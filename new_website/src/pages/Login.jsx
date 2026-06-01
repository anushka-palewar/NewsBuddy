import React, { useState } from 'react';
import { useAuth } from '../components/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(email, password);

    if (result.admin) {
      navigate('/admin/login');
      setLoading(false);
      return;
    }

    if (result.success) {
      // Redirect based on role
      switch (result.role) {
        case 'ADMIN':
          navigate('/admin/dashboard');
          break;
        case 'ADULT':
          navigate('/adult');
          break;
        case 'CHILD':
          navigate('/kids');
          break;
        default:
          navigate('/');
      }
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
  <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 flex">

    {/* LEFT SIDE */}
    <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-16 text-white">

      <div>
        <h1 className="text-6xl font-bold mb-6">
          NewsBuddy
        </h1>

        <p className="text-xl text-gray-200 mb-12 max-w-lg">
          Personalized news powered by AI.
          Stay informed with Daily Quizzes,
          AI Digests and age-appropriate content.
        </p>

        <div className="space-y-6">

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/20">
            <h3 className="font-bold text-lg mb-2">
              🤖 AI Digest
            </h3>
            <p className="text-gray-300">
              Convert lengthy articles into quick summaries.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/20">
            <h3 className="font-bold text-lg mb-2">
              🧠 Daily Quiz
            </h3>
            <p className="text-gray-300">
              Test your current affairs knowledge every day.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/20">
            <h3 className="font-bold text-lg mb-2">
              🎯 Personalized Feed
            </h3>
            <p className="text-gray-300">
              News tailored specifically to your age group.
            </p>
          </div>

        </div>
      </div>

    </div>

    {/* RIGHT SIDE */}
    <div className="w-full lg:w-1/2 flex items-center justify-center px-6">

      <div className="w-full max-w-md">

        <div className="bg-white rounded-3xl shadow-2xl p-10">

          <div className="text-center mb-8">

            <div className="text-5xl mb-4">
              📰
            </div>

            <h2 className="text-3xl font-bold text-gray-900">
              Welcome Back
            </h2>

            <p className="text-gray-500 mt-2">
              Sign in to continue your NewsBuddy journey
            </p>

          </div>

          <form
            className="space-y-5"
            onSubmit={handleSubmit}
          >

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>

              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>

              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/admin/login")}
              className="w-full py-3 rounded-xl border border-red-500 text-red-600 font-semibold hover:bg-red-50 transition"
            >
              Admin Login
            </button>

            <div className="text-center text-sm text-gray-500">
              Don't have an account?
            </div>

            <button
              type="button"
              onClick={() => navigate("/register")}
              className="w-full py-3 rounded-xl border border-indigo-500 text-indigo-600 font-semibold hover:bg-indigo-50 transition"
            >
              Create Account
            </button>

          </form>

          <div className="mt-8 pt-6 border-t">

            <div className="grid grid-cols-3 gap-3 text-center">

              <div>
                <div className="text-xl font-bold text-indigo-600">
                  10K+
                </div>
                <div className="text-xs text-gray-500">
                  Articles
                </div>
              </div>

              <div>
                <div className="text-xl font-bold text-indigo-600">
                  5K+
                </div>
                <div className="text-xs text-gray-500">
                  Users
                </div>
              </div>

              <div>
                <div className="text-xl font-bold text-indigo-600">
                  100+
                </div>
                <div className="text-xs text-gray-500">
                  Categories
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  </div>
);
};

export default Login;