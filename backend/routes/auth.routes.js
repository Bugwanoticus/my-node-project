// backend/routes/auth.routes.js
const express = require("express");
const router = express.Router();
const db = require("../db/connection");
const authService = require("../services/auth.service.js");



// POST /api/signup
router.post("/signup", async (req, res) => {
  const username = req.body.username?.trim();
  const password = req.body.password;
  const confirm_password = req.body.confirm_password;
  const email = req.body.email?.trim();

  const errMsg = authService.validateSignup({username, password, confirm_password, email});
  if (errMsg) return res.status(400).json({ errors: errMsg });

  try {
    const hashed = await authService.hashPassword(password);
    db.run(
      "INSERT INTO users (username, password_hash, email) VALUES (?, ?, ?)",
      [username, hashed, email],
      function (err) {
        if (err) {
          if (err.message.includes("users.username")) {
            return res.status(409).json({ errors: { username: ["Username already exists"] } });
          }
          if (err.message.includes("users.email")) {
            return res.status(409).json({ errors: { email: ["Email already registered"] } });
          }
          return res.status(500).json({ errors: { global: ["failed to create account"] } });
        }
        res.status(201).json({ success: true, user_Id: this.lastID, username });
      }
    );
  } catch {
    res.status(500).json({ errors: { global: ["failed to create account"] } });
  }
});



// POST /api/login
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ errors: {username: ["Username is required"], password: ["Password is required"] } });

  db.get("SELECT id, password_hash FROM users WHERE username = ?", [username.trim()], async (err, row) => {
    if (err) return res.status(500).json({ errors: { global: ["failed to login"] } });
    if (!row) return res.status(401).json({ errors: { global: ["Invalid username or password"] } });
    const ok = await authService.verifyPassword(password, row.password_hash);
    if (!ok) return res.status(401).json({ errors: { global: ["Invalid username or password"] } });

    res.json({ success: true, user_Id: row.id });
  });
});

module.exports = router;
