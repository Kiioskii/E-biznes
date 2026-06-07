const bcrypt = require('bcryptjs');
const db = require('../db');

const email = 'test@example.com';
const password = 'password123';
const passwordHash = bcrypt.hashSync(password, 10);

const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);

if (existing) {
  console.log(`Użytkownik ${email} już istnieje`);
} else {
  db.prepare('INSERT INTO users (email, password_hash) VALUES (?, ?)').run(
    email,
    passwordHash,
  );
  console.log(`Utworzono użytkownika testowego:`);
  console.log(`  email: ${email}`);
  console.log(`  hasło: ${password}`);
}
