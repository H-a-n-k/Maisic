import { Router } from "express";
import { default as ctrl } from '../controllers/song.controller'

const songRouter = (router: Router) => {
    const r = '/song'
    router.route(r).get(ctrl.list).post(ctrl.add)
    router.route(r + '/:id').get(ctrl.find).put(ctrl.update).delete(ctrl.remove)
}

export default songRouter