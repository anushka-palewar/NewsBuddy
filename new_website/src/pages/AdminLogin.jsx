import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";

const OTP_TIME_SECONDS = 300; // 5 minutes

const AdminLogin = () => {
  const [step, setStep] = useState("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(OTP_TIME_SECONDS);
  const navigate = useNavigate();
  const { requestAdminOtp, verifyAdminOtp } = useAuth();

  const isValidAdminEmail = useMemo(
    () => email.toLowerCase().endsWith("@admin.com"),
    [email]
  );

  useEffect(() => {
    if (step !== "otp" || secondsLeft <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [step, secondsLeft]);

  const startOtpCountdown = () => {
    setSecondsLeft(OTP_TIME_SECONDS);
  };

  const handleCredentials = async () => {
    setLoading(true);
    setError("");

    if (!isValidAdminEmail) {
      setError("Please use an @admin.com email address.");
      setLoading(false);
      return;
    }

    const result = await requestAdminOtp(email, password);
    if (result.success) {
      setStep("otp");
      startOtpCountdown();
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  const handleVerify = async () => {
    setLoading(true);
    setError("");

    const result = await verifyAdminOtp(email, otp);
    if (result.success) {
      navigate("/admin/dashboard");
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  const handleResend = async () => {
    setError("");
    setLoading(true);

    const result = await requestAdminOtp(email, password);
    if (result.success) {
      startOtpCountdown();
      setOtp("");
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-xl shadow-md w-full max-w-md p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
          <p className="text-sm text-gray-500">Secure administrator access</p>
        </div>

        {step === "credentials" ? (
          <>
            <input
              type="email"
              placeholder="admin@admin.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg mb-4 focus:ring-2 focus:ring-gray-700 outline-none"
            />
            <input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg mb-4 focus:ring-2 focus:ring-gray-700 outline-none"
            />

            {error && (
              <div className="text-red-600 text-sm text-center mb-4">{error}</div>
            )}

            <button
              onClick={handleCredentials}
              disabled={loading}
              className="w-full bg-black text-white py-2 rounded-lg font-semibold hover:bg-gray-800 transition disabled:opacity-50"
            >
              {loading ? "Sending OTP..." : "Continue"}
            </button>
          </>
        ) : (
          <>
            <div className="mb-4 text-center">
              <p className="text-gray-700">An OTP has been sent to {email}</p>
              <p className="text-sm text-gray-500">
                Expires in {Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, '0')}
              </p>
            </div>

            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg mb-4 focus:ring-2 focus:ring-gray-700 outline-none"
            />

            {error && (
              <div className="text-red-600 text-sm text-center mb-4">{error}</div>
            )}

            <button
              onClick={handleVerify}
              disabled={loading}
              className="w-full bg-black text-white py-2 rounded-lg font-semibold hover:bg-gray-800 transition disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <div className="text-center mt-4">
              <button
                onClick={handleResend}
                disabled={loading || secondsLeft > 0}
                className="text-sm text-indigo-600 hover:underline"
              >
                Resend OTP
              </button>
            </div>
          </>
        )}

        <p className="text-xs text-gray-400 text-center mt-6">
          © {new Date().getFullYear()} NewsBuddy Admin Panel
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;


