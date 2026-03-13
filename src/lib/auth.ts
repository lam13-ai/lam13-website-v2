export interface StoredAuth {
  accessToken: string;
  refreshToken: string;
  userId: string;
  email: string;
  fullName: string;
}

const AUTH_KEY = "lam13_auth";
const LEGACY_USER_KEY = "lam13_user";
const ACTIVE_CHAT_KEY = "lam13_active_chat";

export const saveAuth = (auth: StoredAuth) => {
  localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
  localStorage.setItem(
    LEGACY_USER_KEY,
    JSON.stringify({
      user_id: auth.userId,
      name: auth.fullName || auth.email.split("@")[0],
      email: auth.email,
    }),
  );
};

export const getAuth = (): StoredAuth | null => {
  const raw = localStorage.getItem(AUTH_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredAuth;
  } catch {
    return null;
  }
};

export const clearAuth = () => {
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(LEGACY_USER_KEY);
  localStorage.removeItem(ACTIVE_CHAT_KEY);
};

export const getAccessToken = () => getAuth()?.accessToken ?? "";

export const getActiveChatId = () => localStorage.getItem(ACTIVE_CHAT_KEY) ?? "";

export const setActiveChatId = (sessionId: string) => {
  localStorage.setItem(ACTIVE_CHAT_KEY, sessionId);
};
