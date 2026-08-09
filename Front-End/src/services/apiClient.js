import axios from "axios";

/**
 * Centralized Axios instance.
 *
 * The base URL is read from an environment variable so the same frontend
 * build can point at different backend environments (local, staging, prod)
 * without any code changes.
 *
 * Create a `.env` file in the project root (see `.env.example`) with:
 *   VITE_API_BASE_URL=http://localhost:5000/api
 *
 * TODO: Connect this baseURL to the real Node.js backend once it is deployed.
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Attach the auth token (if present) to every outgoing request.
 * TODO: Once the backend issues real JWTs on login/signup, this will
 * automatically authenticate subsequent requests.
 */
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("gruhinezz_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
