import { Router } from 'express';
import bcrypt from 'bcrypt';
import { authRequired } from '../middleware/auth.js';
import { query } from '../db.js';


const router = Router();


router.get('/me', authRequired, async (req, res) => {
const { rows } = await query('SELECT id, email, username, name, created_at FROM users WHERE id=$1', [req.user.id]);
return res.json(rows[0]);
});


router.put('/me', authRequired, async (req, res) => {
const { username, name } = req.body;
if (!username && !name) return res.status(400).json({ error: 'Nothing to update' });
// ensure unique username if changing
if (username) {
const exists = await query('SELECT 1 FROM users WHERE username=$1 AND id<>$2', [username, req.user.id]);
if (exists.rowCount > 0) return res.status(400).json({ error: 'Username already taken' });
}
const { rows } = await query(
'UPDATE users SET username=COALESCE($1, username), name=COALESCE($2, name) WHERE id=$3 RETURNING id, email, username, name, created_at',
[username || null, name || null, req.user.id]
);
return res.json(rows[0]);
});


router.put('/me/password', authRequired, async (req, res) => {
const { currentPassword, newPassword } = req.body;
if (!currentPassword || !newPassword) return res.status(400).json({ error: 'Both current and new passwords are required' });
const { rows } = await query('SELECT password_hash FROM users WHERE id=$1', [req.user.id]);
const ok = await bcrypt.compare(currentPassword, rows[0].password_hash);
if (!ok) return res.status(400).json({ error: 'Current password incorrect' });
if (newPassword.length < 8) return res.status(400).json({ error: 'New password too weak (min 8 chars)' });
const hash = await bcrypt.hash(newPassword, 10);
await query('UPDATE users SET password_hash=$1 WHERE id=$2', [hash, req.user.id]);
return res.json({ message: 'Password updated' });
});


export default router;
