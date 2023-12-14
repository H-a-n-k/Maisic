import HttpRespose from "types/HttpReponse"
import { CustomError } from "../middleware/errorHandler"
import { AsyncQuery, QueryParams } from "./connectDB"

interface IQuery { 
    table: string
    fields?: string[]
    condition?: string
    params?: QueryParams
    autoParams?: boolean
}

//Template
export abstract class QueryTemplate implements IQuery {
    
    table: string
    fields?: string[]
    condition?: string
    params?: QueryParams
    autoParams?: boolean

    constructor(p: IQuery) {
        this.table = p.table
        this.fields = p.fields ?? ['*']
        this.condition = p.condition 
        this.params = p.params?.filter(x => x[1] !== undefined)
        this.autoParams = p.autoParams
    }
    
    protected abstract chooseTarget(): string
    protected abstract buildBody(): string

    private setConditions(): string { 
        if (!this.condition) return '';
        return 'WHERE ' + this.condition;
    }

    private chainParamsToCondition() { 
        if (!this.params) return;

        var condition = this.params?.map(x => `${x[0]} = @${x[0]}`).join(' AND ')
        if (this.condition) condition = `(${this.condition}) AND (${condition})`
        this.condition = condition;
    }

    createQuery(): string { 
        var res = '';
        res += this.chooseTarget() + ' ';
        res += this.buildBody() + ' ';
        if(this.autoParams) this.chainParamsToCondition()
        res += this.setConditions() + ' ';

        return res;
    }

    executeQuery(): Promise<HttpRespose> { 
        var query = this.createQuery();
        const data = AsyncQuery(query, this.params ?? [])
        return data
    }
}


//select
export enum JoinType { 
    Inner = '',
    Left = 'LEFT',
    Right = 'RIGHT',
    Full = 'FULL OUTER'
}

export interface JoinTable { 
    fromTb?: string,
    fromKey: string,
    toTb: string,
    toTbAlias?: string,
    toKey?: string,
    type?: JoinType
}
export type OrderBy = {
    column: string,
    desc?: boolean 
}

export type ISelectQuery = IQuery & {
    joinTables?: JoinTable[]
    groups?: string[]
    having?: string
    orderBys?: OrderBy[]
}

export class SelectQueryTemplate
    extends QueryTemplate implements ISelectQuery {

    //extras fields for select query
    joinTables?: JoinTable[]
    groups?: string[]
    having?: string
    orderBys?: OrderBy[]

    constructor(p: ISelectQuery) {
        super(p)
        this.joinTables = p.joinTables
        this.groups = p.groups
        this.having = p.having
        this.orderBys = p.orderBys
    }

    //public setters
    join(newTable: JoinTable) {
        if (!this.joinTables) this.joinTables = []
        this.joinTables.push(newTable)

        return this
    }
    group(newGroup: string) { 
        if (!this.groups) this.groups = []
        this.groups.push(newGroup)

        return this
    }
    have(condition: string) { 
        this.having = condition
        return this
    }

    //private methods
    private chooseFields(): string {
        var res: string = 'SELECT ';
        res += this.fields!.join(', ')

        return res + ' '
    }
    private chooseTable(): string {
        var res = 'FROM ' + this.table

        return res + ' '
    }

    private setJoinTables(): string {
        var res: string = '';
        if(!this.joinTables?.length) return ''

        this.joinTables.forEach(x => { 

            res += `${x.type ?? ''} JOIN ${x.toTb} ${x.toTbAlias??''} ON `
                + `${x.fromTb ?? this.table}.${x.fromKey} = `
                + `${x.toTbAlias ?? x.toTb}.${x.toKey ?? 'id'} `;
            })

        return res 
    }

    private setGroup(): string { 
        if (!this.groups?.length) return '';

        var res = 'GROUP BY ' + this.groups.join(', ');
        if(this.having) res += ' HAVING ' + this.having

        return res + ' '
    }

    private setOrder(): string { 
        if (!this.orderBys?.length) return '';
        var res = 'ORDER BY ';
        res += this.orderBys.map(x => x.column + (x.desc ? ' desc' : '')).join(', ')

        return res
    }

    //implement QueryBuilder

    //SELECT f1, f2, f2 FROM table
    protected chooseTarget(): string {
        return this.chooseFields() + this.chooseTable() + this.setJoinTables()
    }
    //group by + having, order by
    protected buildBody(): string {
        return this.setGroup() + this.setOrder()
    }

}

//insert
export class InsertQueryTemplate extends QueryTemplate {

    protected chooseTarget(): string {
        var res = 'INSERT INTO ' + this.table
        return res;
    }
    protected buildBody(): string {

        var res = '(' + this.fields?.join(', ') + ') VALUES ('
            + this.fields?.map(x => '@' + x).join(', ') + ')';

        return res;
    }

}

//update
export class UpdateQueryTemplate extends QueryTemplate {

    protected chooseTarget(): string {
        var res = 'UPDATE ' + this.table
        return res;
    }
    protected buildBody(): string {
        var res = 'SET ';
        res += this.fields?.map(x => x + '=@' + x).join(', ')
        return res;
    }

}

//delete
export class DeleteQueryTemplate extends QueryTemplate {

    protected chooseTarget(): string {
        
        return 'DELETE FROM ' + this.table
    }
    protected buildBody(): string {
        return ''
    }
}

export enum QueryType {
    Select, Insert, Update, Delete
}

export default class QueryFactory { 

    static GetQueryObj(type: QueryType, query: IQuery): QueryTemplate {
        switch (type) {
            case QueryType.Select:
                return new SelectQueryTemplate(query)
            case QueryType.Insert:
                return new InsertQueryTemplate(query)
            case QueryType.Update:
                return new UpdateQueryTemplate(query)
            case QueryType.Delete:
                return new DeleteQueryTemplate(query)
            default:
                throw new CustomError(500, 'Query type unsupported');
        }
    }
}

//utils
// export const getFieldsFromParams = (params: QueryParams): string[] => { 
//     return params.filter(x => (x.length > 1 && x[1] !== undefined)).map(x => x[0])
// }