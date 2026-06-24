const express = require('express');
const multer = require('multer');
const { createMusic, getAllMusic, getMusicById } = require('../controllers/music.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post(
  '/',
  upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'audioUrl', maxCount: 1 },
  ]),
  authMiddleware,
  roleMiddleware('artist'),
  createMusic
);
router.get('/', authMiddleware, getAllMusic);
router.get('/:id', authMiddleware, getMusicById);

module.exports = router;
