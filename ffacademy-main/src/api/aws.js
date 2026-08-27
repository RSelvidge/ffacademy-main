// AWS-backed API client replacing the Base44 SDK.
// Config comes from Vite env vars (see .env.example). When unset, the app
// reports a clear "backend not configured" error instead of crashing.
import {
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
  AuthenticationDetails,
} from "amazon-cognito-identity-js";

const API_URL = import.meta.env.VITE_API_URL;
const POOL_ID = import.meta.env.VITE_COGNITO_USER_POOL_ID;
const CLIENT_ID = import.meta.env.VITE_COGNITO_CLIENT_ID;
const REGION = import.meta.env.VITE_COGNITO_REGION || "us-east-1";
// Cognito hosted-UI domain, e.g. "ffacademy-auth.auth.us-east-1.amazoncognito.com"
const OAUTH_DOMAIN = (import.meta.env.VITE_COGNITO_DOMAIN || "")
  .replace(/^https?:\/\//, "")
  .replace(/\/$/, "");

export const isBackendConfigured = Boolean(API_URL && POOL_ID && CLIENT_ID);
export const isFederatedConfigured = Boolean(isBackendConfigured && OAUTH_DOMAIN);

// Provider names must match the Cognito identity-provider names in aws/template.yaml.
export const federatedProviders = (import.meta.env.VITE_OAUTH_PROVIDERS || "Google,Microsoft,Yahoo")
  .split(",")
  .map((p) => p.trim())
  .filter(Boolean);

const pool = isBackendConfigured
  ? new CognitoUserPool({ UserPoolId: POOL_ID, ClientId: CLIENT_ID })
  : null;

let cachedProfile = null;
let cachedSession = null;

const notConfigured = () => {
  throw new Error(
    "Backend not configured. Set VITE_API_URL, VITE_COGNITO_USER_POOL_ID and VITE_COGNITO_CLIENT_ID (see .env.example)."
  );
};

// ---------- Auth ----------

const getCognitoUser = (username) =>
  new CognitoUser({ Username: username, Pool: pool });

// --- Hosted-UI OAuth (Google / Microsoft / Yahoo) via authorization code + PKCE ---

const OAUTH_STORAGE_KEY = "ffa_oauth_pkce";
const OAUTH_ERROR_KEY = "ffa_oauth_error";

const base64UrlEncode = (bytes) =>
  btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

const sha256 = async (str) =>
  new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str)));

const decodeJwtPayload = (token) =>
  JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));

// Cognito must have this exact URL in the app client's CallbackURLs. The hash
// route is dropped on purpose: Cognito appends ?code=... before the fragment.
const oauthRedirectUri = () => window.location.origin + import.meta.env.BASE_URL;

// Persist hosted-UI tokens in the same localStorage keys amazon-cognito-identity-js
// uses, so getSession()/token refresh work identically for federated users.
function storeHostedUiSession({ id_token, access_token, refresh_token }) {
  const username = decodeJwtPayload(id_token)["cognito:username"];
  const prefix = `CognitoIdentityServiceProvider.${CLIENT_ID}`;
  localStorage.setItem(`${prefix}.LastAuthUser`, username);
  localStorage.setItem(`${prefix}.${username}.idToken`, id_token);
  localStorage.setItem(`${prefix}.${username}.accessToken`, access_token);
  if (refresh_token) localStorage.setItem(`${prefix}.${username}.refreshToken`, refresh_token);
  localStorage.setItem(`${prefix}.${username}.clockDrift`, "0");
  cachedSession = null;
  cachedProfile = null;
}

export const Auth = {
  async fetchProfile() {
    if (!isBackendConfigured) return notConfigured();
    cachedProfile = await apiFetch("/profile");
    return cachedProfile;
  },

  signUp(email, password, fullName) {
    if (!pool) return notConfigured();
    return new Promise((resolve, reject) => {
      const attributes = [
        new CognitoUserAttribute({ Name: "email", Value: email }),
        ...(fullName ? [new CognitoUserAttribute({ Name: "name", Value: fullName })] : []),
      ];
      pool.signUp(email, password, attributes, null, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  },

  confirmSignUp(email, code) {
    if (!pool) return notConfigured();
    return new Promise((resolve, reject) => {
      getCognitoUser(email).confirmRegistration(code, true, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  },

  // Redirects to the Cognito hosted UI for a social provider ("Google",
  // "Microsoft", "Yahoo"). The browser leaves the app; sign-in completes in
  // completeFederatedSignIn() after Cognito redirects back with ?code=...
  async federatedSignIn(provider) {
    if (!isFederatedConfigured) {
      throw new Error("Social sign-in is not configured. Set VITE_COGNITO_DOMAIN and rebuild.");
    }
    const verifier = base64UrlEncode(crypto.getRandomValues(new Uint8Array(32)));
    const challenge = base64UrlEncode(await sha256(verifier));
    const state = base64UrlEncode(crypto.getRandomValues(new Uint8Array(16)));
    const redirectUri = oauthRedirectUri();
    sessionStorage.setItem(OAUTH_STORAGE_KEY, JSON.stringify({ verifier, state, redirectUri }));
    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      response_type: "code",
      scope: "openid email profile",
      redirect_uri: redirectUri,
      identity_provider: provider,
      state,
      code_challenge: challenge,
      code_challenge_method: "S256",
    });
    window.location.assign(`https://${OAUTH_DOMAIN}/oauth2/authorize?${params}`);
  },

  // Called on app load. If the URL carries an OAuth code (or error) from the
  // hosted UI, finish the flow and clean the URL. Returns true when a session
  // was established; failures are stashed for the Auth page (consumeOAuthError).
  async completeFederatedSignIn() {
    if (!isFederatedConfigured) return false;
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const oauthError = params.get("error");
    if (!code && !oauthError) return false;

    const errorDescription = params.get("error_description");
    const state = params.get("state");
    ["code", "state", "error", "error_description"].forEach((k) => params.delete(k));
    const rest = params.toString();
    window.history.replaceState(
      {},
      "",
      window.location.pathname + (rest ? `?${rest}` : "") + window.location.hash
    );

    try {
      if (oauthError) throw new Error(errorDescription || `Sign-in failed (${oauthError}).`);
      const stored = JSON.parse(sessionStorage.getItem(OAUTH_STORAGE_KEY) || "null");
      sessionStorage.removeItem(OAUTH_STORAGE_KEY);
      if (!stored || stored.state !== state) {
        throw new Error("Sign-in session expired. Please try again.");
      }
      const res = await fetch(`https://${OAUTH_DOMAIN}/oauth2/token`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          client_id: CLIENT_ID,
          code,
          redirect_uri: stored.redirectUri,
          code_verifier: stored.verifier,
        }),
      });
      const tokens = await res.json().catch(() => ({}));
      if (!res.ok || !tokens.id_token) {
        throw new Error(tokens.error_description || tokens.error || "Token exchange failed.");
      }
      storeHostedUiSession(tokens);
      return true;
    } catch (err) {
      sessionStorage.setItem(OAUTH_ERROR_KEY, err.message || "Social sign-in failed.");
      return false;
    }
  },

  // One-shot read of the last social sign-in failure (shown on the Auth page).
  consumeOAuthError() {
    const message = sessionStorage.getItem(OAUTH_ERROR_KEY);
    if (message) sessionStorage.removeItem(OAUTH_ERROR_KEY);
    return message;
  },

  signIn(email, password) {
    if (!pool) return notConfigured();
    return new Promise((resolve, reject) => {
      getCognitoUser(email).authenticateUser(
        new AuthenticationDetails({ Username: email, Password: password }),
        {
          onSuccess: (session) => {
            cachedSession = session;
            resolve(session);
          },
          onFailure: reject,
          newPasswordRequired: () => reject(new Error("Password change required. Reset your password first.")),
        }
      );
    });
  },

  async getSession() {
    if (!pool) return null;
    if (cachedSession && cachedSession.isValid()) return cachedSession;
    const currentUser = pool.getCurrentUser();
    if (!currentUser) return null;
    return new Promise((resolve) => {
      currentUser.getSession((err, session) => {
        if (err || !session?.isValid()) {
          cachedSession = null;
          resolve(null);
        } else {
          cachedSession = session;
          resolve(session);
        }
      });
    });
  },

  signOut() {
    cachedSession = null;
    cachedProfile = null;
    pool?.getCurrentUser()?.signOut();
  },

  async getToken() {
    const session = await this.getSession();
    return session?.getIdToken()?.getJwtToken() ?? null;
  },
};

// ---------- REST helpers ----------

async function apiFetch(path, { method = "GET", body } = {}) {
  const token = await Auth.getToken();
  if (!token) throw Object.assign(new Error("Authentication required"), { status: 401 });
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: { "Content-Type": "application/json", Authorization: token },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(data.error || `Request failed (${res.status})`), { status: res.status });
  return data;
}

// ---------- Entities (same method surface the pages used via Base44) ----------

export const User = {
  async me() {
    if (!isBackendConfigured) return notConfigured();
    if (cachedProfile) return cachedProfile;
    cachedProfile = await apiFetch("/profile");
    return cachedProfile;
  },

  async updateMyUserData(data) {
    if (!isBackendConfigured) return notConfigured();
    cachedProfile = await apiFetch("/profile", { method: "PUT", body: data });
    return cachedProfile;
  },

  logout() {
    Auth.signOut();
  },
};

export const LeagueConnection = {
  async list() {
    if (!isBackendConfigured) return notConfigured();
    return apiFetch("/connections");
  },
  async create(data) {
    if (!isBackendConfigured) return notConfigured();
    return apiFetch("/connections", { method: "POST", body: data });
  },
  async update(id, data) {
    if (!isBackendConfigured) return notConfigured();
    return apiFetch(`/connections/${encodeURIComponent(id)}`, { method: "PUT", body: data });
  },
  async delete(id) {
    if (!isBackendConfigured) return notConfigured();
    return apiFetch(`/connections/${encodeURIComponent(id)}`, { method: "DELETE" });
  },
};

// Training content is static; kept in an in-memory store so the existing
// seeding logic in Training.jsx works unchanged. IDs are derived from the
// title so completed-module references survive across sessions.
const trainingStore = new Map();

export const TrainingModule = {
  async list(sortBy) {
    const items = [...trainingStore.values()];
    if (sortBy === "order") items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    return items;
  },
  async create(data) {
    const id =
      data.id ||
      data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const item = { ...data, id };
    trainingStore.set(id, item);
    return item;
  },
};

// ---------- LLM integration (Lambda + Bedrock, with mock fallback) ----------

// The Connections page passes a giant scraping prompt; we extract the URL and
// platform from it and let the Lambda do the actual work.
export async function InvokeLLM({ prompt = "", username, league_url } = {}) {
  if (!isBackendConfigured) return notConfigured();
  const url = league_url || prompt.match(/https?:\/\/[^\s`"'<>]+/)?.[0] || "";
  const platform = /espn/i.test(prompt) ? "espn" : /yahoo/i.test(prompt) ? "yahoo" : /nfl\.com/i.test(prompt) ? "nfl" : "espn";
  const res = await apiFetch("/validate-league", {
    method: "POST",
    body: { platform, league_url: url, username },
  });
  return { success: true, data: res };
}
