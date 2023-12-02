import MyService from './MyService';
import Category, { CompositeCategory } from '../models/category';
import { isInt } from '../utils/validation';
import { CustomError } from '../middleware/errorHandler';
import { SelectQueryTemplate } from '../db/queryHelper';

enum Col { 
    Table = 'TheLoai',
    ID = 'ID',
    TenTheLoai = 'TenTheLoai',
    MoTa = 'MoTa',
    superID = 'superID'
}

export default class CateService extends MyService<Category>{

    protected genTableName(): string {
        return Col.Table
    }
    protected genFields(): string[] {
        return [Col.ID, Col.TenTheLoai, Col.MoTa, Col.superID]
    }
    protected genKeys(): string[] {
        return ['ID']
    }
    protected genAutoInc(): boolean {
        return true
    } 

    async list(): Promise<Category[]> {
        return await CateSingleton.getInstance();
    }
    async add(item: Category): Promise<boolean> {
        var flag = await super.add(item);
        await CateSingleton.updateInstance();
        return flag;
    }
    async update(item: Category): Promise<boolean> {
        var flag = await super.update(item);
        await CateSingleton.updateInstance();
        return flag;
    }
    async remove(item: Category): Promise<boolean> {
        var flag = await super.remove(item);
        await CateSingleton.updateInstance();
        return flag;
    }
    async find(item: Category): Promise<Category> {
        var list = await this.list();
        return list.filter(x => x.ID == item.ID)[0]
    }

    async validateData(item: Category): Promise<CustomError | undefined> {
        if (!item.TenTheLoai) return new CustomError(400, 'Tên thể loại không được để trống')

        const query = new SelectQueryTemplate({
            table: this.tableName,
            fields: [Col.ID],
            params: [[Col.TenTheLoai, item.TenTheLoai]],
            autoParams: true
        })
        //Lấy id những item cùng tên
        const duplicatedName = (await query.executeQuery()).data;
        //không tính item hiện tại
        const count = duplicatedName.filter(x => x.ID !== item.ID).length;
        if(count) throw new CustomError(400, 'Tên thể loại bị trùng')

        if (item.superID) { 
            var findSuperCate = this.find({ ID: item.superID })
            if (!findSuperCate) return new CustomError(404, 'Không tìm thấy thể loại cha')   

            var opts = await this.getOptSuper(item);
            if(!opts.find(x => x.ID == item.superID)) return new CustomError(400, 'Thể loại cha không hợp lệ')
        }
        
        return undefined
    }
    async validateKey(item: Category): Promise<CustomError | undefined> {
        if (!isInt(item.ID)) return new CustomError(400, 'ID phải là số tự nhiên')
        
        return undefined
    }

    async getNestedList(): Promise<CompositeCategory[]> {
   
        var list = await this.list();
        var cates = CompositeCategory.convertList(list);

        const result = cates.filter(x => !x.superID) 
        result.forEach(x => x.setSubList(cates))

        return result;
    }

    //return categories that is not a child node of current node
    async getOptSuper(cate: Category): Promise<Category[]> { 
        const findChildren = (curr: Category) => {
            var subs = list.filter(x => x.superID == curr.ID);
            
            subs.forEach(x => {
                children.push(x);
                findChildren(x);
            })
        }

        var list = await this.list();
        var children: Category[] = []
        findChildren(cate);

        var res = list.filter(x => !children.find(y => y.ID === x.ID))
        res = res.filter(x => x.ID !== cate.ID)

        return res;
    }

}

//singleton class
class CateSingleton {
    static Instance: Category[]

    static async updateInstance() {
        var query = new SelectQueryTemplate({
            table: Col.Table
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