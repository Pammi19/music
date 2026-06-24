const Album = require("../models/album.model");
const {uploadFile} = require("../services/storage.sservice")

const createAlbum = async (req, res) => {
  try {
    // const {
    //   title,
    //   description,
    //   coverImage,
    // } = req.body;

     const {title,description,} = req.body;

     const result=await uploadFile(req.file.buffer);

    const album = await Album.create({
      title,
      description,
      coverImage: result.url,
      artist: req.user.id,
    });

    // const album = await Album.create({
    //   title,
    //   description,
    //   coverImage,
    //   artist: req.user.id,
    // });

    res.status(201).json({
      success: true,
      album,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getAllAlbums = async (req, res) => {
  try {
    const albums = await Album.find()
      .populate("artist", "name")
      .populate("songs");

    res.status(200).json({
      success: true,
      count: albums.length,
      albums,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getAlbumById = async (req, res) => {
  try {
    const album = await Album.findById(req.params.id)
      .populate("artist", "name")
      .populate("songs");

    if (!album) {
      return res.status(404).json({
        message: "Album not found",
      });
    }

    res.status(200).json(album);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createAlbum,
  getAllAlbums,
  getAlbumById,
};