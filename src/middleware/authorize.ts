import { RequestHandler } from "express"
import { CustomError } from "./errorHandler";
import { jwtVerify } from "../utils/jwt";

const authorize = (roles: string[]) => { 

    const ret: RequestHandler = (req, res, next) => { 
        const token = req.cookies.token;

        if (!token) throw new CustomError(401, 'Chưa đăng nhập');
        const user = jwtVerify(token);
        if (!roles.includes(user.role)) throw new CustomError(403, 'Không có quyền truy cập')

        res.locals.userID = user.ID 
        
        next();
    }

    return ret;
}

export default authorize

export const authorizeUser = () => authorize([])