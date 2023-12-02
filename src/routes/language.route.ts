
import { default as Ctrl } from "../controllers/language.controller";
import { Router } from "express";

const languageRoute = (router: Router) => {
    const r = '/lang'
    router.route(r + '/').get(Ctrl.list).post(Ctrl.add)
    router.route(r + '/:id').put(Ctrl.update).delete(Ctrl.remove).get(Ctrl.find)

    return router
}
//const languageRoute = Router()

export default languageRoute