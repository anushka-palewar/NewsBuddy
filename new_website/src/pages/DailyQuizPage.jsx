import { useEffect, useState } from "react";
import { useAuth } from "../components/AuthContext";
import { Link } from "react-router-dom";
import {
  getTodayQuiz,
  submitQuizAnswers,
  getQuizHistory,
  getWeeklyLeaderboard,
  generateQuizManually,
} from "../services/newsService";

const DailyQuizPage = () => {
  const { user } = useAuth();
  const isLoggedIn = !!user;
  const isAdmin = user?.role === "ADMIN";

  // Quiz state
  const [questions, setQuestions] = useState([]);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizError, setQuizError] = useState("");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // questionId -> chosenOption
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizResult, setQuizResult] = useState(null); // score, total, etc.
  const [quizSubmitting, setQuizSubmitting] = useState(false);

  // History & Leaderboard state
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);
  const [adminGenerating, setAdminGenerating] = useState(false);

  // Fetch initial data
  useEffect(() => {
    fetchQuiz();
    fetchLeaderboard();
    if (isLoggedIn) {
      fetchHistory();
    }
  }, [isLoggedIn]);

  const fetchQuiz = async () => {
    setQuizLoading(true);
    setQuizError("");
    try {
      const data = await getTodayQuiz();
      setQuestions(data || []);
    } catch (err) {
      setQuizError("Failed to fetch today's quiz.");
    } finally {
      setQuizLoading(false);
    }
  };

  const fetchHistory = async () => {
    setHistoryLoading(true);
    try {
      const data = await getQuizHistory();
      setHistory(data || []);
    } catch (err) {
      console.error("Failed to load history", err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const fetchLeaderboard = async () => {
    setLeaderboardLoading(true);
    try {
      const data = await getWeeklyLeaderboard();
      setLeaderboard(data || []);
    } catch (err) {
      console.error("Failed to load leaderboard", err);
    } finally {
      setLeaderboardLoading(false);
    }
  };

  const handleGenerateManually = async () => {
    setAdminGenerating(true);
    setQuizError("");
    try {
      await generateQuizManually();
      await fetchQuiz();
    } catch (err) {
      setQuizError("Manual generation failed.");
    } finally {
      setAdminGenerating(false);
    }
  };

  const handleOptionSelect = (qId, option) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [qId]: option,
    }));
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    // Validate that all questions are answered
    if (Object.keys(selectedAnswers).length < questions.length) {
      alert("Please answer all questions before submitting.");
      return;
    }

    setQuizSubmitting(true);
    try {
      const res = await submitQuizAnswers(selectedAnswers);
      if (res) {
        setQuizResult(res);
        // Refresh history
        fetchHistory();
        fetchLeaderboard();
      }
    } catch (err) {
      alert("Failed to submit quiz. Please try again.");
    } finally {
      setQuizSubmitting(false);
    }
  };

  const handleResetQuiz = () => {
    setQuizStarted(false);
    setQuizResult(null);
    setSelectedAnswers({});
    setCurrentIdx(0);
    fetchQuiz();
  };

  const progressPercent = questions.length
    ? Math.round(((currentIdx + 1) / questions.length) * 100)
    : 0;

  const currentQuestion = questions[currentIdx];

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* PAGE HEADER */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">🏆</span>
            <h1 className="text-3xl font-bold text-gray-900">Daily Quiz</h1>
          </div>
          <p className="text-gray-600">
            Test your current events knowledge with daily questions generated from yesterday's top headlines!
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={handleGenerateManually}
            disabled={adminGenerating}
            className="self-start md:self-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition disabled:opacity-50 flex items-center gap-2"
          >
            {adminGenerating ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Generating...
              </>
            ) : (
              <>⚙️ Generate Quiz Manually</>
            )}
          </button>
        )}
      </div>

      {/* MAIN CONTAINER */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: QUIZ AREA (SPANS 2 COLS) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* TODAY'S QUIZ CARD */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-4">
              <div className="flex items-center gap-3 text-white">
                <span className="text-2xl">🧠</span>
                <div>
                  <h2 className="text-lg font-bold">Today's AI Quiz</h2>
                  <p className="text-indigo-200 text-sm">5 custom questions based on recent news</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              {quizLoading ? (
                <div className="flex flex-col items-center py-16">
                  <svg className="animate-spin h-10 w-10 text-indigo-500 mb-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <p className="text-gray-500 text-sm">Loading quiz questions...</p>
                </div>
              ) : quizError ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-600 text-sm font-medium">⚠️ {quizError}</p>
                  <button onClick={fetchQuiz} className="mt-2 text-red-600 underline text-sm hover:text-red-800">
                    Try again
                  </button>
                </div>
              ) : !isLoggedIn ? (
                <div className="text-center py-10">
                  <div className="text-5xl mb-4">🔒</div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Login Required</h3>
                  <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6">
                    You must be logged in to take the daily quiz, submit answers, and track your progress.
                  </p>
                  <Link
                    to="/login"
                    className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 rounded-lg shadow-sm transition"
                  >
                    Go to Login
                  </Link>
                </div>
              ) : questions.length === 0 ? (
                <div className="text-center py-10">
                  <div className="text-5xl mb-4">📭</div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Quiz Not Generated Yet</h3>
                  <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6">
                    There are no questions generated for today. Please check back later, or ask an admin to generate it.
                  </p>
                  {isAdmin && (
                    <button
                      onClick={handleGenerateManually}
                      disabled={adminGenerating}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition"
                    >
                      Generate Now
                    </button>
                  )}
                </div>
              ) : quizResult ? (
                /* RESULT SCREEN */
                <div className="space-y-8">
                  <div className="text-center py-6 bg-indigo-50 rounded-xl border border-indigo-100">
                    <h3 className="text-3xl font-extrabold text-indigo-900 mb-2">
                      Score: {quizResult.score} / {quizResult.totalQuestions}
                    </h3>
                    <p className="text-indigo-700 font-medium mb-4">
                      {quizResult.score >= 4 ? "🌟 Excellent work!" : quizResult.score >= 2 ? "👍 Good effort!" : "📚 Keep learning!"}
                    </p>
                    <div className="flex justify-center gap-6 text-sm">
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                        ✅ Correct: {quizResult.correctAnswers}
                      </span>
                      <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full font-medium">
                        ❌ Wrong: {quizResult.wrongAnswers}
                      </span>
                    </div>
                  </div>

                  {/* CORRECT ANSWERS REVIEW */}
                  <div>
                    <h4 className="font-bold text-gray-800 mb-4">Review Your Answers:</h4>
                    <div className="space-y-4">
                      {questions.map((q, idx) => {
                        const userAns = selectedAnswers[q.id];
                        const correctAns = q.correctOption;
                        const isCorrect = userAns === correctAns;

                        return (
                          <div key={q.id} className="border rounded-lg p-4 bg-gray-50 space-y-2">
                            <p className="text-sm font-semibold text-gray-800">
                              {idx + 1}. {q.question}
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                              <div className={`p-2 rounded border ${correctAns === "A" ? "bg-green-100 border-green-300 font-semibold" : userAns === "A" ? "bg-red-100 border-red-300" : "bg-white"}`}>
                                A) {q.optionA}
                              </div>
                              <div className={`p-2 rounded border ${correctAns === "B" ? "bg-green-100 border-green-300 font-semibold" : userAns === "B" ? "bg-red-100 border-red-300" : "bg-white"}`}>
                                B) {q.optionB}
                              </div>
                              <div className={`p-2 rounded border ${correctAns === "C" ? "bg-green-100 border-green-300 font-semibold" : userAns === "C" ? "bg-red-100 border-red-300" : "bg-white"}`}>
                                C) {q.optionC}
                              </div>
                              <div className={`p-2 rounded border ${correctAns === "D" ? "bg-green-100 border-green-300 font-semibold" : userAns === "D" ? "bg-red-100 border-red-300" : "bg-white"}`}>
                                D) {q.optionD}
                              </div>
                            </div>
                            <div className="text-xs pt-1 flex items-center justify-between">
                              <span className={isCorrect ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                                {isCorrect ? "✓ Correct" : `✗ You answered: ${userAns}`}
                              </span>
                              {!isCorrect && (
                                <span className="text-green-700 font-medium">
                                  Correct Answer: {correctAns}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    onClick={handleResetQuiz}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg transition"
                  >
                    Retake Quiz / Refresh
                  </button>
                </div>
              ) : !quizStarted ? (
                /* START QUIZ SCREEN */
                <div className="text-center py-10">
                  <div className="text-5xl mb-4">⚡</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Ready to test yourself?</h3>
                  <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6">
                    This quiz consists of 5 multiple-choice questions designed to test your knowledge of today's top stories.
                  </p>
                  <button
                    onClick={() => setQuizStarted(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-lg shadow-sm transition"
                  >
                    Start Quiz
                  </button>
                </div>
              ) : (
                /* ACTIVE QUIZ SCREEN */
                <div className="space-y-6">
                  {/* Progress Header */}
                  <div className="flex justify-between items-center text-sm font-semibold text-gray-700">
                    <span>Question {currentIdx + 1} of {questions.length}</span>
                    <span>{progressPercent}% Complete</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  {/* Question Text */}
                  <div className="py-4">
                    <h3 className="text-lg font-bold text-gray-900 leading-snug">
                      {currentQuestion.question}
                    </h3>
                  </div>

                  {/* Options List */}
                  <div className="space-y-3">
                    {[
                      { key: "A", text: currentQuestion.optionA },
                      { key: "B", text: currentQuestion.optionB },
                      { key: "C", text: currentQuestion.optionC },
                      { key: "D", text: currentQuestion.optionD },
                    ].map((opt) => {
                      const isSelected = selectedAnswers[currentQuestion.id] === opt.key;
                      return (
                        <button
                          key={opt.key}
                          onClick={() => handleOptionSelect(currentQuestion.id, opt.key)}
                          className={`w-full text-left p-4 rounded-xl border-2 transition flex items-center gap-3 ${
                            isSelected
                              ? "border-indigo-600 bg-indigo-50 text-indigo-900 font-semibold"
                              : "border-gray-200 hover:border-indigo-200 hover:bg-gray-50 text-gray-700"
                          }`}
                        >
                          <span
                            className={`w-6 h-6 rounded-full flex items-center justify-center border font-bold text-xs ${
                              isSelected
                                ? "bg-indigo-600 text-white border-indigo-600"
                                : "bg-white text-gray-400 border-gray-300"
                            }`}
                          >
                            {opt.key}
                          </span>
                          <span className="text-sm">{opt.text}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                    <button
                      onClick={handlePrev}
                      disabled={currentIdx === 0}
                      className="px-4 py-2 border rounded-lg text-sm font-semibold hover:bg-gray-50 transition disabled:opacity-40"
                    >
                      ← Back
                    </button>

                    {currentIdx < questions.length - 1 ? (
                      <button
                        onClick={handleNext}
                        disabled={!selectedAnswers[currentQuestion.id]}
                        className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition disabled:opacity-45"
                      >
                        Next Question →
                      </button>
                    ) : (
                      <button
                        onClick={handleSubmitQuiz}
                        disabled={Object.keys(selectedAnswers).length < questions.length || quizSubmitting}
                        className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-lg shadow-sm transition disabled:opacity-45 flex items-center gap-2"
                      >
                        {quizSubmitting ? "Submitting..." : "Submit Quiz ✓"}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* QUIZ HISTORY TABLE */}
          {isLoggedIn && (
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
                <h3 className="font-bold text-gray-900">Your Quiz History</h3>
              </div>
              <div className="p-6">
                {historyLoading ? (
                  <p className="text-center text-sm text-gray-500">Loading history...</p>
                ) : history.length === 0 ? (
                  <p className="text-center text-sm text-gray-400 py-4">No attempts recorded yet. Take your first quiz today!</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead>
                        <tr className="border-b text-gray-500 font-semibold">
                          <th className="py-2.5">Date</th>
                          <th className="py-2.5">Score</th>
                          <th className="py-2.5">Percentage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {history.map((h) => {
                          const percent = Math.round((h.score / h.totalQuestions) * 100);
                          return (
                            <tr key={h.id} className="border-b hover:bg-gray-50 transition">
                              <td className="py-3 font-medium text-gray-800">
                                {new Date(h.submittedAt).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </td>
                              <td className="py-3 text-gray-700 font-semibold">{h.score} / {h.totalQuestions}</td>
                              <td className="py-3">
                                <span
                                  className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                    percent >= 80
                                      ? "bg-green-100 text-green-800"
                                      : percent >= 50
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-gray-100 text-gray-800"
                                  }`}
                                >
                                  {percent}%
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: WEEKLY LEADERBOARD */}
        <div className="space-y-8">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4">
              <div className="flex items-center gap-3 text-white">
                <span className="text-2xl font-bold">🏆</span>
                <div>
                  <h2 className="text-lg font-bold">Weekly Leaderboard</h2>
                  <p className="text-amber-100 text-sm">Top scores from the past 7 days</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              {leaderboardLoading ? (
                <div className="flex justify-center py-8">
                  <svg className="animate-spin h-6 w-6 text-amber-500" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                </div>
              ) : leaderboard.length === 0 ? (
                <p className="text-center text-sm text-gray-400 py-6">No leaderboard scores available yet.</p>
              ) : (
                <div className="space-y-4">
                  {leaderboard.map((player) => {
                    const isTop3 = player.rank <= 3;
                    const trophy = player.rank === 1 ? "🥇" : player.rank === 2 ? "🥈" : player.rank === 3 ? "🥉" : null;

                    return (
                      <div
                        key={player.rank}
                        className={`flex items-center justify-between p-3 rounded-xl border transition ${
                          player.rank === 1
                            ? "border-amber-200 bg-amber-50"
                            : player.rank === 2
                            ? "border-slate-200 bg-slate-50"
                            : player.rank === 3
                            ? "border-orange-200 bg-orange-50"
                            : "border-gray-100 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-7 text-center font-bold text-gray-500">
                            {trophy || `#${player.rank}`}
                          </span>
                          <span className="font-semibold text-gray-800 text-sm">
                            {player.username}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-gray-400 block">Total score</span>
                          <span className="font-extrabold text-indigo-700 text-sm">{player.score} pts</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DailyQuizPage;
