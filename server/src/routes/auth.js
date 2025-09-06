
import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { query } from '../db.js';
import { isValidEmail, isStrongPassword } from '../utils/validators.js';


const router = Router();


router.post('/signup', async (req, res) => {
try {
const { name, email, password, confirmPassword } = req.body;
if (!name || !email || !password || !confirmPassword) {
return res.status(400).json({ error: 'All fields are required' });
}
if (!isValidEmail(email)) {
return res.status(400).json({ error: 'Invalid email format' });
}
if (password !== confirmPassword) {
return res.status(400).json({ error: "Passwords don't match" });
}
if (!isStrongPassword(password)) {
return res.status(400).json({ error: 'Password too weak (min 8 chars)' });
}


// Derive a username from name if not provided (unique constraint will ensure uniqueness)
let baseUsername = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0, 20) || 'user';
let username = baseUsername;
let attempts = 0;
while (true) {
const exists = await query('SELECT 1 FROM users WHERE email=$1 OR username=$2', [email, username]);
if (exists.rowCount === 0) break;
attempts += 1;
username = `${baseUsername}${attempts}`;
if (attempts > 1000) return res.status(400).json({ error: 'Unable to generate unique username' });
}


const hash = await bcrypt.hash(password, 10);
const { rows } = await query(
'INSERT INTO users (email, username, password_hash, name) VALUES ($1,$2,$3,$4) RETURNING id, email, username, name, created_at',
[email, username, hash, name]
);


return res.status(201).json({
message: 'Signup successful. Please login.',
user: rows[0]
});
} catch (err) {
console.error(err);
return res.status(500).json({ error: 'Server error' });
}
});


router.post('/login', async (req, res) => {
try {
const { identifier, password } = req.body; // identifier = email or username
if (!identifier || !password) return res.status(400).json({ error: 'All fields are required' });


const { rows } = await query(
'SELECT id, email, username, password_hash, name FROM users WHERE email=$1 OR username=$1 LIMIT 1',
[identifier]
);
if (rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });


const user = rows[0];
const ok = await bcrypt.compare(password, user.password_hash);
if (!ok) return res.status(401).json({ error: 'Invalid credentials' });


const token = jwt.sign({ id: user.id, email: user.email, username: user.username }, process.env.JWT_SECRET, { expiresIn: '7d' });
return res.json({ token, user: { id: user.id, email: user.email, username: user.username, name: user.name } });
} catch (err) {
console.error(err);
return res.status(500).json({ error: 'Server error' });
}
});


export default router;
