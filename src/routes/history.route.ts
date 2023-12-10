import { Router } from "express";
import { default as ctrl } from '../controllers/history.controller'

const historyRouter = (router: Router) => {
    const r = '/history'
    router.route(r).get(ctrl.list)
}

export default historyRouter