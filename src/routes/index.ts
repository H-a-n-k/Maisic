import { Router } from "express";
import languageRoute from "./language.route";
import cateRouter from "./category.route";
import accountRouter from "./account.route";
import songRouter from "./song.route";
import fileRouter from "./file.route";
import followRouter from "./follow.route";
import historyRouter from "./history.route";
import notifRoute from "./notif.route";
import seedRoute from "./seed.route";
import artistRoute from "./artist.route";

const router = Router();

cateRouter(router);
languageRoute(router);
accountRouter(router);
songRouter(router);
fileRouter(router);
followRouter(router)
historyRouter(router)
notifRoute(router)
artistRoute(router)
seedRoute(router)

export default router