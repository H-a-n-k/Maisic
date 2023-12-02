import { CustomError } from "middleware/errorHandler";
import Song from "../models/song";
import MyService from "./MyService";

export default class SongService extends MyService<Song> {
    protected genTableName(): string {
        return 'BaiHat'
    }
    protected genFields(): string[] {
        return ['ID', 'TenBH', 'LoiNhac', 'LuotTai', 'NgayPH', 'AnhBia', 'IDAlbum', 'MusicAPIPath', 'IDNgonNgu', 'IDTheLoai', 'IDNgheSi', 'LuotNghe']
    }
    protected genKeys(): string[] {
        return ['ID']
    }
    protected genAutoInc(): boolean {
        return true;
    }

    async validateData(item: Song): Promise<CustomError | undefined> {
        return undefined
    }
    async validateKey(item: Song): Promise<CustomError | undefined> {
        return undefined
    } 

}