import { CustomError } from "middleware/errorHandler";
import Notif from "../models/notif";
import MyService from "./MyService";

export default class NotifService extends MyService<Notif>{
    protected genTableName(): string {
        return 'ThongBao'
    }
    protected genFields(): string[] {
        return ['IDNguoiDung', 'IDBaiHat', 'DaXem']
    }
    protected genKeys(): string[] {
        return ['IDNguoiDung', 'IDBaiHat']
    }
    protected genAutoInc(): boolean {
        return false;
    }
    async validateData(item: Notif): Promise<CustomError | undefined> {
        return undefined
    }
    async validateKey(item: Notif): Promise<CustomError | undefined> {
        return undefined
    } 

}