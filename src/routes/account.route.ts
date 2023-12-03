import { Router } from "express";
import {default as ctrl} from '../controllers/account.controller'
import authorize from "../middleware/authorize";
import { Role } from "../utils/config";

const accountRouter = (router: Router) => { 
    const r = '/acc'
    router.route(r).get(ctrl.list).post(ctrl.add)
    router.route(r + '/:id').get(ctrl.find).delete(ctrl.remove)
    router.route(r + '/u/types').get(authorize([Role.admin]), ctrl.getTypes)
    router.route(r + '/u/login').post(ctrl.login)
}

export default accountRouter