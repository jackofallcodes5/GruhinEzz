import apiClient from "./apiClient";

/**
 * ============================================================================
 * AUTH SERVICE
 * ----------------------------------------------------------------------------
 * All authentication-related API calls (Sign Up / Log In) for the three
 * user roles: buyer, seller, ngo.
 *
 * The functions below are structured so the Node.js backend can be wired
 * in later with minimal changes — just remove the mock branch and keep
 * the axios call.
 *
 * See README.md -> "API Reference" for full endpoint documentation
 * (request/response shape, auth requirements, etc.)
 * ============================================================================
 */

// Flip this to false once the real backend is available and reachable.
const USE_MOCK_API = false;

const mockDelay = (data, ms = 700) =>
  new Promise((resolve) => setTimeout(() => resolve(data), ms));

/**
 * Register a new user (Buyer, Seller, or NGO).
 *
 * @param {Object} payload
 * @param {"buyer"|"seller"|"ngo"} payload.role
 * @param {string} payload.userName
 * @param {string} payload.email
 * @param {string} payload.password
 * @param {string} payload.contactNo
 * @returns {Promise<{user: object, token: string}>}
 */
export async function signUp({ role, userName, email, password, contactNo }) {
  // TODO: Connect this function to the Node.js backend.
  // Real call (once backend is ready):
  //
  // const response = await apiClient.post("/auth/signup", {
  //   role,
  //   userName,
  //   email,
  //   password,
  //   contactNo,
  // });
  // return response.data;

  if (USE_MOCK_API) {
    if (!userName || !email || !password || !contactNo) {
      const error = new Error("All fields are required.");
      throw error;
    }
    return mockDelay({
      user: {
        id: `mock-${Date.now()}`,
        role,
        userName,
        email,
        contactNo,
      },
      token: "mock-jwt-token",
    });
  }

  const response = await apiClient.post("/auth/signup", {
    role,
    userName,
    email,
    password,
    contactNo,
  });
  return response.data;
}

/**
 * Log in an existing user (Buyer, Seller, or NGO).
 *
 * @param {Object} payload
 * @param {"buyer"|"seller"|"ngo"} payload.role
 * @param {string} payload.email
 * @param {string} payload.password
 * @returns {Promise<{user: object, token: string}>}
 */
export async function logIn({ role, email, password }) {
  // TODO: Connect this function to the Node.js backend.
  // Real call (once backend is ready):
  //
  // const response = await apiClient.post("/auth/login", {
  //   role,
  //   email,
  //   password,
  // });
  // return response.data;

  if (USE_MOCK_API) {
    if (!email || !password) {
      const error = new Error("Email and password are required.");
      throw error;
    }
    return mockDelay({
      user: {
        id: "mock-user-id",
        role,
        userName: email.split("@")[0],
        email,
      },
      token: "mock-jwt-token",
    });
  }

  const response = await apiClient.post("/auth/login", {
    role,
    email,
    password,
  });
  return response.data;
}

/**
 * Request an OTP to be sent to the given email address.
 *
 * Called immediately after a successful signup or login API response,
 * before the token is committed to localStorage.
 *
 * @param {string} email
 * @param {string} [userName]
 * @returns {Promise<void>}
 */
export async function sendOtp(email, userName) {
  await apiClient.post("/auth/send-otp", { email, userName });
}

/**
 * Verify the OTP the user typed on the OTP page.
 *
 * @param {string} email
 * @param {string} otp   6-digit string
 * @returns {Promise<void>}
 */
export async function verifyOtp(email, otp) {
  await apiClient.post("/auth/verify-otp", { email, otp });
}
