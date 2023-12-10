import { default as Ctrl } from "../controllers/notif.controller";
import { Router } from "express";

const notifRoute = (router: Router) => {
    const r = '/notif'
    router.route(r + '/').get(Ctrl.list)
    router.route(r + '/:idUser&:idSong').put(Ctrl.update).delete(Ctrl.remove)

    return router
}

export default notifRoute