// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('cookie-session');
const fs = require('fs');
const bcrypt = require('bcryptjs'); // ✅ Secure password hashing
require('dotenv').config();

const app = express();
const port = 5005;

// ===== Middleware =====
app.use(express.json());
app.use(cors());

// ===== MongoDB Connection =====
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));

// ===== User Model =====
const User = require('./models/User');

// ===== Cookie Session =====
app.use(
  session({
    name: 'session',
    keys: [process.env.SESSION_KEY || 'default_secret_key'],
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
);

// ===== Passport Config =====
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) =>
  User.findById(id)
    .then((user) => done(null, user))
    .catch((err) => done(err))
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let existingUser = await User.findOne({ googleId: profile.id });
        if (existingUser) return done(null, existingUser);

        const newUser = new User({
          googleId: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName,
        });
        await newUser.save();
        done(null, newUser);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

// ===== Auth Routes (with bcrypt) =====
app.post('/api/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    // 🔒 Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ email, password: hashedPassword, name });
    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token, message: "Signup successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    // ✅ Compare plain password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign(
      { id: user._id, email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token, message: "Login successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ===== Google OAuth Routes =====
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user._id, email: req.user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    res.redirect(`http://localhost:5005/dashboard.html?token=${token}`);
  }
);

// ===== Dynamic Jobs from JSON File =====
app.get("/api/jobs", (req, res) => {
  const jobsPath = path.join(__dirname, "jobs.json");
  fs.readFile(jobsPath, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Failed to load jobs" });

    try {
      const jobs = JSON.parse(data);
      res.json(jobs);
    } catch (e) {
      res.status(500).json({ error: "Invalid JSON in jobs.json" });
    }
  });
});

// ===== Other API Routes =====
app.use('/api/internships', require('./routes/internships'));
app.use('/api/wfh', require('./routes/wfh'));
app.use('/api/aicte', require('./routes/aicte'));
app.use('/api/paid-internships', require('./routes/paid-internships'));
app.use('/api/free-certificate', require('./routes/free-certificate'));
app.use('/api/results', require('./routes/results'));
app.use('/api/auth', require('./routes/auth'));

// ===== Serve Frontend =====
app.use(express.static(path.join(__dirname, 'frontend')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// ===== Start Server =====
app.listen(port, () => console.log(`✅ Server running at http://localhost:${port}`));

module.exports = app;
