const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    coverImage: { type: String },
    artist: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    songs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Music' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Album', albumSchema);
