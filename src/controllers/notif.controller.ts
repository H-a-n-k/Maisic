import NotifService from "../services/notif.service";
import Notif from "../models/notif";
import CrudControllerProxy from "./CrudController";
import { Request, Response } from "express";
import HttpRespose from "../types/HttpReponse";

class NotifController extends CrudControllerProxy<Notif>{ 
    async update(req: Request, res: Response): Promise<void> {
        const { idUser, idSong } = req.params
        var item: Notif = req.body;
        item = { ...item, IDBaiHat: parseInt(idSong), IDNguoiDung: parseInt(idUser) };

        const flag = await service.update(item);
        res.json(new HttpRespose([], flag));
    }

    async remove(req: Request, res: Response): Promise<void> {
        const { idUser, idSong } = req.params

        const flag = await service.remove({ IDBaiHat: parseInt(idSong), IDNguoiDung: parseInt(idUser) })
        res.json(new HttpRespose([], flag));
    }
}

const service = new NotifService();
const controller = new NotifController(service);

export default controller