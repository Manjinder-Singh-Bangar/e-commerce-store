import multer from "multer";
import fs from "fs";
import { v4 as uuid } from "uuid";

// Ensure the upload directory exists
const uploadDir = "./public/temp/products";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = `${Date.now()}-${uuid()}`;
        const extension = file.originalname.split('.').pop();
        cb(null, `${uniqueSuffix}.${extension}`);
    }
});

export const upload = multer({ storage });
