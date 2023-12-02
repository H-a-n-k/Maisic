import { Router } from "express";
import {default as ctrl} from '../controllers/account.controller'

const accountRouter = (router: Router) => { 
    const r = '/acc'
    router.route(r).get(ctrl.list).post(ctrl.add)
    router.route(r + '/:id').get(ctrl.find).put(ctrl.update).delete(ctrl.remove)
    router.route(r + '/u/types').get(ctrl.getTypes)
}

export default accountRouter