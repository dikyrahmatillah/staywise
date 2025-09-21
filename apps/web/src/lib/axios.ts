import axios, { AxiosRequestHeaders } from "axios";

export const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ||
    (typeof window !== "undefined"
      ? `${window.location.protocol}//${window.location.hostname}:8000/api/v1`
      : "http://localhost:8000/api/v1"),
  withCredentials: false,
});

let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

export function getAuthToken() {
  return authToken;
}

api.interceptors.request.use((config) => {
  const token = authToken;
  if (token) {
    const prev = (config.headers || {}) as Record<string, unknown>;
    const next = {
      ...prev,
      Authorization: `Bearer ${token}`,
    } as unknown as AxiosRequestHeaders;
    config.headers = next;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(err)
);

export default api;
