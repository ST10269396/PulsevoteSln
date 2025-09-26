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
- [Phase 07: Adding RBAC (Role-Based Access Control)](#phase-07-adding-rbac-role-based-access-control)
   - [What's been implemented](#whats-been-implemented)
   - [RBAC Research Summary](#rbac-research-summary)
   - [User Roles & Permissions](#user-roles--permissions)
   - [API Endpoints](#api-endpoints)
   - [Database Models](#database-models)
   - [Testing with Postman](#testing-with-postman)
   - [Security Features](#security-features)
   - [Environment Variables](#environment-variables)
- [Phase 08: Adding Rate Limiting](#phase-08-adding-rate-limiting)
   - [What's been implemented](#whats-been-implemented-1)
   - [Rate Limiting Research Summary](#rate-limiting-research-summary)
   - [Rate Limiting Configuration](#rate-limiting-configuration)
   - [Testing with Postman](#testing-with-postman-1)
   - [Security Features](#security-features-1)
- [Phase 09: Linting and Unit Testing](#phase-09-linting-and-unit-testing)
   - [What's been implemented](#whats-been-implemented-2)
   - [Linting and Testing Research Summary](#linting-and-testing-research-summary)
   - [Configuration](#configuration)
   - [Running Tests](#running-tests)


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
- Phase commit: "PHASE 07 - Adding RBAC (Role-Based Access Control)"
- Phase commit: "PHASE 08 - Adding Rate Limiting"
- Phase commit: "PHASE 09 - Linting and Unit Testing"



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

## Phase 07: Adding RBAC (Role-Based Access Control)
Purpose: implement comprehensive role-based access control with organizations, polls, and secure voting system.

### What's been implemented
- **Role-Based Authentication**: Three user roles (Admin, Manager, User) with hierarchical permissions
- **Organisation Management**: Create organizations, join via codes, manage memberships
- **Poll System**: Create polls within organizations, vote securely, view results
- **Security Controls**: Role checks, membership validation, duplicate vote prevention
- **JWT Enhancement**: Tokens now include user roles and organization memberships

### RBAC Research Summary
See `rbac_research.md` for detailed research on:
- What RBAC is and why it's important
- How different roles affect access in PulseVote
- Security implications of improper RBAC implementation
- Real-world examples of RBAC failures (Target data breach)

### User Roles & Permissions

**Admin Role:**
- Create other admins and managers
- Full system access
- Override organization-level restrictions

**Manager Role:**
- Create and manage organizations
- Generate join codes for organizations
- Create polls within their organizations
- Open/close polls
- View all polls in their organizations

**User Role:**
- Join organizations via join codes
- Vote on polls within organizations
- View poll results for organizations they belong to

### API Endpoints

**Authentication:**
- `POST /api/auth/register-user` - Register as regular user
- `POST /api/auth/register-manager` - Register manager (admin only)
- `POST /api/auth/register-admin` - Register admin (first admin or admin only)
- `POST /api/auth/login` - Login with role information

**Organizations:**
- `POST /api/organisations/create-organisation` - Create organization (manager+)
- `POST /api/organisations/generate-join-code/:organisationId` - Generate join code (manager+)
- `POST /api/organisations/join-organisation` - Join organization with code

**Polls:**
- `POST /api/polls/create-poll` - Create poll (manager+)
- `POST /api/polls/vote/:pollId` - Vote on poll (user+)
- `GET /api/polls/get-poll-results/:pollId` - View poll results (member+)
- `GET /api/polls/get-polls/:organisationId` - List organization polls
- `POST /api/polls/close/:pollId` - Close poll (manager+)
- `POST /api/polls/open/:pollId` - Open poll (manager+)

### Database Models

**User Model:**
```javascript
{
  email: String,
  password: String (hashed),
  roles: [{
    organisationId: ObjectId (ref: Organisation),
    role: String (enum: ["admin", "manager", "user"])
  }]
}
```

**Organisation Model:**
```javascript
{
  name: String (unique),
  joinCode: String (unique, auto-generated),
  createdBy: ObjectId (ref: User),
  members: [ObjectId] (ref: User)
}
```

**Poll Model:**
```javascript
{
  organisationId: ObjectId (ref: Organisation),
  question: String,
  options: [String],
  createdBy: ObjectId (ref: User),
  status: String (enum: ["open", "closed"]),
  votes: [{
    userId: ObjectId (ref: User),
    optionIndex: Number
  }]
}
```

### Testing with Postman

1. **Import the test collection:**
   - Import `pulsevote-backend/postman_tests.json` into Postman
   - Update the variables section with your test credentials
   - **Note**: Tests use `https://localhost:5000` (HTTPS with SSL)

2. **Test sequence:**
   - Register admin → Register manager → Register user
   - Create organization → Join organization
   - Create poll → Vote on poll → View results
   - Test poll management (close/open)
   - Test security restrictions

3. **Expected test results:**
   - All 13 test requests should pass
   - Role-based access controls should be enforced
   - Duplicate votes should be prevented
   - Closed polls should reject new votes

## Phase 08: Adding Rate Limiting
Purpose: implement rate limiting to protect authentication endpoints from brute force attacks and automated abuse.

### What's been implemented
- **Registration Rate Limiting**: 5 attempts per IP per 15 minutes
- **Login Rate Limiting**: 5 attempts per IP+email combination per 10 minutes
- **Proxy-Aware Configuration**: Accurate IP detection behind reverse proxies
- **Standard Rate Limit Headers**: `RateLimit-Limit`, `RateLimit-Remaining` for observability
- **Consistent Error Responses**: 429 status with clear error messages

### Rate Limiting Research Summary
See `rate_limiting_research.md` for detailed research on:
- What rate limiting is and why it's critical for authentication endpoints
- Differences between per-IP and per-identifier limits
- How reverse proxies affect IP detection and rate limiting accuracy
- Safe defaults vs. production-ready settings

### Rate Limiting Configuration

**Registration Limiter:**
- **Window**: 15 minutes
- **Limit**: 5 attempts per IP
- **Key**: IP address only
- **Headers**: Standard rate limit headers enabled

**Login Limiter:**
- **Window**: 10 minutes  
- **Limit**: 5 attempts per IP+email combination
- **Key**: IP address + email address
- **Skip Successful**: Only counts failed attempts
- **Headers**: Standard rate limit headers enabled

### Testing with Postman

1. **Import the rate limit test collection:**
   - Import `pulsevote-backend/rate_limit_tests.json` into Postman
   - Run the "Looped Register Rate Limit Test" - should hit 429 after 5 attempts
   - Run the "Looped Login Rate Limit Test" - should hit 429 after 5 attempts

2. **Expected behavior:**
   - First 5 requests return normal responses (200/400/201)
   - 6th request returns 429 "Too many attempts" error
   - Rate limit headers show remaining attempts
   - Different email addresses don't affect registration limits (IP-based)
   - Same email affects login limits (IP+email based)

### Security Features
- **Brute Force Protection**: Prevents automated password guessing attacks
- **Account Creation Abuse Prevention**: Limits automated account creation
- **Proxy-Aware**: Works correctly behind load balancers and reverse proxies
- **Per-Endpoint Limits**: Different limits for registration vs login
- **Standard Headers**: Provides observability for monitoring systems
- **Graceful Degradation**: Clear error messages for rate-limited requests

## Phase 09: Linting and Unit Testing
Purpose: implement code quality tools and automated testing to ensure code reliability and maintainability.

### What's been implemented
- **ESLint Configuration**: Code linting with recommended rules and custom configurations
- **Jest Testing Framework**: Unit testing with supertest for API endpoint testing
- **Health Endpoint**: Simple health check endpoint for monitoring
- **Automated Scripts**: npm scripts for running linting and tests
- **Test Coverage**: Basic tests for health endpoint and authentication validation

### Linting and Testing Research Summary
See `linting_testing_research.md` for detailed research on:
- What linting and unit testing are and why they're critical
- How to implement linting and testing in Node.js APIs
- Benefits of automation and CI/CD integration
- Problems caused by flaky tests

### Configuration

**ESLint Configuration (`eslint.config.cjs`):**
- Uses recommended JavaScript rules
- Ignores common directories (node_modules, coverage, etc.)
- Custom rules for unused variables
- Jest globals for test files

**Jest Configuration (`jest.config.js`):**
- Node.js test environment
- Test files in `test/**/*.test.js`
- Verbose output for detailed test results

### Running Tests

**Linting:**
```bash
npm run lint
```

**Unit Tests:**
```bash
npm test
```

**Expected Results:**
- Linting shows warnings for unused variables (non-blocking)
- Tests pass with 3 test cases covering health and auth endpoints
- All test suites pass successfully

