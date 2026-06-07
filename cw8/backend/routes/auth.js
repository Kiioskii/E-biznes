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

function normalizeEmail(email) {
    return email.trim().toLowerCase();
}

router.post("/register", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email i hasło są wymagane" });
    }

    const normalizedEmail = normalizeEmail(email);

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
        return res.status(400).json({ error: "Nieprawidłowy adres email" });
    }

    if (password.length < 6) {
        return res.status(400).json({ error: "Hasło musi mieć co najmniej 6 znaków" });
    }

    const existingUser = db.prepare("SELECT id FROM users WHERE email = ?").get(normalizedEmail);

    if (existingUser) {
        return res.status(409).json({ error: "Użytkownik z tym adresem email już istnieje" });
    }

    const passwordHash = bcrypt.hashSync(password, 10);

    const result = db
        .prepare("INSERT INTO users (email, password_hash) VALUES (?, ?)")
        .run(normalizedEmail, passwordHash);

    const user = { id: result.lastInsertRowid, email: normalizedEmail };
    const session = createSession(user.id);

    res.status(201).json({
        token: session.token,
        user,
    });
});

router.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email i hasło są wymagane" });
    }

    const user = db
        .prepare("SELECT id, email, password_hash FROM users WHERE email = ?")
        .get(normalizeEmail(email));

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
