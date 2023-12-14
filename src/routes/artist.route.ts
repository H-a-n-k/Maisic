import { Router } from "express";
import { default as ctrl } from '../controllers/artist.controller'
import multerUpload from "../middleware/multerUpload";
import { MulterField } from "../utils/config";

const artistRoute = (router: Router) => {
    const r = '/artist'
    router.route(r).get(ctrl.list).post(multerUpload([MulterField.fileImage]), ctrl.add)
    router.route(r + '/:id').get(ctrl.find).delete(ctrl.remove)
}

export default artistRoute