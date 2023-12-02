import multer from "multer"
import path from 'path'

//enctype="multipart/form-data"
const dataDir = 'src/data'

const multerUpload = (dir: string, fields: string[]) => { 
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, path.join(dataDir, dir));
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname)
        }
    })
    var upload = multer({ storage: storage })

    return upload.fields(fields.map(x => { return {name: x} }))
}

export default multerUpload