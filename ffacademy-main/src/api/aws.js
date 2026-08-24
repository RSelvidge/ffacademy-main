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

export const isBackendConfigured = Boolean(API_URL && POOL_ID && CLIENT_ID);

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
    return new Promise((resolve) => {
      pool.getCurrentUser()?.getSession((err, session) => {
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
