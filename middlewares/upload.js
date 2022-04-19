const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: path.join(__dirname, '../public/uploads/images'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Math.floor(Math.random() * 123456789);
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  const validFileFormat = ['.png', '.jpeg', '.jpg'];
  const { mimetype } = file;
  const fileFormat = path.extname(file.originalname);

  if (validFileFormat.includes(fileFormat) && mimetype.includes('image')) {
    return cb(null, true);
  }
  return cb('INVALID_FILE_FORMAT', false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1 * 1024 * 1024 /* 1MB */ },
}).array('tweetPhotos', 10);

module.exports = upload;
