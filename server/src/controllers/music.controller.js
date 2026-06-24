const Music = require('../models/music.model');
const Album = require('../models/album.model');
const { uploadFile, audioFile } = require('../services/storage.service');

const createMusic = async (req, res) => {
  try {
    const { title, genre, album } = req.body;

    const imageFileData = req.files.coverImage[0];
    const songFileData = req.files.audioUrl[0];

    const result = await uploadFile(imageFileData.buffer);
    const audio = await audioFile(songFileData.buffer);

    const music = await Music.create({
      title,
      genre,
      audioUrl: audio.url,
      coverImage: result.url,
      album: album || null,
      artist: req.user.id,
    });

    if (album) {
      await Album.findByIdAndUpdate(album, { $push: { songs: music._id } });
    }

    res.status(201).json({ success: true, music });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllMusic = async (req, res) => {
  try {
    const music = await Music.find()
      .populate('artist', 'name email')
      .populate('album', 'title');

    res.status(200).json({ success: true, count: music.length, music });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMusicById = async (req, res) => {
  try {
    const music = await Music.findById(req.params.id)
      .populate('artist', 'name')
      .populate('album', 'title');

    if (!music) {
      return res.status(404).json({ message: 'Music not found' });
    }

    res.status(200).json(music);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createMusic, getAllMusic, getMusicById };
