import { default as Ctrl } from "../controllers/seed.controller";
import { Router } from "express";

const seedRoute = (router: Router) => {
    const r = '/seed'

    router.route(r + '/').get(Ctrl.seed);
}

export default seedRoute