import { default as Ctrl} from "../controllers/category.controller";
import { Router } from "express";

const cateRouter = (router: Router) => {
    const r = '/cate'

    router.route(r + '/').get(Ctrl.list).post(Ctrl.add);
    router.route(r + '/:id').put(Ctrl.update).delete(Ctrl.remove).get(Ctrl.find);
    router.route(r + '/u/getTree').get(Ctrl.getNestedList)
    router.route(r + '/u/getOptSuper/:id').get(Ctrl.getOptSuper)
}

export default cateRouter