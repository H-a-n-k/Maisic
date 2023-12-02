import Category, { CompositeCategory } from "../models/category";
import CateService from "../services/category.service";
import { NextFunction, Request, RequestHandler, Response } from "express";
import HttpResponse from "../types/HttpReponse";
import CrudControllerProxy from "./CrudController";


const service = new CateService();
class CategoryController extends CrudControllerProxy<Category>{

    getNestedList: RequestHandler<any, HttpResponse> = async (req, res) => { 
        const data = await service.getNestedList();

        res.json(new HttpResponse(data))
    }

    getOptSuper: RequestHandler<{ id: number }, HttpResponse> = async (req, res) => {
        const {id} = req.params
        const data = await service.getOptSuper({ ID: id });

        res.json(new HttpResponse(data))
    }
}

const categoryController = new CategoryController(service)


export default categoryController


