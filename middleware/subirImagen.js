import multer from 'multer';
import path from 'path';
import {generarID} from '../helpers/token.js'

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './public/uploads/')
    },
    filename: function(req, file, cb){
        cb(null, generarID() + path.extname(file.originalname))
    }
});

const upload = multer({storage})

export default upload;