# GruhinEzz — Backend (Signup + Login only)

Node.js + Express + MySQL backend implementing exactly the two endpoints the
frontend's `authService.js` already expects — `POST /api/auth/signup` and
`POST /api/auth/login` — plus a small `GET /api/auth/me` used to confirm the
session on the dashboard after redirect. One table, `users`, stores everything.

## 1. Install

```bash
cd gruhinezz-backend
npm install
```

## 2. Set up MySQL

```bash
mysql -u root -p < sql/schema.sql
```

This creates the `gruhinezz` database and the single `users` table:

| column        | type                              |
|---------------|------------------------------------|
| id            | INT, primary key, auto increment   |
| role          | ENUM('buyer','seller','ngo')       |
| user_name     | VARCHAR(100)                       |
| email         | VARCHAR(255), unique                |
| password_hash | VARCHAR(255) (bcrypt hash)          |
| contact_no    | VARCHAR(20)                        |
| created_at    | TIMESTAMP                          |
| updated_at    | TIMESTAMP                          |

## 3. Configure environment

```bash
cp .env.example .env
```

Edit `.env` with your MySQL password and a random `JWT_SECRET`.

## 4. Run

```bash
npm run dev     # nodemon, auto-restart
# or
npm start
```

Server starts on `http://localhost:5000` (matches `VITE_API_BASE_URL` default
in the frontend's `.env.example`).

## Endpoints

### `POST /api/auth/signup`
Body: `{ role, userName, email, password, contactNo }`
→ `201` `{ user: { id, role, userName, email, contactNo }, token }`
→ `409` if email already registered.

### `POST /api/auth/login`
Body: `{ role, email, password }`
→ `200` `{ user: { id, role, userName, email }, token }`
→ `401` if credentials wrong OR if the email exists but under a different role
(e.g. a Seller account trying to log in via the NGO tab — role is checked
against the stored account as the frontend README requested).

### `GET /api/auth/me`
Header: `Authorization: Bearer <token>`
→ `200` `{ user: { id, role, userName, email, contactNo } }`

Call this from the dashboard page right after redirect to confirm the token
is valid and to get the user's name/role to display, instead of trusting
whatever was last stored client-side.

## How this plugs into the frontend

No frontend changes needed beyond what the README already documents:

1. Set `VITE_API_BASE_URL=http://localhost:5000/api` in the frontend's `.env`.
2. In `src/services/authService.js`, set `USE_MOCK_API = false`.
3. The real `apiClient.post(...)` calls already written below the mock
   blocks match this backend's request/response shapes exactly, so no
   further edits are needed there.
4. On successful login, redirect to `/dashboard` and let the role-specific
   dashboard (`buyer.jsx` / `seller.jsx` / `ngo.jsx`) call `GET /api/auth/me`
   on mount using the stored `gruhinezz_token` to fetch the current user.

## Notes

- Passwords are hashed with bcrypt (10 salt rounds) before storage; the
  frontend sends plaintext over HTTPS as the README describes, hashing only
  happens here.
- CORS is restricted to the origins listed in `CLIENT_ORIGINS` in `.env`
  (defaults to the Vite dev server at `http://localhost:5173`).
- This is intentionally scoped to signup/login only, per your other backend
  work — no other tables or routes are included.
