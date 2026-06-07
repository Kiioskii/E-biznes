const express = require('express');
const config = require('../config');
const { createSession } = require('../services/session');
const googleOAuth = require('../services/googleOAuth');

const router = express.Router();

function redirectWithError(res, message) {
  const params = new URLSearchParams({ error: message });
  res.redirect(`${config.frontendUrl}/auth/callback?${params.toString()}`);
}

router.get('/google', (_req, res) => {
  if (!googleOAuth.isConfigured()) {
    return res.status(503).json({
      error: 'Google OAuth nie jest skonfigurowany. Uzupełnij GOOGLE_CLIENT_ID i GOOGLE_CLIENT_SECRET.',
    });
  }

  const state = googleOAuth.createOAuthState();
  res.redirect(googleOAuth.buildGoogleAuthUrl(state));
});

router.get('/google/callback', async (req, res) => {
  const { code, state, error } = req.query;

  if (error) {
    return redirectWithError(res, 'Logowanie przez Google zostało anulowane');
  }

  if (!code || !state || !googleOAuth.consumeOAuthState(state)) {
    return redirectWithError(res, 'Nieprawidłowy stan OAuth');
  }

  try {
    const tokens = await googleOAuth.exchangeCodeForTokens(code);
    const profile = await googleOAuth.fetchGoogleProfile(tokens.access_token);
    const user = googleOAuth.findOrCreateOAuthUser(profile, tokens);
    const session = createSession(user.id);

    res.redirect(
      `${config.frontendUrl}/auth/callback?token=${encodeURIComponent(session.token)}`,
    );
  } catch (err) {
    return redirectWithError(
      res,
      err.message || 'Logowanie przez Google nie powiodło się',
    );
  }
});

module.exports = router;
