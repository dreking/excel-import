const multer = require('multer');

// Setup the upload prpcess
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        const filename = file.originalname.replace(' ', '');
        cb(null, Date.now() + filename);
    },
});

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'application/vnd.ms-excel' ||
        file.mimetype ===
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

module.exports = { storage, fileFilter };
