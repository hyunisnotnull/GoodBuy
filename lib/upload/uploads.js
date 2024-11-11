const multer = require('multer');
const uuid4 = require('uuid4');
const path = require('path');
const fs = require('fs');

const uploads = {

    UPLOAD_PROFILE_MIDDLEWARE: () => {

        const upload = multer({
            storage: multer.diskStorage({
                destination(req, file, done) {
                    let fileDir = `c:\\goodbuy\\upload\\profile_thums\\${req.body.u_id}\\`;
                    if (!fs.existsSync(fileDir))
                        fs.mkdirSync(fileDir, {recursive: true});

                    done(null, fileDir);

                },
                filename(req, file, done) {
                    let uuid = uuid4();
                    let extName =  path.extname(file.originalname);
                    let fileName = uuid + extName;

                    done(null, fileName);
                    
                }
            }),
            limits: {
                fileSize: 1024 * 1024,
            },

        });

        return upload.single('profile_thum');

    },

    UPLOAD_MULTI_PROFILE_MIDDLEWARE: () => {
        const upload = multer({
            storage: multer.diskStorage({
                destination(req, file, done) {
                    let fileDir = `c:\\goodbuy\\upload\\profile_thums\\${req.body.u_id}\\`;
                    if (!fs.existsSync(fileDir))
                        fs.mkdirSync(fileDir, {recursive: true});
                    done(null, fileDir);
                },
                filename(req, file, done) {
                    let uuid = uuid4();
                    let extName =  path.extname(file.originalname);
                    let fileName = uuid + extName;
                    done(null, fileName);
                    
                }
            }),
            limits: {
                fileSize: 1024 * 1024,
            },
        });
        return upload.array('profile_thum', 3);
    },

    UPLOAD_CHAT_IMAGE_MIDDLEWARE: () => {
        const upload = multer({
            storage: multer.diskStorage({
                destination(req, file, done) {
                    let roomId = req.params.roomId;
                    let fileDir = `c:\\goodbuy\\upload\\chat_images\\${roomId}\\`;
                    
                    if (!fs.existsSync(fileDir))
                        fs.mkdirSync(fileDir, {recursive: true});

                    done(null, fileDir);
                },
                filename(req, file, done) {
                    let uuid = uuid4();
                    let extName = path.extname(file.originalname);
                    let fileName = uuid + extName;

                    done(null, fileName);
                }
            }),
            limits: {
                fileSize: 1024 * 1024 * 5, // 파일 크기(5MB)
            },
        });
        
        return upload.single('chat_image');
    }

}

module.exports = uploads;