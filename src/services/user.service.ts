import { SelectQueryTemplate } from "../db/queryHelper";
import User from "../models/user";
import MyService from "./MyService";
import { CustomError } from "../middleware/errorHandler";

export default class UserService extends MyService<User>{
    protected genTableName(): string {
        return 'NguoiDung'
    }
    protected genFields(): string[] {
        return ['ID', 'HoTen', 'NgaySinh', 'GioiTinh', 'NgayTao', 'AnhDaiDien', 'LastNotifyTime' ,'IDTaiKhoan']
    }
    protected genKeys(): string[] {
        return ['ID']
    }
    protected genAutoInc(): boolean {
        return true;
    }
    async validateData(item: User): Promise<CustomError | undefined> {
        
        return undefined
    }
    async validateKey(item: User): Promise<CustomError | undefined> {
        return undefined
    } 

    async findUserByAcc(idAcc: number): Promise<User> { 
        var query = new SelectQueryTemplate({
            table: this.tableName,
            fields: this.fields,
            params: [['IDTaiKhoan', idAcc]],
            autoParams: true
        })
        var user = (await query.executeQuery()).data[0];
        return user;
    }

}