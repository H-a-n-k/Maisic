import { NextFunction, Request, Response } from "express";
import HttpReponse from "../types/HttpReponse";

export class CustomError extends Error { 
    statusCode?: number
    msg?: string

    constructor(statusCode: number, msg: string) { 
        super();

        this.statusCode = statusCode
        this.msg = msg;
    }
}

export default (err: CustomError, req: Request, res: Response, next: NextFunction) => { 
    if (!err.statusCode || err.statusCode == 500) console.log(err)
    
    res.status(err.statusCode ?? 500).json(
        new HttpReponse([err.msg ?? "Lỗi server"], false)
    )
}