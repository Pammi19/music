const { ImageKit } = require('@imagekit/nodejs');

const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

async function uploadFile(buffer) {
  const result = await imagekit.files.upload({
    file: buffer.toString('base64'),
    fileName: 'image.jpg',
  });
  return result;
}

async function audioFile(buffer) {
  const audio = await imagekit.files.upload({
    file: buffer.toString('base64'),
    fileName: 'song.mp3',
  });
  return audio;
}

module.exports = { uploadFile, audioFile };
