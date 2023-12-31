import { Request, Response } from "express"
import { CustomError } from "../middleware/errorHandler"
import path from "path"
import fs from 'fs'
import { dataDir } from "../utils/config"

const getFilePath = (req: Request) => {
    const { fileName } = req.params

    const filePath = path.join(dataDir, fileName)
    if (!fs.existsSync(filePath)) throw new CustomError(404, 'file not found')

    return filePath
}

const fileController = {

    downloadFile: (req: Request, res: Response) => { 
        var filePath = getFilePath(req);
        res.download(filePath)
    },
    getFile: (req: Request, res: Response) => { 
        var filePath = getFilePath(req);
        res.sendFile(filePath)
    },

    uploadFile: (req: Request, res: Response) => { 
        const files: any = req.files
        if (!files) {
            throw new CustomError(400, 'file error')
        }

        //console.log(files)
        res.json('ok')
    }
}

export default fileController

export const removeFile = (file: string): boolean => {
    fs.unlink(path.join(dataDir, file), (err) => { 
        if (err) { 
            console.log('error removing file ' + file, err)
            return false;
        }
    })

    return true;
}