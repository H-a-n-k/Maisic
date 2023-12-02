import AccountType from "../models/accountType";
import { SelectQueryTemplate } from "../db/queryHelper";

const enum Cols{ 
    Table = 'LoaiTK',
    ID = 'ID',
    TenLoai = 'TenLoai',
    Code = 'Code',
    MoTa = 'MoTa'
}

class AccountTypeService {
    async list() { 
        return await AccountTypeSingleton.getInstance();
    }

    async findByID(ID: number): Promise<AccountType> {
        const list = await this.list()
        return list.filter(x => x.ID == ID)[0]
    }   

    async findByCode(code: string): Promise<AccountType> { 
        const list = await this.list()
        return list.filter(x => x.Code == code)[0]
    }   
}

class AccountTypeSingleton { 
    static Instance: AccountType[]

    static async updateInstance() {
        var query = new SelectQueryTemplate({
            table: Cols.Table
        })
        var data = await query.executeQuery();
        this.Instance = data.data;
    }

    static getInstance = async () => {
        if (!this.Instance) {
            await this.updateInstance()
        }

        return this.Instance
    }
}

export default AccountTypeService