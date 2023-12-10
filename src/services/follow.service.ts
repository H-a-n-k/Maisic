import { CustomError } from "../middleware/errorHandler";
import Follow from "../models/follow";
import MyService from "./MyService";
import { SelectQueryTemplate } from "../db/queryHelper";

export default class FollowService extends MyService<Follow>{
    protected genTableName(): string {
        return 'Follow'
    }
    protected genFields(): string[] {
        return ['IDNguoiDung', 'IDNgheSi']
    }
    protected genKeys(): string[] {
        return ['IDNguoiDung', 'IDNgheSi']
    }
    protected genAutoInc(): boolean {
        return false;
    }
    async validateData(item: Follow): Promise<CustomError | undefined> {
        return undefined
    }
    async validateKey(item: Follow): Promise<CustomError | undefined> {
        return undefined
    } 

    async findFollowByArtist(id: number): Promise<Follow[]> { 
        var query = new SelectQueryTemplate({
            table: this.tableName,
            fields: this.fields,
            params: [['IDNgheSi', id]],
            autoParams: true
        })
        var list: Follow[] = (await query.executeQuery()).data
        return list
    }

}