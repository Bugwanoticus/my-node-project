// server.js
const express = require("express");
const path = require("path");

const db = require("./backend/db/connection");
const initSchema = require("./backend/db/schema");
initSchema(db);

const authRoutes = require("./backend/routes/auth.routes");
const itemsRoutes = require("./backend/routes/items.routes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// serve static frontend
app.use(express.static(path.join(__dirname, "frontend", "public_pages")));

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "frontend", "index.html")));
app.get("/signup", (req, res) => res.sendFile(path.join(__dirname, "frontend", "signup.html")));
app.get("/reset", (req, res) => res.sendFile(path.join(__dirname, "frontend", "password_reset.html")));
app.get("/tasks", (req, res) => res.sendFile(path.join(__dirname, "frontend", "tasks.html")));

// mount API routes
app.use("/api", authRoutes);
app.use("/api", itemsRoutes);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
