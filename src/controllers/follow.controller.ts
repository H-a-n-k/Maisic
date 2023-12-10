import Follow from "../models/follow";
import CrudControllerProxy from "./CrudController";
import FollowService from "../services/follow.service";
import { Request, Response } from "express";
import HttpRespose from "../types/HttpReponse";


class FollowController extends CrudControllerProxy<Follow>{ 
    async remove(req: Request, res: Response): Promise<void> {
        const { idUser, idArtist } = req.params
        
        const flag = await service.remove({ IDNgheSi: parseInt(idArtist), IDNguoiDung: parseInt(idUser) })
        res.json(new HttpRespose([], flag))
    }
}

const service = new FollowService();
const followController = new FollowController(service);

export default followController