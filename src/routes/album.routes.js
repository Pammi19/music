const express = require("express");
const multer= require("multer");

const {
  createAlbum,
  getAllAlbums,
  getAlbumById,
} = require("../controllers/album.controller");

const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

const router = express.Router();

// Artist only

const upload = multer({storage:multer.memoryStorage()});

router.post(
  "/",upload.single("coverImage"),                                //i added
  authMiddleware,
  roleMiddleware("artist"),
  createAlbum
);

// Logged-in users
router.get(
  "/",
  authMiddleware,
  getAllAlbums
);

router.get(
  "/:id",
  authMiddleware,
  getAlbumById
);

module.exports = router;