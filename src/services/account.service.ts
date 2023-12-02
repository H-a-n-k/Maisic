import Account from "../models/account";
import MyService from "./MyService";
import { CustomError } from "../middleware/errorHandler";
import { isInt } from "../utils/validation";
import AccountTypeService from "./accountType.service";

class AccountService extends MyService<Account> {
    protected genTableName(): string {
        return 'TaiKhoan'
    }
    protected genFields(): string[] {
        return ['ID', 'Email', 'Password', 'MaLoai']
    }
    protected genKeys(): string[] {
        return ['ID']
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

}

export default AccountService