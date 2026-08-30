import apiClient from "./apiClient";

export async function signUp({ role, userName, email, password, contactNo }) {
  const response = await apiClient.post("/auth/signup", {
    role,
    userName,
    email,
    password,
    contactNo,
  });
  return response.data;
}

export async function logIn({ role, email, password }) {
  const response = await apiClient.post("/auth/login", {
    role,
    email,
    password,
  });
  return response.data;
}

export async function sendOtp(email, userName) {
  const response = await apiClient.post("/auth/send-otp", { email, userName });
  return response.data;
}

export async function verifyOtp(email, otp) {
  const response = await apiClient.post("/auth/verify-otp", { email, otp });
  return response.data;
}

export async function checkSession() {
  try {
    const response = await apiClient.get("/auth/check-session");
    return response.data;
  } catch (err) {
    return { authenticated: false, isVerified: false };
  }
}

export async function logoutUser() {
  try {
    await apiClient.post("/auth/logout");
  } catch (err) {
    console.warn("Logout error:", err.message);
  }
  localStorage.removeItem("gruhinezz_token");
  localStorage.removeItem("gruhinezz_user");
}
