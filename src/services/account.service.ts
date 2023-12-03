import Account from "../models/account";
import MyService from "./MyService";
import { CustomError } from "../middleware/errorHandler";
import { isInt } from "../utils/validation";
import AccountTypeService from "./accountType.service";
import { SelectQueryTemplate } from "../db/queryHelper";
import { bcryptVerify } from "../utils/bcrypt";

enum Col { 
    table = 'TaiKhoan',
    ID = 'ID',
    Email = 'Email',
    Password = 'Password',
    MaLoai = 'MaLoai'
}

class AccountService extends MyService<Account> {
    protected genTableName(): string {
        return Col.table
    }
    protected genFields(): string[] {
        return [Col.ID, Col.Email, Col.Password, Col.MaLoai]
    }
    protected genKeys(): string[] {
        return [Col.ID]
    }
    protected genAutoInc(): boolean {
        return true
    }
    async validateData(item: Account): Promise<CustomError | undefined> {
        //check email unique
        //check email regex
        //check email + pass length

        if (item.MaLoai) { 
            var service = new AccountTypeService();
            var type = await service.findByID(item.MaLoai)
            if (!type) return new CustomError(404, 'Không tìm thấy mã loại')
        }

        return undefined
    }
    async validateKey(item: Account): Promise<CustomError | undefined> {
        if (!isInt(item.ID)) return new CustomError(400, 'ID phải là số tự nhiên')

        return undefined
    } 

    //===========================================
    async login(item: Account): Promise<Account | undefined> { 
        const query = new SelectQueryTemplate({
            table: this.tableName,
            fields: this.fields,
            params: [[Col.Email, item.Email]],
            autoParams: true
        })
        const acc: Account = (await query.executeQuery()).data[0];

        if (!acc) return undefined
        const flag = await bcryptVerify(item.Password, acc.Password);
        if (!flag) return undefined

        return acc;
    }

}

export default AccountService