const crypto = require('crypto');
const db = require('../db');

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function createSession(userId) {
  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS).toISOString();

  db.prepare(
    'INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)',
  ).run(token, userId, expiresAt);

  return { token, expiresAt };
}

module.exports = { createSession };
