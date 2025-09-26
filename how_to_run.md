# How to Run PulseVote

This guide provides quick instructions for running both the backend and frontend of PulseVote.

## Prerequisites

- Node.js 20.18+ (recommended: Node.js 20.19+)
- MongoDB running locally or MongoDB Atlas connection
- Git (for cloning the repository)

## Backend Setup

### 1. Navigate to Backend Directory
```bash
cd pulsevote-backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Create Environment File
Create a `.env` file in the `pulsevote-backend` directory with:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/pulsevote
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random_123456789
```

### 4. Start Backend Server
```bash
npm run dev
```

The backend will start at `https://localhost:5000`

## Frontend Setup

### 1. Navigate to Frontend Directory
```bash
cd pulsevote-frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Frontend Development Server
```bash
npm run dev
```

The frontend will start at `https://localhost:5173`

## Quick Start Commands

**Terminal 1 (Backend):**
```bash
cd pulsevote-backend
npm install
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd pulsevote-frontend
npm install
npm run dev
```

## Testing

### Backend Testing
```bash
cd pulsevote-backend
npm test          # Run unit tests
npm run lint      # Run linting
```

### API Testing
- Import `pulsevote-backend/postman_tests.json` into Postman for RBAC testing
- Import `pulsevote-backend/rate_limit_tests.json` into Postman for rate limiting testing

## Troubleshooting

### SSL Certificate Issues
- If you get SSL warnings, visit `https://localhost:5000` and accept the certificate
- Or trust the certificate in Windows Certificate Manager

### MongoDB Connection Issues
- Ensure MongoDB is running locally: `mongod`
- Or update `MONGO_URI` in `.env` to your MongoDB Atlas connection string

### Port Conflicts
- Backend runs on port 5000
- Frontend runs on port 5173
- Change ports in respective configuration files if needed

## Development Scripts

### Backend
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm test` - Run unit tests
- `npm run lint` - Run ESLint

### Frontend
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Features Implemented

- ✅ Phase 01: Project Foundations
- ✅ Phase 02: SSL/HTTPS
- ✅ Phase 03: JWT Authentication
- ✅ Phase 04: Frontend Authentication
- ✅ Phase 05: Input Validation
- ✅ Phase 06: CSP with Helmet
- ✅ Phase 07: RBAC (Role-Based Access Control)
- ✅ Phase 08: Rate Limiting
- ✅ Phase 09: Linting and Unit Testing
