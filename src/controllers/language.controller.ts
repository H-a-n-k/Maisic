import LanguageService from "../services/language.service";
import Language from "../models/language";
import CrudControllerProxy from "./CrudController";

const service = new LanguageService()
class LanguageController extends CrudControllerProxy<Language>{ 

}

const languageController = new LanguageController(service)
export default languageController