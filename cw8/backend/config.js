require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3001,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri:
      process.env.GOOGLE_REDIRECT_URI ||
      'http://localhost:3001/api/auth/google/callback',
  },
  github: {
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    redirectUri:
      process.env.GITHUB_REDIRECT_URI ||
      'http://localhost:3001/api/auth/github/callback',
  },
};
