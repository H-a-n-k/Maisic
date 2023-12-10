import HttpRespose from "../types/HttpReponse";
import { CustomError } from "../middleware/errorHandler";

const sql = require("mssql/msnodesqlv8");

const config = {
    server: ".",
    database: "DaTaMusic",
    driver: "msnodesqlv8",
    options: {
        trustedConnection: true
    }
};

export type QueryParams = [string, string|number|null|undefined][]

export const AsyncQuery = async (query: string, params: QueryParams): Promise<HttpRespose> => {
    let conn = await sql.connect(config);
    let request = await conn.request();
    if (params && params.length > 0)
        params.forEach(x => {
            if(x[1] !== undefined) request.input(x[0], x[1])
        });

    //console.log('query', query, params);
    try {
        let result: MssqlRespose = await request.query(query);

        if (result.recordset) {
            return {
                success: true,
                data: result.recordset
            }
        } else {
            return {
                success: result.rowsAffected[0] > 0,
                data: []
            }
        }
        
    } catch (err) { 
        console.log('DB err: ', err)
        console.log('Qeury: ', query, params)
        throw new CustomError(500, 'DB Error');
    }
    
}

interface MssqlRespose {
    recordsets: [
        any[]
    ],
    recordset: any[],
    output: any,
    rowsAffected: number[]
}

// export const getData = (res: MssqlRespose): any[] => { 
//     return res.recordset
// }

// export const getFlag = (res: MssqlRespose): boolean => {
//     return res.rowsAffected[0] > 0
// }