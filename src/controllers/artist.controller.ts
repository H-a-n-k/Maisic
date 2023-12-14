import { Request, Response } from "express";
import ArtistService from "../services/artist.service";
import Artist from "../models/artist";
import CrudControllerProxy from "./CrudController";
import { MulterResult } from "../middleware/multerUpload";
import { MulterField } from "../utils/config";
import { removeFile } from "./file.controller";

class ArtistController extends CrudControllerProxy<Artist>{ 
    async add(req: Request, res: Response): Promise<void> {
        const artist: Artist = req.body;

        var files: any = req.files
        if (files) {
            var fileImg: MulterResult = files[MulterField.fileImage];
            if (fileImg && fileImg[0]?.filename) artist.AnhDaiDien = fileImg[0].filename;
        }

        super.add(req, res);
    }

    async remove(req: Request, res: Response): Promise<void> {
        const { id } = req.params
        const item = await service.find({ ID: parseInt(id) } as Artist);

        if (item.AnhDaiDien) {
            removeFile(item.AnhDaiDien)
        }

        super.remove(req, res);
    }
}

const service = new ArtistService();
const artistController = new ArtistController(service);
export default artistController