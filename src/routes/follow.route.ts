import { Router } from "express";
import { default as ctrl } from '../controllers/follow.controller'

const followRouter = (router: Router) => {
    const r = '/fw'
    router.route(r).get(ctrl.list).post(ctrl.add)
    router.route(r + '/:idUser&:idArtist').delete(ctrl.remove)
}

export default followRouter