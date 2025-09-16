# PulseVote
Secure, real-time polling web app built with the MERN stack.

## Table of Contents
- [Overview](#overview)
- [Foundations (Phase 01)](#foundations-phase-01)
  - [Backend](#backend-pulsevote-backend)
  - [Frontend](#frontend-pulsevote-frontend)
  - [Hygiene](#hygiene)
  - [Verifications](#verifications)
- [Project Structure](#project-structure)
- [Development Scripts](#development-scripts)
- [Security Reflection](#security-reflection-to-complete)
- [Next Phases (roadmap)](#next-phases-roadmap)
- [Commits](#commits)

## Overview
PulseVote is a secure, real-time polling web app. This repo currently contains the Phase 01 foundations: a secured Express backend and a Vite + React frontend with Tailwind CSS and daisyUI.

## Foundations (Phase 01)

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


