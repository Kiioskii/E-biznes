const express = require('express');
const config = require('../config');
const { createSession } = require('../services/session');
const githubOAuth = require('../services/githubOAuth');

const router = express.Router();

function redirectWithError(res, message) {
  const params = new URLSearchParams({ error: message });
  res.redirect(`${config.frontendUrl}/auth/callback?${params.toString()}`);
}

router.get('/github', (_req, res) => {
  if (!githubOAuth.isConfigured()) {
    return res.status(503).json({
      error:
        'GitHub OAuth nie jest skonfigurowany. Uzupełnij GITHUB_CLIENT_ID i GITHUB_CLIENT_SECRET.',
    });
  }

  const state = githubOAuth.createOAuthState();
  res.redirect(githubOAuth.buildGithubAuthUrl(state));
});

router.get('/github/callback', async (req, res) => {
  const { code, state, error } = req.query;

  if (error) {
    return redirectWithError(res, 'Logowanie przez GitHub zostało anulowane');
  }

  if (!code || !state || !githubOAuth.consumeOAuthState(state)) {
    return redirectWithError(res, 'Nieprawidłowy stan OAuth');
  }

  try {
    const tokens = await githubOAuth.exchangeCodeForTokens(code);
    const profile = await githubOAuth.fetchGithubProfile(tokens.access_token);
    const user = githubOAuth.findOrCreateOAuthUser(profile, tokens);
    const session = createSession(user.id);

    res.redirect(
      `${config.frontendUrl}/auth/callback?token=${encodeURIComponent(session.token)}`,
    );
  } catch (err) {
    return redirectWithError(
      res,
      err.message || 'Logowanie przez GitHub nie powiodło się',
    );
  }
});

module.exports = router;
