const Music = require("../models/music.model");
const Album = require("../models/album.model");


const { uploadFile,audioFile } = require("../services/storage.sservice")

const createMusic = async (req, res) => {
  try {
    // const {
    //   title,
    //   genre,
    //   audioUrl,
    //   coverImage,
    //   album,
    // } = req.body;

     const { title, genre, album } = req.body;

    const imageFile = req.files.coverImage[0];   //in upload.fields->req.files uses not req.file
    const songFile = req.files.audioUrl[0];

    const result = await uploadFile(imageFile.buffer);
    const audio = await audioFile(songFile.buffer);

    const music = await Music.create({
      title,
      genre,
      audioUrl: audio.url,
      coverImage: result.url,
      album,
      artist: req.user.id,
    });
      res.status(201).json(music);
    
    //  const { title, genre, album } = req.body;

    // const imageFile = req.files.image[0];
    // const songFile = req.files.song[0];

    // const imageResult = await uploadToImageKit(
    //   imageFile.buffer,
    //   imageFile.originalname
    // );

    // const audioResult = await uploadToImageKit(
    //   songFile.buffer,
    //   songFile.originalname
    // );

    // const music = await Music.create({
    //   title,
    //   genre,
    //   audioUrl: audioResult.url,
    //   coverImage: imageResult.url,
    //   album,
    //   artist: req.user.id,
    // });


    if (album) {
      await Album.findByIdAndUpdate(album, {
        $push: {
          songs: music._id,
        },
      });
    }

    res.status(201).json({
      success: true,
      music,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getAllMusic = async (req, res) => {
  try {
    const music = await Music.find()
      .populate("artist", "name email")
      .populate("album", "title");

    res.status(200).json({
      success: true,
      count: music.length,
      music,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getMusicById = async (req, res) => {
  try {
    const music = await Music.findById(req.params.id)
      .populate("artist", "name")
      .populate("album", "title");

    if (!music) {
      return res.status(404).json({
        message: "Music not found",
      });
    }

    res.status(200).json(music);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createMusic,
  getAllMusic,
  getMusicById,
};