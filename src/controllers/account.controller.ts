import AccountService from "../services/account.service";
import Account from "../models/account";
import CrudControllerProxy from "./CrudController";
import AccountTypeService from "../services/accountType.service";
import { Request, RequestHandler, Response } from "express";
import { CustomError } from "../middleware/errorHandler";
import { bcryptHash } from "../utils/bcrypt";
import HttpRespose from "../types/HttpReponse";
import { jwtGen } from "../utils/jwt";
import UserInfo from "../types/userInfo";

class AccountController extends CrudControllerProxy<Account> { 
    typeService = new AccountTypeService();

    getTypes: RequestHandler = async (req, res) => { 
        res.json(await this.typeService.list())
    }

    async add(req: Request, res: Response): Promise<void> {
        const item: Account = req.body;

        if (!item.Password || item.Password.length < 6) {
            throw new CustomError(400, 'Mật khẩu phải trên 6 kí tự');
        }

        item.Password = await bcryptHash(item.Password);
        super.add(req, res)
    }

    login: RequestHandler = async (req, res) => {
        const item: Account = req.body;

        var acc: Account | undefined = await service.login(item);
        if (!acc) throw new CustomError(401, 'Sai thông tin đăng nhập');
        const role = await this.typeService.findByID(acc.MaLoai!);
        const user: UserInfo = { ID: acc.ID!, role: role.Code };
        const token = jwtGen(user);

        let options = {
            maxAge: 1000 * 60 * 60 * 24, // would expire after 24h
            httpOnly: true, // The cookie only accessible by the web server
            signed: false // Indicates if the cookie should be signed
        }
        
        res.cookie('token', token, options)

        res.json(new HttpRespose())
    }
}

const service = new AccountService()
const accountController = new AccountController(service)

export default accountController