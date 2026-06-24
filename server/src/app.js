const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/auth.routes');
const albumRoutes = require('./routes/album.routes');
const musicRoutes = require('./routes/music.routes');

const app = express();

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://pammi19.github.io'
  ],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/albums', albumRoutes);
app.use('/music', musicRoutes);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

module.exports = app;
