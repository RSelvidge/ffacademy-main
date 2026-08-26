import React, { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { Auth } from "@/api/aws";

export default function AuthPage() {
  const { handleLogin } = useAuth();
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [needsVerification, setNeedsVerification] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      if (mode === "signup" && !needsVerification) {
        await Auth.signUp(email, password, fullName);
        setNeedsVerification(true);
      } else if (mode === "signup" && needsVerification) {
        await Auth.confirmSignUp(email, verificationCode);
        await handleLogin(email, password);
      } else {
        await handleLogin(email, password);
      }
      // On success the app re-checks auth state and redirects to Onboarding/Dashboard
      window.location.href = window.location.origin;
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    }
    setIsLoading(false);
  };

  const inputClass =
    "w-full px-4 py-3 border-2 border-black rounded-none focus:outline-none focus:shadow-[3px_3px_0px_#000]";

  return (
    <div className="min-h-screen bg-yellow-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black tracking-tight border-2 border-black bg-white inline-block px-4 py-2 shadow-[5px_5px_0px_#000] mb-4">
            FFACADEMY
          </h1>
          <p className="text-lg font-bold uppercase">Dominate Your League</p>
        </div>

        <div className="bg-white border-2 border-black shadow-[6px_6px_0px_#000] p-6">
          <h2 className="text-2xl font-black uppercase mb-4">
            {mode === "signup" ? "Create Account" : "Sign In"}
          </h2>

          {needsVerification && (
            <p className="mb-4 p-3 border-2 border-black bg-green-100 text-sm font-bold">
              Check your email for a verification code, then enter it below to finish signing up.
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && !needsVerification && (
              <input
                type="text"
                placeholder="Full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={inputClass}
              />
            )}
            {needsVerification && (
              <input
                type="text"
                placeholder="Verification code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className={inputClass}
              />
            )}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={inputClass}
            />
            <input
              type="password"
              placeholder="Password (min 8 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className={inputClass}
            />

            {error && <p className="p-3 border-2 border-black bg-red-100 text-sm font-bold">{error}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-blue-500 text-white font-black uppercase border-2 border-black shadow-[4px_4px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000] transition-all disabled:opacity-50"
            >
              {isLoading ? "Please wait..." : mode === "signup" ? (needsVerification ? "Verify & Continue" : "Sign Up") : "Sign In"}
            </button>
          </form>

          <button
            onClick={() => {
              setMode(mode === "signin" ? "signup" : "signin");
              setNeedsVerification(false);
              setError(null);
            }}
            className="mt-4 w-full text-sm font-bold underline"
          >
            {mode === "signin" ? "Need an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}
