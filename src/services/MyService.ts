import GeneralObject from "../utils/GeneralObject"
import { AsyncQuery, QueryParams } from "../db/connectDB"
import QueryFactory, { DeleteQueryTemplate, InsertQueryTemplate, QueryType, SelectQueryTemplate, UpdateQueryTemplate } from "../db/queryHelper"
import { CustomError } from "../middleware/errorHandler"

interface ICrud<T> { 
    list(): Promise<T[]>
    add(item: T): Promise<number>,
    update(item: T): Promise<boolean>,
    remove(item: T): Promise<boolean>,
    find(item: T): Promise<T>,

    validateData(item: T): Promise<CustomError | undefined>,
    validateKey(item: T): Promise<CustomError | undefined>
}

// interface IService<T> extends ICrud<T> {
//     tableName: string
//     fields: string[]
//     keys: string[]
//     autoInc: boolean
// }

export default abstract class MyService<T extends GeneralObject> implements ICrud<T> {
    tableName: string
    fields: string[]
    keys: string[]
    autoInc: boolean

    constructor() { 
        this.tableName = this.genTableName()
        this.fields = this.genFields()
        this.keys = this.genKeys()
        this.autoInc = this.genAutoInc()
    }
    
    protected abstract genTableName(): string 
    protected abstract genFields(): string[]
    protected abstract genKeys(): string[]
    protected abstract genAutoInc(): boolean
    abstract validateData(item: T): Promise<CustomError | undefined>
    abstract validateKey(item: T): Promise<CustomError | undefined>

    async list(): Promise<T[]> {
        const query = QueryFactory.GetQueryObj(QueryType.Select, {
            table: this.tableName, fields: this.fields
        })

        const data = await query.executeQuery();
        return data.data;
    }
    async add(item: T): Promise<number> {

        var params = this.getQueryParams(item)
        var query = QueryFactory.GetQueryObj(QueryType.Insert, {
            table: this.tableName,
            fields: this.getFields(true, item),
            params: params
        }).createQuery();
        query += '; select SCOPE_IDENTITY() as id'

        const data = await AsyncQuery(query, params);
        return data.data[0]?.id || -1
    }
    async update(item: T): Promise<boolean> {
        const query = QueryFactory.GetQueryObj(QueryType.Update, {
            table: this.tableName,
            fields: this.getFields(false, item),
            condition: this.getConditions(),
            params: this.getQueryParams(item)
        })

        const data = await query.executeQuery();
        return data.success
    }
    async remove(item: T): Promise<boolean> {
        const query = QueryFactory.GetQueryObj(QueryType.Delete, {
            table: this.tableName, 
            params: this.getQueryParams(item),
            autoParams: true
        })

        const data = await query.executeQuery();
        return data.success
    }
    async find(item: T): Promise<T> {
        const query = QueryFactory.GetQueryObj(QueryType.Select, {
            table: this.tableName,
            fields: this.fields, 
            condition: this.getConditions(),
            params: this.getQueryParams(item)
        })
        
        const data = await query.executeQuery();
        return data.data[0]
    }

    //======
    private isKey(col: string): boolean { 
        return this.keys.includes(col);
    }
    private getQueryParams(item: T): QueryParams { 
        return this.fields.map(x => [x, item[x]])
    }
    private getConditions(): string { 
        return this.keys.map(x => `${x} = @${x}`).join(' AND ')
    }
    private getFields(allowKey: boolean, item: T): string[] { 
        //allow insert primary key only if key is not auto-increment
        var flag: boolean = allowKey && !this.autoInc

        //select non-key fields
        var res = this.fields.filter(x => flag || !this.isKey(x))
        //select only fields with values
        res = res.filter(x => item[x] !== undefined)
        return res; 
    }
}
