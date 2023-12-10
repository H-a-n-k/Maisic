import CrudControllerProxy from "./CrudController";
import History from '../models/history'
import HistoryService from "../services/history.service";

class HistoryController extends CrudControllerProxy<History>{ 

}

const service = new HistoryService();
const historyController = new HistoryController(service)
export default historyController