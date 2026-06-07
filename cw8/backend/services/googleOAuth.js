const crypto = require("crypto");
const config = require("../config");
const db = require("../db");

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo";

const STATE_TTL_MS = 10 * 60 * 1000;

function isConfigured() {
    return Boolean(config.google.clientId && config.google.clientSecret);
}

function createOAuthState() {
    const state = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + STATE_TTL_MS).toISOString();

    db.prepare("INSERT INTO oauth_states (state, expires_at) VALUES (?, ?)").run(state, expiresAt);

    return state;
}

function consumeOAuthState(state) {
    const record = db.prepare("SELECT state, expires_at FROM oauth_states WHERE state = ?").get(state);

    if (!record) {
        return false;
    }

    db.prepare("DELETE FROM oauth_states WHERE state = ?").run(state);

    return new Date(record.expires_at) >= new Date();
}

function buildGoogleAuthUrl(state) {
    const params = new URLSearchParams({
        client_id: config.google.clientId,
        redirect_uri: config.google.redirectUri,
        response_type: "code",
        scope: "openid email profile",
        state,
        access_type: "offline",
        prompt: "consent",
    });

    return `${GOOGLE_AUTH_URL}?${params.toString()}`;
}

async function exchangeCodeForTokens(code) {
    const response = await fetch(GOOGLE_TOKEN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            code,
            client_id: config.google.clientId,
            client_secret: config.google.clientSecret,
            redirect_uri: config.google.redirectUri,
            grant_type: "authorization_code",
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error_description || "Nie udało się wymienić kodu OAuth");
    }

    return data;
}

async function fetchGoogleProfile(accessToken) {
    const response = await fetch(GOOGLE_USERINFO_URL, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error("Nie udało się pobrać profilu Google");
    }

    return data;
}

function findOrCreateOAuthUser(profile, tokens) {
    const providerUserId = profile.id;
    const email = profile.email?.trim().toLowerCase();

    if (!email) {
        throw new Error("Konto Google nie ma przypisanego adresu email");
    }

    const tokenExpiresAt = tokens.expires_in ? new Date(Date.now() + tokens.expires_in * 1000).toISOString() : null;

    const existingOAuth = db
        .prepare(
            `SELECT oa.user_id, u.id, u.email
       FROM oauth_accounts oa
       JOIN users u ON u.id = oa.user_id
       WHERE oa.provider = 'google' AND oa.provider_user_id = ?`,
        )
        .get(providerUserId);

    if (existingOAuth) {
        db.prepare(
            `UPDATE oauth_accounts
       SET access_token = ?, refresh_token = COALESCE(?, refresh_token),
           expires_at = ?, updated_at = CURRENT_TIMESTAMP
       WHERE provider = 'google' AND provider_user_id = ?`,
        ).run(tokens.access_token, tokens.refresh_token || null, tokenExpiresAt, providerUserId);

        return { id: existingOAuth.id, email: existingOAuth.email };
    }

    let user = db.prepare("SELECT id, email FROM users WHERE email = ?").get(email);

    if (!user) {
        const result = db.prepare("INSERT INTO users (email, password_hash) VALUES (?, NULL)").run(email);
        user = { id: result.lastInsertRowid, email };
    }

    db.prepare(
        `INSERT INTO oauth_accounts
     (user_id, provider, provider_user_id, access_token, refresh_token, expires_at)
     VALUES (?, 'google', ?, ?, ?, ?)`,
    ).run(user.id, providerUserId, tokens.access_token, tokens.refresh_token || null, tokenExpiresAt);

    return user;
}

module.exports = {
    isConfigured,
    createOAuthState,
    consumeOAuthState,
    buildGoogleAuthUrl,
    exchangeCodeForTokens,
    fetchGoogleProfile,
    findOrCreateOAuthUser,
};
