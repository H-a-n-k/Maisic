import { Router } from "express";
import { default as ctrl } from '../controllers/file.controller'
import multerUpload from "../middleware/multerUpload";


const fileRouter = (router: Router) => { 
    const r = '/file'
    router.route(r + '/download/:fileName').get(ctrl.downloadFile)
    router.route(r + '/get/:fileName').get(ctrl.getFile)
    router.route(r + '/upload').post(multerUpload('' ,['file1', 'file2']) , ctrl.uploadFile)
}

export default fileRouter