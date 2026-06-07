const express = require("express");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const db = require("../db");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function createSession(userId) {
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + SESSION_TTL_MS).toISOString();

    db.prepare("INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)").run(token, userId, expiresAt);

    return { token, expiresAt };
}

router.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email i hasło są wymagane" });
    }

    const user = db
        .prepare("SELECT id, email, password_hash FROM users WHERE email = ?")
        .get(email.trim().toLowerCase());

    if (!user || !bcrypt.compareSync(password, user.password_hash)) {
        return res.status(401).json({ error: "Nieprawidłowy email lub hasło" });
    }

    const session = createSession(user.id);

    res.json({
        token: session.token,
        user: { id: user.id, email: user.email },
    });
});

router.get("/me", authenticate, (req, res) => {
    res.json({ user: req.user });
});

router.post("/logout", authenticate, (req, res) => {
    db.prepare("DELETE FROM sessions WHERE token = ?").run(req.token);
    res.json({ message: "Wylogowano" });
});

module.exports = router;
