// server.js
const express = require("express");
const { Pool } = require("pg");

const app = express();
app.use(express.json()); // must come BEFORE routes
app.use(express.urlencoded({ extended: true }));

// PostgreSQL connection
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "god_help_us",
  password: "11030721",
  port: 5432,
});

// Test route
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// GET all users
app.get("/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// POST a new user
app.post("/users", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).send("Name is required");

    const result = await pool.query(
      "INSERT INTO users (name) VALUES ($1) RETURNING *",
      [name]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// UPDATE a user
app.put("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    if (!name) return res.status(400).send("Name is required");

    const result = await pool.query(
      "UPDATE users SET name = $1 WHERE id = $2 RETURNING *",
      [name, id]
    );

    if (result.rows.length === 0) return res.status(404).send("User not found");

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// DELETE a user
app.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM users WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) return res.status(404).send("User not found");

    res.send(`User with id ${id} deleted successfully`);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
