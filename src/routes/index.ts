import { Router } from "express";
import languageRoute from "./language.route";
import cateRouter from "./category.route";
import accountRouter from "./account.route";
import songRouter from "./song.route";
import fileRouter from "./file.route";

const router = Router();

// const r = '/language'
// router.route(r + '/').get(Ctrl.list).post(Ctrl.add)
// router.route(r + '/:id').put(Ctrl.update).delete(Ctrl.remove).get(Ctrl.find)

cateRouter(router);
languageRoute(router);
accountRouter(router);
songRouter(router);
fileRouter(router);

export default router