const db = require('../db');

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Brak tokenu autoryzacji' });
  }

  const token = authHeader.slice(7);
  const session = db
    .prepare(
      `SELECT s.token, s.expires_at, u.id AS user_id, u.email
       FROM sessions s
       JOIN users u ON u.id = s.user_id
       WHERE s.token = ?`,
    )
    .get(token);

  if (!session) {
    return res.status(401).json({ error: 'Nieprawidłowy token' });
  }

  if (new Date(session.expires_at) < new Date()) {
    db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
    return res.status(401).json({ error: 'Token wygasł' });
  }

  req.user = { id: session.user_id, email: session.email };
  req.token = token;
  next();
}

module.exports = { authenticate };
