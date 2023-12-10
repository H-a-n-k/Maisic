import Album from "../models/album";
import MyService from "./MyService";
import { CustomError } from "middleware/errorHandler";

export default class AlbumService extends MyService<Album>{
    protected genTableName(): string {
        return 'Album'
    }
    protected genFields(): string[] {
        return ['ID', 'TenAlbum', 'SanXuat', 'MoTa', 'NgayPH', 'BiaAlbum']
    }
    protected genKeys(): string[] {
        return ['ID']
    }
    protected genAutoInc(): boolean {
        return true;
    }
    async validateData(item: Album): Promise<CustomError | undefined> {
        
        return undefined
    }
    async validateKey(item: Album): Promise<CustomError | undefined> {
        
        return undefined
    } 

}