import { Router } from "express";
import { default as ctrl } from '../controllers/song.controller'
import multerUpload from "../middleware/multerUpload";
import { MulterField } from "../utils/config";
import authorize, { Role } from "../middleware/authorize";

const songRouter = (router: Router) => {
    const r = '/song'
    router.route(r)
        .get(ctrl.list)
        .post(multerUpload([MulterField.fileText, MulterField.fileImage , MulterField.fileMusic]), ctrl.add)
    router.route(r + '/:id').get(ctrl.find).delete(ctrl.remove)
        .put(multerUpload([MulterField.fileText, MulterField.fileImage, MulterField.fileMusic]), ctrl.update)

    router.get(r + '/u/findSong', ctrl.findSong)
    router.get(r + '/u/addView/:id', authorize([Role.user]) ,ctrl.addView)
}

export default songRouter