const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      // Specify the destination directory where uploaded files will be stored
      cb(null, 'assets');
    },
    filename: (req, file, cb) => {
      // Specify the file name for the uploaded file
      cb(null, Date.now() + '-' + file.originalname);
    },
  });

  const upload = multer({ storage: storage });

  module.exports = {
    upload: upload
  };