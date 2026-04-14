import multer from "multer";

export function handleUploadError(upload) {
    return (req, res, next) => {
        upload(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                if (err.code === 'LIMiT_FILE_SIZE') {
                    req.flash('error', 'file terlalu BESAR!!')
                } else if (err.code === 'LIMiT_FILE_SIZE') {
                    req.flash('error', 'file terlalu banyak!!')
                } else {
                    req.flash('error', err.message);
                }
                return res.redirect('form-projects')
            } else if (err) {
                req.flash('error', err.massage);
                return res.redirect('/form-projects');

            } else {
                next()
            }
        })
    }
}