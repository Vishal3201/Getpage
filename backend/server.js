// server.js
const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const session = require("cookie-session");
const fs = require("fs");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5005;

// MIDDLEWARE
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cors());

// MONGO CONNECTION
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Error:", err.message));

// USER MODEL
const User = require("./models/user");

// COOKIE SESSION
app.use(
  session({
    name: "session",
    keys: [process.env.SESSION_KEY || "default_secret_key"],
    maxAge: 24 * 60 * 60 * 1000,
  })
);

// PASSPORT
app.use(passport.initialize());
app.use(passport.session());

// GOOGLE OAUTH
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

// AUTH ROUTES (login, signup etc)
app.use("/api/auth", require("./routes/auth"));

// JOBS ROUTE
app.get("/api/jobs", (req, res) => {
  const jobsPath = path.join(__dirname, "jobs.json");

  if (!fs.existsSync(jobsPath)) {
    return res.status(404).json({ error: "jobs.json not found!" });
  }

  fs.readFile(jobsPath, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Read error" });

    try {
      res.json(JSON.parse(data));
    } catch {
      res.status(500).json({ error: "Invalid JSON" });
    }
  });
});

// ---------- SITEMAP ROUTE ----------
app.get("/sitemap.xml", (req, res) => {
  const sitemapPath = path.join(__dirname, "frontend", "seo", "sitemap.xml");

  if (!fs.existsSync(sitemapPath)) {
    return res.status(404).send("Sitemap not found");
  }

  res.setHeader("Content-Type", "application/xml");
  res.sendFile(sitemapPath);
});

// ---------- ROBOTS ROUTE ----------
app.get("/robots.txt", (req, res) => {
  const robotsPath = path.join(__dirname, "frontend", "seo", "robots.txt");

  if (!fs.existsSync(robotsPath)) {
    return res.status(404).send("robots.txt not found");
  }

  res.setHeader("Content-Type", "text/plain");
  res.sendFile(robotsPath);
});

// SERVE FRONTEND
app.use(express.static(path.join(__dirname, "frontend")));

// CATCH-ALL FOR SPA
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

// START SERVER
app.listen(port, () =>
  console.log(`Server running at http://localhost:${port}`)
);

module.exports = app;
