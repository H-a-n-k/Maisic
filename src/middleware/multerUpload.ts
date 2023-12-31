import multer from "multer"
import path from 'path'

//enctype="multipart/form-data"
const dataDir = 'src/data'

const multerUpload = (fields: string[], dir: string = '') => { 
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

export type MulterResult = [
    {
        fieldname: string,
        originalname: string,
        filename: string,
        path: string,
        mimetype: string
    }
]