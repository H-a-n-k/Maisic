import SongService from "../services/song.service";
import Song from "../models/song";
import CrudControllerProxy from "./CrudController";
import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";

class SongController extends CrudControllerProxy<Song>{ 
    async add(req: Request, res: Response): Promise<void> {
        const song: Song = req.body;

        song.LuotTai = 0;
        song.LuotNghe = 0;
    }
}

const service = new SongService()
const songController = new SongController(service)

export default songController