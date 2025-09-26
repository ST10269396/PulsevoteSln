const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

// Trust proxy for accurate IP detection behind reverse proxies/load balancers
app.set('trust proxy', 1);

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://apis.google.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'"], // Removed data: to make it more restrictive for testing
      connectSrc: ["'self'", "http://localhost:5000", "https://localhost:5000"], // Allow both HTTP and HTTPS
    },
  })
);
app.use(cors({
  origin: "https://localhost:5173",
  credentials: true
}));
app.use(express.json());

// Auth routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Organisation routes
const organisationRoutes = require('./routes/organisationRoutes');
app.use('/api/organisations', organisationRoutes);

// Poll routes
const pollRoutes = require('./routes/pollRoutes');
app.use('/api/polls', pollRoutes);

// Protected endpoint
const { protect } = require('./middleware/authMiddleware');
app.get('/api/protected', protect, (req, res) => {
  res.json({
    message: `Welcome, user ${req.user.id}! You have accessed protected data.`,
    user: { id: req.user.id }, // only returns the user id for now
    timestamp: new Date()
  });
});

app.get('/', (req, res) => {
    res.send('PulseVote API running!');
});

app.get('/test', (req, res) => {
    res.json({ status: 'ok', service: 'pulsevote-backend', timestamp: new Date().toISOString() });
});

app.get('/health', (req, res) => 
    res.status(200).json({
        ok: true,
        ts: Date.now()
    }));

module.exports = app;


