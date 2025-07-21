const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const fetch = require('node-fetch');
require('dotenv').config();

// Local services and utils
const lessonService = require('./services/lessonService');
const validationService = require('./services/validationService');
const { getLessonDB } = require('./utils/db');
const { sanitizeQuery } = require('./utils/security');

const app = express();
const PORT = process.env.PORT || 5000;

// =================== MIDDLEWARE SETUP ===================
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());

// Rate limiting for feedback
const feedbackLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: {
    success: false,
    error: 'Too many submissions from this IP. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Sanitize incoming requests
app.use((req, res, next) => {
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key]
          .trim()
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
      }
    });
  }

  if (req.query) {
    Object.keys(req.query).forEach(key => {
      if (typeof req.query[key] === 'string') {
        req.query[key] = req.query[key].trim();
      }
    });
  }

  next();
});

// =================== DATABASE CONNECTION ===================
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// =================== ROUTES ===================

// Auth routes
app.use('/api/auth', require('./routes/auth'));

// Progress routes
app.use('/api/progress', require('./routes/progress'));

// Get all lessons
app.get('/api/lessons/', (req, res) => {
  const lessons = lessonService.getAllLessons();
  res.json(lessons);
});

// Validate query
app.post('/api/validate', async (req, res) => {
  try {
    const { lessonId, exerciseId, query } = req.body;
    const result = await validationService.validateSolution(query, lessonId, exerciseId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Execute SQL query
app.post('/api/execute', async (req, res) => {
  try {
    const { lessonId, query } = req.body;
    if (!lessonId || !query) {
      return res.status(400).json({ error: 'Missing parameters' });
    }

    const db = getLessonDB(lessonId);
    const sanitized = sanitizeQuery(query);

    db.all(sanitized, (err, rows) => {
      db.close();
      if (err) return res.json({ success: false, error: err.message });

      const columns = rows.length > 0 ? Object.keys(rows[0]) : [];
      res.json({ success: true, data: rows, columns });
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Submit feedback (rate limited)
app.post('/api/submit-feedback', feedbackLimiter, async (req, res) => {
  try {
    const { name = '', email = '', message, issueType = 'general' } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length < 10) {
      return res.status(400).json({
        success: false,
        error: 'Message must be at least 10 characters long'
      });
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }

    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_key: process.env.WEB3FORMS_KEY,
        subject: `SQL-Flow ${issueType} Report`,
        name: name || 'Anonymous User',
        email: email || 'no-reply@sqlflow.com',
        message,
        page_url: req.headers.referer || 'Direct access',
        replyto: email || 'no-reply@sqlflow.com',
        botcheck: false
      })
    });

    const data = await response.json();
    res.json(data);

  } catch (error) {
    console.error('Feedback submission error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// =================== ERROR HANDLING ===================
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint not found' });
});

app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message
  });
});

// =================== START SERVER ===================
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
});
