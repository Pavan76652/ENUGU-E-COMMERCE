// In-memory access token store. The access token is intentionally NOT persisted
// to localStorage to reduce XSS risk — persistence is handled by the httpOnly
// refresh-token cookie, and a fresh access token is obtained via silent refresh
// on page load. This module is the single source of truth shared by the axios
// client and the redux auth slice (kept dependency-free to avoid import cycles).

let accessToken = null;

export const getAccessToken = () => accessToken;

export const setAccessToken = (token) => {
  accessToken = token ?? null;
};

export const clearAccessToken = () => {
  accessToken = null;
};

export default { getAccessToken, setAccessToken, clearAccessToken };
