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

## Overview
PulseVote is a secure, real-time polling web app. This repo currently contains the Phase 01 foundations: a secured Express backend and a Vite + React frontend with Tailwind CSS and daisyUI.

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
- 01: Setting up Foundations
- 02: Adding SSL
- 03: Adding Authentication with JWT
- 04: Adding Authentication on the frontend
- 05: Securing your login
- 06: Adding in CSP
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

