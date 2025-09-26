const rateLimit = require('express-rate-limit');

const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 registration attempts per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    return res.status(429).json({
      message: 'Too many registration attempts. Please try again later.'
    });
  },
});

const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // Limit each IP+email combination to 5 login attempts per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skipSuccessfulRequests: true, // Don't count successful requests
  keyGenerator: (req) => {
    const ip = rateLimit.ipKeyGenerator(req);
    return `${ip}:${req.body?.email || ''}`;
  },
  handler: (req, res) => {
    return res.status(429).json({
      message: 'Too many login attempts. Please try again later.'
    });
  },
});

module.exports = { registerLimiter, loginLimiter };
