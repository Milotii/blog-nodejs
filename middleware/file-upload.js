const multer = require('multer');
const { v4: uuidv4 } = require("uuid");

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg',
}
const fileUpload = multer({
    limits: 50000,
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads/images');
        },
        filename: (req, file, cb) => {
            const ext = MIME_TYPE_MAP[file.mimetype];
            cb(null, uuidv4() + '.' + ext);
        }
    }),
    fileFilter: (req, file, cb) => {
        const isValid = !!MIME_TYPE_MAP[file.mimetype] // !! -> returns null or undefined to false, and one of the findings into true
        let error = isValid ? null : new Error('Invalid mime type');
        cb(error, isValid);
    }
});

module.exports = fileUpload;