# GruhinEzz — Front-End

React + Vite (JavaScript) frontend for GruhinEzz, a marketplace connecting **Buyers**,
**Sellers**, and **NGOs**. This repo contains the **frontend only** — it runs completely
independently of any backend, using mock data/services, and is structured so a Node.js
backend can be plugged in later with minimal changes.

## Screens included so far

- **Sign Up** (`/signup`) — role tabs (Buyer / Seller / NGO), User Name, Email, Password, Contact No.
- **Log In** (`/login`) — role tabs (Buyer / Seller / NGO), Email, Password.

All three roles share the same layout and components; only the active tab and the
`role` value submitted to the API differ.

## Getting started

```bash
npm install
cp .env.example .env   # adjust VITE_API_BASE_URL when the backend is ready
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

## Project structure

```
Front-End/
├── public/
├── src/
│   ├── assets/
│   │   └── logo.png          # GruhinEzz logo, used on Sign Up / Log In screens
│   ├── components/
│   │   ├── RoleTabs.jsx       # Buyer / Seller / NGO pill switcher
│   │   ├── FormField.jsx      # Styled text/email/password input
│   │   └── PrimaryButton.jsx  # Gradient "Continue" button
│   ├── layouts/
│   │   └── AuthLayout.jsx     # Shared two-column layout (logo + form) for auth screens
│   ├── pages/
│   │   ├── SignUpPage.jsx
│   │   └── LoginPage.jsx
│   ├── routes/
│   │   └── AppRoutes.jsx      # App-wide route table
│   ├── services/
│   │   ├── apiClient.js       # Central Axios instance (base URL, auth header)
│   │   └── authService.js     # signUp() / logIn() — API integration points
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
├── vite.config.js
└── README.md
```

## Backend integration

The frontend never talks to a backend directly from components — every call goes
through `src/services/`. Each service function currently returns **mock data** and is
marked with:

```js
// TODO: Connect this function to the Node.js backend.
```

To wire up the real backend once it exists:

1. Set `VITE_API_BASE_URL` in `.env` to the backend's base URL.
2. In `src/services/authService.js`, set `USE_MOCK_API = false`.
3. Remove the mock branches — the real `apiClient.post(...)` calls are already written
   directly below each mock block, so no request/response shape changes are needed on
   the frontend.

`src/services/apiClient.js` already attaches a `Bearer` token (read from
`localStorage.getItem("gruhinezz_token")`) to every outgoing request once the backend
starts issuing one on login/signup.

## API Reference (for the future Node.js backend)

Base URL: `VITE_API_BASE_URL` (default used in development: `http://localhost:5000/api`)

All request/response bodies are JSON. `role` is always one of: `"buyer"`, `"seller"`, `"ngo"`.

### 1. Sign Up

| | |
|---|---|
| **Endpoint** | `POST /auth/signup` |
| **Purpose** | Register a new Buyer, Seller, or NGO account |
| **Auth required** | No |

**Request body**

```json
{
  "role": "buyer",
  "userName": "string, required",
  "email": "string, required, valid email",
  "password": "string, required, min 8 characters recommended",
  "contactNo": "string, required"
}
```

**Expected response — `201 Created`**

```json
{
  "user": {
    "id": "string",
    "role": "buyer",
    "userName": "string",
    "email": "string",
    "contactNo": "string"
  },
  "token": "string (JWT)"
}
```

**Error response — `400 / 409`**

```json
{
  "message": "Email already registered."
}
```

Frontend behavior: on success, the user is redirected to `/login`.

---

### 2. Log In

| | |
|---|---|
| **Endpoint** | `POST /auth/login` |
| **Purpose** | Authenticate an existing Buyer, Seller, or NGO account |
| **Auth required** | No |

**Request body**

```json
{
  "role": "buyer",
  "email": "string, required",
  "password": "string, required"
}
```

**Expected response — `200 OK`**

```json
{
  "user": {
    "id": "string",
    "role": "buyer",
    "userName": "string",
    "email": "string"
  },
  "token": "string (JWT)"
}
```

**Error response — `401`**

```json
{
  "message": "Invalid email or password."
}
```

Frontend behavior: on success, `token` is stored in `localStorage` under
`gruhinezz_token` and attached as `Authorization: Bearer <token>` on subsequent
requests. The user is then redirected to `/dashboard` (not yet designed — currently
redirects back to `/login` as a placeholder).

---

### Planned / not yet implemented

These are anticipated next steps once more screens are provided — not built yet:

| Endpoint | Method | Purpose |
|---|---|---|
| `GET /auth/me` | GET | Fetch the current logged-in user from the token |
| `POST /auth/logout` | POST | Invalidate the current session/token |
| `POST /auth/forgot-password` | POST | Request a password reset |

## Notes for the backend team

- The frontend sends the same `role` field to both `/auth/signup` and `/auth/login` so
  the backend can validate the user is logging into the correct account type (a Seller
  account shouldn't be able to log in via the NGO tab, for example) — decide on that
  validation rule on the backend.
- Passwords are sent in plaintext over the request body (as normal) and must be hashed
  server-side; the frontend does no hashing.
- CORS must be enabled on the backend for the frontend's dev origin (`http://localhost:5173` by default) and whatever production origin is used.
