const express = require('express');
const multer = require('multer');
const { createAlbum, getAllAlbums, getAlbumById } = require('../controllers/album.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('coverImage'), authMiddleware, roleMiddleware('artist'), createAlbum);
router.get('/', authMiddleware, getAllAlbums);
router.get('/:id', authMiddleware, getAlbumById);

module.exports = router;
