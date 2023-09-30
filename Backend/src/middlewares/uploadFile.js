const cloudinary = require('../config/cloudinary.config');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const storage = new CloudinaryStorage({
    cloudinary,
    allowedFormats: ['jpg', 'png', 'gif'],
    params: {
        folder: 'Dev-Community',
    },
});

const uploadCloud = multer({ storage });

module.exports = uploadCloud;
