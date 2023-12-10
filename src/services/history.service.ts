import { CustomError } from "middleware/errorHandler";
import MyService from "./MyService";
import History from '../models/history'

export default class HistoryService extends MyService<History>{
    protected genTableName(): string {
        return 'LichSu'
    }
    protected genFields(): string[] {
        return ['IDNguoiDung', 'IDSong', 'NgayXem', 'LuotXem']
    }
    protected genKeys(): string[] {
        return ['IDNguoiDung', 'IDSong', 'NgayXem']
    }
    protected genAutoInc(): boolean {
        return false;
    }
    async validateData(item: History): Promise<CustomError | undefined> {
        return undefined
    }
    async validateKey(item: History): Promise<CustomError | undefined> {
        return undefined
    } 

}