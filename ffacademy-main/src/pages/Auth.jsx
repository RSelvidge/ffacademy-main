import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import { Auth, isFederatedConfigured, federatedProviders } from "@/api/aws";

const PROVIDER_META = {
  Google: {
    label: "Google",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
        <path fill="#4285F4" d="M23.5 12.27c0-.85-.08-1.66-.22-2.45H12v4.64h6.45a5.52 5.52 0 0 1-2.39 3.62v3h3.86c2.26-2.09 3.58-5.16 3.58-8.81z" />
        <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.86-3c-1.07.72-2.44 1.14-4.08 1.14-3.13 0-5.78-2.11-6.73-4.96H1.29v3.1A12 12 0 0 0 12 24z" />
        <path fill="#FBBC05" d="M5.27 14.27a7.2 7.2 0 0 1 0-4.54v-3.1H1.29a12 12 0 0 0 0 10.74l3.98-3.1z" />
        <path fill="#EA4335" d="M12 4.77c1.76 0 3.35.61 4.6 1.8l3.42-3.42A11.98 11.98 0 0 0 1.29 6.63l3.98 3.1C6.22 6.88 8.87 4.77 12 4.77z" />
      </svg>
    ),
  },
  Microsoft: {
    label: "Microsoft",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
        <rect x="1" y="1" width="10.5" height="10.5" fill="#F25022" />
        <rect x="12.5" y="1" width="10.5" height="10.5" fill="#7FBA00" />
        <rect x="1" y="12.5" width="10.5" height="10.5" fill="#00A4EF" />
        <rect x="12.5" y="12.5" width="10.5" height="10.5" fill="#FFB900" />
      </svg>
    ),
  },
  Yahoo: {
    label: "Yahoo",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
        <path fill="#5F01D1" d="M0 5.9h4.7l2.8 7 2.8-7h4.6L8 22.5H3.4l1.9-4.4L0 5.9zm18.2 5.6h-5.1L17.6 1.5H22.7l-4.5 10zm-4.4 1.3a2.9 2.9 0 1 1 0 5.8 2.9 2.9 0 0 1 0-5.8z" />
      </svg>
    ),
  },
};

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

  // Surface a failure from a social-login redirect (stored before the reload)
  useEffect(() => {
    const oauthError = Auth.consumeOAuthError();
    if (oauthError) setError(oauthError);
  }, []);

  const handleFederated = async (provider) => {
    setError(null);
    try {
      await Auth.federatedSignIn(provider); // navigates away on success
    } catch (err) {
      setError(err.message || "Social sign-in failed. Please try again.");
    }
  };

  const socialProviders = isFederatedConfigured
    ? federatedProviders.filter((p) => PROVIDER_META[p])
    : [];

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

          {socialProviders.length > 0 && !needsVerification && (
            <>
              <div className="space-y-3 mb-4">
                {socialProviders.map((provider) => (
                  <button
                    key={provider}
                    type="button"
                    onClick={() => handleFederated(provider)}
                    className="w-full py-3 px-4 bg-white font-black uppercase border-2 border-black shadow-[4px_4px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000] transition-all flex items-center justify-center gap-3"
                  >
                    {PROVIDER_META[provider].icon}
                    <span>
                      {mode === "signup" ? "Sign up" : "Sign in"} with {PROVIDER_META[provider].label}
                    </span>
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 border-t-2 border-black" />
                <span className="text-xs font-black uppercase">or use email</span>
                <div className="flex-1 border-t-2 border-black" />
              </div>
            </>
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
