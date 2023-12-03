import { Router } from "express";
import { default as ctrl } from '../controllers/song.controller'
import multerUpload from "../middleware/multerUpload";
import { MulterField } from "../utils/config";

const songRouter = (router: Router) => {
    const r = '/song'
    router.route(r)
        .get(ctrl.list)
        .post(multerUpload([MulterField.fileText, MulterField.fileImage , MulterField.fileMusic]), ctrl.add)
    router.route(r + '/:id').get(ctrl.find).put(ctrl.update).delete(ctrl.remove)
}

export default songRouter