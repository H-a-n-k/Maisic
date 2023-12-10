import { RequestHandler } from "express"
import { CustomError } from "./errorHandler";
import { jwtVerify } from "../utils/jwt";

const authorize = (roles: string[]) => { 

    const ret: RequestHandler = (req, res, next) => { 
        const token = req.cookies.token;

        if (!token) throw new CustomError(401, 'Chưa đăng nhập');
        const acc = jwtVerify(token);
        if (!roles.includes(acc.role)) throw new CustomError(403, 'Không có quyền truy cập')

        res.locals.accID = acc.ID
        
        next();
    }

    return ret;
}

export default authorize

export enum Role {
    admin = 'admin',
    user = 'nguoidung',
    artist = 'nghesi'
}