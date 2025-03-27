const multer = require("multer");
const DIR = "./public/uploads/";
const path = require('path');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads'); // Destination folder for uploaded images
    },
    filename: (req, file, cb) => {
        console.log(file, "My file name")
        const extension = path.extname(file.originalname);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.originalname); // Set unique filenames
    }
});

// Create the multer middleware
const upload = multer({ storage: storage });
module.exports = upload;
