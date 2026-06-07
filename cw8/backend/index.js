const express = require('express');
const cors = require('cors');
require('./db');

const authRoutes = require('./routes/auth');
const googleRoutes = require('./routes/google');
const config = require('./config');

const app = express();

app.use(
  cors({
    origin: config.frontendUrl,
  }),
);
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/auth', googleRoutes);

app.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.port}`);
});
