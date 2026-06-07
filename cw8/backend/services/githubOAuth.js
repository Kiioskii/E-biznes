const crypto = require('crypto');
const config = require('../config');
const db = require('../db');

const GITHUB_AUTH_URL = 'https://github.com/login/oauth/authorize';
const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token';
const GITHUB_USER_URL = 'https://api.github.com/user';
const GITHUB_EMAILS_URL = 'https://api.github.com/user/emails';

const STATE_TTL_MS = 10 * 60 * 1000;
const PROVIDER = 'github';

function isConfigured() {
  return Boolean(config.github.clientId && config.github.clientSecret);
}

function createOAuthState() {
  const state = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + STATE_TTL_MS).toISOString();

  db.prepare('INSERT INTO oauth_states (state, expires_at) VALUES (?, ?)').run(
    state,
    expiresAt,
  );

  return state;
}

function consumeOAuthState(state) {
  const record = db
    .prepare('SELECT state, expires_at FROM oauth_states WHERE state = ?')
    .get(state);

  if (!record) {
    return false;
  }

  db.prepare('DELETE FROM oauth_states WHERE state = ?').run(state);

  return new Date(record.expires_at) >= new Date();
}

function buildGithubAuthUrl(state) {
  const params = new URLSearchParams({
    client_id: config.github.clientId,
    redirect_uri: config.github.redirectUri,
    scope: 'read:user user:email',
    state,
  });

  return `${GITHUB_AUTH_URL}?${params.toString()}`;
}

async function exchangeCodeForTokens(code) {
  const response = await fetch(GITHUB_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body: new URLSearchParams({
      client_id: config.github.clientId,
      client_secret: config.github.clientSecret,
      code,
      redirect_uri: config.github.redirectUri,
    }),
  });

  const data = await response.json();

  if (!response.ok || data.error) {
    throw new Error(
      data.error_description || data.error || 'Nie udało się wymienić kodu OAuth',
    );
  }

  return data;
}

async function fetchGithubProfile(accessToken) {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    Accept: 'application/vnd.github+json',
    'User-Agent': 'cw8-app',
  };

  const userResponse = await fetch(GITHUB_USER_URL, { headers });
  const user = await userResponse.json();

  if (!userResponse.ok) {
    throw new Error('Nie udało się pobrać profilu GitHub');
  }

  let email = user.email?.trim().toLowerCase();

  if (!email) {
    const emailsResponse = await fetch(GITHUB_EMAILS_URL, { headers });
    const emails = await emailsResponse.json();

    if (!emailsResponse.ok) {
      throw new Error('Nie udało się pobrać adresu email z GitHub');
    }

    const primaryEmail = emails.find((entry) => entry.primary && entry.verified);
    const verifiedEmail = emails.find((entry) => entry.verified);
    email = (primaryEmail || verifiedEmail)?.email?.trim().toLowerCase();
  }

  if (!email) {
    throw new Error('Konto GitHub nie ma publicznego adresu email');
  }

  return {
    id: String(user.id),
    email,
    login: user.login,
  };
}

function findOrCreateOAuthUser(profile, tokens) {
  const providerUserId = profile.id;
  const email = profile.email;

  const existingOAuth = db
    .prepare(
      `SELECT oa.user_id, u.id, u.email
       FROM oauth_accounts oa
       JOIN users u ON u.id = oa.user_id
       WHERE oa.provider = ? AND oa.provider_user_id = ?`,
    )
    .get(PROVIDER, providerUserId);

  if (existingOAuth) {
    db.prepare(
      `UPDATE oauth_accounts
       SET access_token = ?, updated_at = CURRENT_TIMESTAMP
       WHERE provider = ? AND provider_user_id = ?`,
    ).run(tokens.access_token, PROVIDER, providerUserId);

    return { id: existingOAuth.id, email: existingOAuth.email };
  }

  let user = db.prepare('SELECT id, email FROM users WHERE email = ?').get(email);

  if (!user) {
    const result = db
      .prepare('INSERT INTO users (email, password_hash) VALUES (?, NULL)')
      .run(email);
    user = { id: result.lastInsertRowid, email };
  }

  db.prepare(
    `INSERT INTO oauth_accounts
     (user_id, provider, provider_user_id, access_token, refresh_token, expires_at)
     VALUES (?, ?, ?, ?, NULL, NULL)`,
  ).run(user.id, PROVIDER, providerUserId, tokens.access_token);

  return user;
}

module.exports = {
  isConfigured,
  createOAuthState,
  consumeOAuthState,
  buildGithubAuthUrl,
  exchangeCodeForTokens,
  fetchGithubProfile,
  findOrCreateOAuthUser,
};
