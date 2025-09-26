# PulseVote
Secure, real-time polling web app built with the MERN stack.

## Table of Contents
- [Overview](#overview)
- [Phase 01: Setting up Foundations](#phase-01-setting-up-foundations)
  - [Backend](#backend-pulsevote-backend)
  - [Frontend](#frontend-pulsevote-frontend)
  - [Hygiene](#hygiene)
  - [Verifications](#verifications)
- [Project Structure](#project-structure)
- [Development Scripts](#development-scripts)
- [Security Reflection](#security-reflection)
- [Next Phases (roadmap)](#next-phases-roadmap)
- [Commits](#commits)
- [Phase 02: Adding SSL (HTTPS)](#phase-02-adding-ssl-https)
  - [Whats been done](#whats-been-done)
  - [Commands (Git Bash)](#commands-git-bash)
  - [Run](#run)
  - [Trust the certificate (Windows)](#trust-the-certificate-windows)
  - [Notes](#notes)
- [Phase 03: Adding Authentication with JWT](#phase-03-adding-authentication-with-jwt)
  - [What's been done](#whats-been-done)
  - [Environment](#environment)
  - [Endpoints](#endpoints)
  - [Test with Postman](#test-with-postman)
- [Phase 04: Adding Authentication on the Frontend](#phase-04-adding-authentication-on-the-frontend)
  - [What's been implemented](#whats-been-implemented)
  - [Project Structure](#project-structure-1)
  - [Authentication Flow](#authentication-flow)
  - [Testing the Authentication](#testing-the-authentication)
- [Phase 05: Securing your login](#phase-05-securing-your-login)
   - [Frontend hardening](#frontend-hardening)
   - [Backend validation](#backend-validation)
- [Phase 06: Adding CSP with Helmet](#phase-06-adding-csp-with-helmet)
   - [What is Helmet.js?](#what-is-helmetjs)
   - [CSP Implementation](#csp-implementation)


## Overview
PulseVote is a secure, real-time polling web app. This repo contains a complete authentication system with HTTPS backend, JWT authentication, and a fully functional React frontend with login, registration, and protected routes using Tailwind CSS and DaisyUI.

## Phase 01: Setting up Foundations

### Backend (pulsevote-backend)
- Prereqs: Node 20.18+ (works); recommended Node 20.19+ to align with frontend engines.
- Env: create `.env` with `PORT=5000`.
- Install: `cd pulsevote-backend && npm install`
- Run (dev): `npm run dev`
- Verify:
  - `GET /` → "PulseVote API running!"
  - `GET /test` → `{ status, service, timestamp }`

### Frontend (pulsevote-frontend)
- Requires Node 20.19+ (Vite engine requirement).
- Install: `cd pulsevote-frontend && npm install`
- Run: `npm run dev` and open the shown URL.
- UI: DaisyUI navbar + centered hero; fetches and displays backend `/test` status.

### Hygiene
- `.gitignore` includes: `node_modules`, `.env`, `dist` for both apps.
- Audits: ran `npm audit` in both apps.

### Verifications
- Backend reachable at `http://localhost:5000/` and `/test`.
- Frontend shows "Welcome to PulseVote" and backend status alert.

## Project Structure
```
Pulsevote/
  README.md
  pulsevote-backend/
    app.js
    server.js
    models/ routes/ controllers/ middleware/
    package.json .env (local) .gitignore
  pulsevote-frontend/
    src/ (App.jsx, main.jsx, index.css)
    vite.config.js package.json .gitignore
```

## Development Scripts
- Backend
  - Start (dev): `cd pulsevote-backend && npm run dev`
  - Start (prod): `cd pulsevote-backend && npm start`
- Frontend
  - Dev server: `cd pulsevote-frontend && npm run dev`

## Security Reflection :
Security isn’t just a checkbox for polling apps; it’s what makes results worth trusting. If people can spoof identities or stuff the ballot with bots, the data becomes noise and decisions based on it are flawed. A common threat is automated bot voting via shared links or exposed endpoints, which we mitigate with rate limiting, link hardening, and verification steps.

## Next Phases (roadmap)
- 07: Adding RBAC
- 08: Rate Limiting
- 09: Linting and Unit Testing in the API
- 10: Dockerizing the API
- 11: Pipelining the API with lint and render reports
- 12: Pipelining with Newman and SonarQube
- 13: Logging with Grafana

## Commits
- Initial commit after folders created
- Phase commit: "PHASE 01 - Setting up Foundations"
- Phase commit: "PHASE 02 - Adding SSL (HTTPS)"
- Phase commit: "PHASE 03 - Adding Authentication with JWT"
- Phase commit: "PHASE 04 - Adding Authentication on the Frontend"
- Phase commit: "PHASE 05 - Securing your login"
- Phase commit: "PHASE 06 - Adding CSP with Helmet"



## Phase 02: Adding SSL (HTTPS)
Purpose: run both backend and frontend over HTTPS locally using a self-signed certificate.

### Whats been done 
- Generate a self-signed cert for `localhost` with SAN.
- Serve backend via HTTPS using the cert.
- Serve frontend (Vite dev server) via HTTPS using the same cert.
- Optionally trust the cert to remove browser warnings.

### Commands (Git Bash)
```bash
cd pulsevote-backend
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout ssl/key.pem -out ssl/cert.pem \
  -config ssl/openssl.cnf -extensions v3_req

# copy to frontend
mkdir -p ../pulsevote-frontend/ssl
cp ssl/key.pem ssl/cert.pem ../pulsevote-frontend/ssl/
```

### Run
- Backend: `cd pulsevote-backend && npm run dev` → open `https://localhost:5000/`
- Frontend: `cd pulsevote-frontend && npm run dev` → open `https://localhost:5173/`

If the frontend can’t fetch the API:
- Visit `https://localhost:5000` and click Advanced → Continue (unsafe), then refresh the frontend.
- Ensure CORS allows the frontend: `app.use(cors({ origin: 'https://localhost:5173' }));`

### Trust the certificate (Windows)
- Win+R → `certmgr.msc` → Trusted Root Certification Authorities → Certificates → Import → select `ssl/cert.pem` → finish → restart browser.

### Notes
- Private keys aren't commited; `ssl/` is already in `.gitignore` for both frontend and backend.
- See `ssl_research.md` for a short summary and reflection.


## Phase 03: Adding Authentication with JWT
Purpose: secure the API with stateless auth using JSON Web Tokens and store user profiles in MongoDB.

### What’s been done
- Installed deps: `bcrypt`, `jsonwebtoken` and `mongodb` driver if needed
- `models/User.js` with email + hashed password
- `controllers/authController.js` with `register` and `login`
- `routes/authRoutes.js` exposing `/api/auth/register` and `/api/auth/login`
- `middleware/authMiddleware.js` with `protect`
- `app.js` wired CORS for `https://localhost:5173`, auth routes, and `/api/protected`
- `server.js` connects to MongoDB before starting HTTPS server

### Environment
Add to `pulsevote-backend/.env`:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
```

### Endpoints
- POST `/api/auth/register` → `{ token }`
- POST `/api/auth/login` → `{ token }`
- GET `/api/protected` with `Authorization: Bearer <token>` → protected data

### Test with Postman
1. Register
   - Method: POST
   - URL: `https://localhost:5000/api/auth/register`
   - Headers: `Content-Type: application/json`
   - Body (raw JSON): `{ "email": "test@example.com", "password": "password123" }`
2. Login
   - Method: POST
   - URL: `https://localhost:5000/api/auth/login`
   - Headers: `Content-Type: application/json`
   - Body (raw JSON): `{ "email": "test@example.com", "password": "password123" }`
   - Copy the `token` from the response
3. Protected
   - Method: GET
   - URL: `https://localhost:5000/api/protected`
   - Header: `Authorization: Bearer <paste token>`


## Phase 04: Adding Authentication on the Frontend
Building complete authentication system on the frontend.

### What's been implemented
- **Complete Authentication Flow**: Login, register, logout with JWT token management
- **Protected Routes**: Dashboard accessible only to authenticated users
- **Dynamic Navigation**: Menu changes based on authentication state
- **DaisyUI Toast Notifications**: Beautiful, consistent user feedback
- **Form Validation**: Client-side validation with real-time feedback
- **Error Handling**: Comprehensive error handling with specific messages
- **Session Management**: Automatic token validation and cleanup

### Project Structure
```
pulsevote-frontend/src/
├── components/
│   ├── Layout.jsx          # Navigation with conditional menu
│   ├── Login.jsx           # Login form with validation
│   ├── ProtectedRoute.jsx   # Route protection wrapper
│   └── Register.jsx        # Registration form with password strength
├── pages/
│   ├── DashboardPage.jsx   # Protected dashboard
│   ├── HomePage.jsx        # Public home page
│   ├── LoginPage.jsx       # Login page wrapper
│   ├── LogoutPage.jsx      # Logout with redirect
│   └── RegisterPage.jsx    # Registration page wrapper
├── contexts/
│   └── AuthContext.jsx     # Authentication state management
├── hooks/
│   └── useAuth.js          # Custom hook for auth context
└── utils/
    ├── axios.js            # Axios configuration with interceptors
    └── toast.js            # DaisyUI toast utility
```

### Authentication Flow

1. **Registration**:
   ```
   User fills form → Validation → API call → Token received → 
   Auto-login → Dashboard redirect
   ```

2. **Login**:
   ```
   User enters credentials → Validation → API call → Token stored → 
   User info fetched → Dashboard redirect
   ```

3. **Protected Access**:
   ```
   User visits /dashboard → Check token → Valid? → Show dashboard
   Invalid? → Redirect to login
   ```

4. **Logout**:
   ```
   User clicks logout → Clear token → Clear state → 
   Show toast → Redirect to home
   ```

### Testing the Authentication

1. **Start the servers**:
   ```bash
   # Backend
   cd pulsevote-backend && npm start
   
   # Frontend  
   cd pulsevote-frontend && npm run dev
   ```

2. **Test Registration**:
   - Visit `https://localhost:5173/register`
   - Fill out the form with valid email/password
   - Should auto-login and redirect to dashboard

3. **Test Login**:
   - Visit `https://localhost:5173/login`
   - Use registered credentials
   - Should redirect to dashboard

4. **Test Protected Routes**:
   - Try visiting `https://localhost:5173/dashboard` while logged out
   - Should redirect to login page

5. **Test Logout**:
   - Click user avatar → Logout
   - Should show success toast and redirect to home




## Phase 05: Securing your login
Purpose: add input validation on both client and server to reduce bad requests and improve security.

### Frontend hardening
- Login form enforces:
  - Email format: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
  - Strong password: at least 8 chars, includes letters and numbers
- Register form already validates email format, password strength and confirmation.

### Backend validation
- Added `express-validator` checks in `pulsevote-backend/routes/authRoutes.js`:
  - `POST /api/auth/register` validates/normalizes `email` and enforces strong `password`
  - `POST /api/auth/login` validates/normalizes `email` and requires non-empty `password`
- Both `register` and `login` in `pulsevote-backend/controllers/authController.js` now use:
  - `const { validationResult } = require('express-validator')`
  - Return `400 { message: "Invalid input", errors: [...] }` when validation fails

## Phase 06: Adding CSP with Helmet
Implement Content Security Policy (CSP) to prevent XSS attacks and unauthorized resource loading on the system.

### What is Helmet.js?
Helmet.js is a security middleware for Express that sets various HTTP headers to protect against common web vulnerabilities:

**Default Security Headers:**
- **X-Content-Type-Options**: Prevents MIME-sniffing attacks
- **X-Frame-Options**: Mitigates clickjacking attacks
- **X-XSS-Protection**: Enables browser XSS filter
- **Strict-Transport-Security (HSTS)**: Enforces HTTPS connections
- **Content-Security-Policy (CSP)**: Controls resource loading sources

**Benefits for our tech stack:**
- Protects React frontend from XSS attacks
- Prevents unauthorized scripts from executing
- Ensures secure communication between frontend and backend
- Blocks malicious resource loading attempts

### CSP Implementation
Added CSP configuration in `pulsevote-backend/app.js`:

```javascript
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://apis.google.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'", "http://localhost:5000"],
    },
  })
);
```

**What this CSP does:**
- `defaultSrc: ["'self'"]` - Only allow resources from same origin by default
- `scriptSrc` - Allow scripts from same origin + Google APIs
- `styleSrc` - Allow styles from same origin + inline styles + Google Fonts
- `fontSrc` - Allow fonts from same origin + Google Fonts CDN
- `imgSrc` - Allow images from same origin + data URIs
- `connectSrc` - Allow API calls to same origin + backend port


