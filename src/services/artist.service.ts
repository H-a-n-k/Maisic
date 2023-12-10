import { CustomError } from "middleware/errorHandler";
import Artist from "../models/artist";
import MyService from "./MyService";

export default class ArtistService extends MyService<Artist>{
    protected genTableName(): string {
        return 'NgheSi'
    }
    protected genFields(): string[] {
        return ['ID', 'HoTen', 'NgaySinh', 'GioiTinh', 'NgayTao', 'AnhDaiDien', 'TieuSu', 'IDTaiKhoan']
    }
    protected genKeys(): string[] {
        return ['ID']
    }
    protected genAutoInc(): boolean {
        return true;
    }
    async validateData(item: Artist): Promise<CustomError | undefined> {
        return undefined
    }
    async validateKey(item: Artist): Promise<CustomError | undefined> {
        return undefined
    } 

}