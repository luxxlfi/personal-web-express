import multer from 'multer';
import path from "path";

// storege
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/upload/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const ext = path.extname(file.originalname)
        const withoutExt = path.basename(file.originalname, ext)

        cb(null, withoutExt + '-' + uniqueSuffix + '-' + ext)
    }
})


// filter file
const fileFilter = (req, file, cb) => {
    // file yg boleh masuk
    const allowedMimeType = ['image/jpeg', 'image/jpg', 'image/png']

    const ext = path.extname(file.originalname).toLowerCase()
    const allowext = ['.jpeg', '.jpg', '.png']

    const typeValid = allowedMimeType.includes(file.mimetype);
    const extValid = allowext.includes(ext);

    if (typeValid && extValid) {
        cb(null, true);
    } else {
        if (!typeValid) {
            cb(new Error('file harus berpa jpeg, jpg atau png!'), false);
        } else {
            cb(new Error('file extention tidak valid!'), false);
        }
    }
}

// limit size

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
        files: 1
    }
})

export default upload;