import GeneralObject from "../utils/GeneralObject";
import MyService from "../services/MyService";
import HttpResponse from "../types/HttpReponse";
import { Request, Response } from "express";
import { CustomError } from "../middleware/errorHandler";

type EmptyActionResult = Promise<void>

interface ICrudController { 
    list(req: Request, res: Response): EmptyActionResult,
    add(req: Request, res: Response): EmptyActionResult,
    update(req: Request, res: Response): EmptyActionResult,
    remove(req: Request, res: Response): EmptyActionResult,
    find(req: Request, res: Response): EmptyActionResult
}

//use for single primary key only
class CrudController<T extends GeneralObject> implements ICrudController{
    service: MyService<T>

    constructor(service: MyService<T>) { 
        this.service = service
        
        this.list = this.list.bind(this);
        this.add = this.add.bind(this);
        this.update = this.update.bind(this);
        this.remove = this.remove.bind(this);
        this.find = this.find.bind(this);
    }
    
    async list(req: Request, res: Response) {
        res.json(new HttpResponse(await this.service.list()))
    }

    // add: RequestHandler<any, FlaggedResponse, T> = async (req, res) => { 
    //     const item: T = req.body;
    //     res.json(new FlaggedResponse(await this.service.add(item)))
    // }
    async add (req: Request, res: Response) { 
        const item: T = req.body;
        var id = await this.service.add(item)
        res.json(new HttpResponse([id]))
    }

    async update(req: Request, res: Response) {
        const { id } = req.params
        var item: T = req.body;
        item = { ...item, ID: id }

        res.json(new HttpResponse([], await this.service.update(item)))
    }

    async remove(req: Request, res: Response) {
        const { id } = req.params
        var item: T = {} as T;
        item = { ...item, ID: id }

        res.json(new HttpResponse([], await this.service.remove(item)))
    }

    async find(req: Request, res: Response) {
        const { id } = req.params
        var item: T = {} as T;
        item = { ...item, ID: id }

        const findItem = await this.service.find(item);
        res.json(new HttpResponse([findItem]))
    }

}

//validate before action
export default class CrudControllerProxy<T extends GeneralObject> implements ICrudController {
    obj: CrudController<T>

    constructor(service: MyService<T>) { 
        this.obj = new CrudController<T>(service)

        this.list = this.list.bind(this);
        this.add = this.add.bind(this);
        this.update = this.update.bind(this);
        this.remove = this.remove.bind(this);
        this.find = this.find.bind(this);
    }

    async list(req: Request, res: Response) {
        this.obj.list(req, res);
    }
    async add(req: Request, res: Response) {
        const item: T = req.body;
        var err = await this.obj.service.validateData(item);
        if (err) throw err

        this.obj.add(req, res)
    }
    async update(req: Request, res: Response) {
        const { id } = req.params
        var item: T = req.body;
        var key = { ...item, ID: id }

        var err = await this.obj.service.validateKey(key);
        if (err) throw err

        const findItem = await this.obj.service.find(key);
        if (!findItem) throw new CustomError(404, 'Not found')

        err = await this.obj.service.validateData({ ...findItem, ...item });
        if (err) throw err

        this.obj.update(req, res)
    }
    async remove(req: Request, res: Response) {
        const { id } = req.params
        var item: T = req.body;
        var key = { ...item, ID: id }
        var err = await this.obj.service.validateKey(key);
        if (err) throw err

        const findItem = await this.obj.service.find(key);
        if (!findItem) throw new CustomError(404, 'Not found')

        this.obj.remove(req, res)
    }
    async find(req: Request, res: Response) {
        const { id } = req.params
        var item: T = req.body;
        var key = { ...item, ID: id }
        var err = await this.obj.service.validateKey(key);
        if (err) throw err

        const findItem = await this.obj.service.find(key);
        if (!findItem) throw new CustomError(404, 'Not found')

        this.obj.find(req, res)
    } 

}