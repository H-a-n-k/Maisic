import AccountService from "../services/account.service";
import Account from "../models/account";
import CrudControllerProxy from "./CrudController";
import AccountTypeService from "../services/accountType.service";
import { RequestHandler } from "express";

class AccountController extends CrudControllerProxy<Account> { 
    typeService = new AccountTypeService();

    getTypes: RequestHandler = async (req, res) => { 
        res.json(await this.typeService.list())
    }
}

const service = new AccountService()
const accountController = new AccountController(service)

export default accountController