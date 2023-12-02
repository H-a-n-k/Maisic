import SongService from "../services/song.service";
import Song from "../models/song";
import CrudControllerProxy from "./CrudController";
import { Request, Response } from "express";
import { MulterResult } from "../middleware/multerUpload";

class SongController extends CrudControllerProxy<Song>{ 
    async add(req: Request, res: Response): Promise<void> {
        const song: Song = req.body;

        song.LuotTai = 0;
        song.LuotNghe = 0;
        
        //['fileImg', 'fileMusic']
        var files: any = req.files
        if (files) { 
            
        }
        var fileImg: MulterResult = files.fileImg;
        if (fileImg && fileImg[0]?.filename) song.AnhBia = fileImg[0].filename;

        var fileMusic = files.fileMusic;
        if (fileMusic && fileMusic[0]?.filename) song.MusicAPIPath = fileMusic[0].filename;

        super.add(req, res);
    }
}

const service = new SongService()
const songController = new SongController(service)

export default songController