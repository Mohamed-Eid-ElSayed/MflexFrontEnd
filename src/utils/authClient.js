import axios from "axios";

const backendURL =
  "https://mflex-back-end.vercel.app" || "http://localhost:5000";

export const authClient = axios.create({
  baseURL: backendURL,
  headers: { "Content-Type": "application/json" },
});

authClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (import.meta.env.VITE_DEBUG_AUTH === "true") {
      // Useful to confirm Authorization header is present in production
      // (you should still verify in the Network tab)
      console.log("[authClient] request", {
        method: config.method,
        url: `${config.baseURL || ""}${config.url || ""}`,
        hasToken: Boolean(token),
        hasAuthHeader: Boolean(config.headers?.Authorization),
      });
    }

    return config;
  },
  (error) => Promise.reject(error),
);

