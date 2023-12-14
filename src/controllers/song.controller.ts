import SongService from "../services/song.service";
import Song from "../models/song";
import CrudControllerProxy from "./CrudController";
import { Request, RequestHandler, Response } from "express";
import { MulterResult } from "../middleware/multerUpload";
import { MulterField } from "../utils/config";
import { removeFile } from "./file.controller";
import HttpRespose from "../types/HttpReponse";

class SongController extends CrudControllerProxy<Song>{ 
    async add(req: Request, res: Response): Promise<void> {
        const song: Song = req.body;

        song.LuotTai = 0;
        song.LuotNghe = 0;
        
        var files: any = req.files
        if (files) { 
            var fileImg: MulterResult = files[MulterField.fileImage];
            if (fileImg && fileImg[0]?.filename) song.AnhBia = fileImg[0].filename;

            var fileMusic = files[MulterField.fileMusic];
            if (fileMusic && fileMusic[0]?.filename) song.MusicAPIPath = fileMusic[0].filename;    

            var fileText = files[MulterField.fileText];
            if (fileText && fileText[0]?.filename) song.LoiNhac = fileText[0].filename;    
        }

        super.add(req, res);
    }

    async update(req: Request, res: Response): Promise<void> {
        const song: Song = req.body;

        var files: any = req.files
        if (files) {
            var fileImg: MulterResult = files[MulterField.fileImage];
            if (fileImg && fileImg[0]?.filename) song.AnhBia = fileImg[0].filename;

            var fileMusic = files[MulterField.fileMusic];
            if (fileMusic && fileMusic[0]?.filename) song.MusicAPIPath = fileMusic[0].filename;

            var fileText = files[MulterField.fileText];
            if (fileText && fileText[0]?.filename) song.LoiNhac = fileText[0].filename;
        }

        super.update(req, res)
    }

    async remove(req: Request, res: Response): Promise<void> {
        const { id } = req.params
        const item = await service.find({ ID: parseInt(id) });

        if (item.AnhBia) { 
            removeFile(item.AnhBia)
        }
        if (item.LoiNhac) { 
            removeFile(item.LoiNhac)
        }
        if (item.MusicAPIPath) { 
            removeFile(item.MusicAPIPath)
        }

        super.remove(req, res);
    }

    findSong: RequestHandler = async (req: any, res) => { 
        const { keyword, cateID, order, asc, limit } = req.query;

        var list = await service.findSong(keyword, cateID, order, asc, limit)
        res.json(new HttpRespose(list))
    }

    addView: RequestHandler = async (req, res) => { 
        const { id } = req.params;
        var accID = res.locals.accID

        var flag = await service.addView(parseInt(id), accID)

        res.json(new HttpRespose([], flag))
    }
}

const service = new SongService()
const songController = new SongController(service)

export default songController