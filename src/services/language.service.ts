import { isInt } from "../utils/validation";
import Language from "../models/language";
import MyService from "./MyService";
import { CustomError } from "../middleware/errorHandler";

export default class LanguageService extends MyService<Language>{
   
    genTableName(): string {
        return 'NgonNgu'
    }
    genFields(): string[] {
        return ['ID', 'TenNgonNgu', 'MoTa']
    }
    genKeys(): string[] {
        return ['ID']
    } 
    genAutoInc(): boolean {
        return true
    }

    async validateData(item: Language): Promise<CustomError | undefined> {
        if (!item.TenNgonNgu) return new CustomError(400, 'Thiếu tên ngôn ngữ')

        return undefined
    }
    async validateKey(item: Language): Promise<CustomError | undefined> {
        if (!isInt(item.ID)) return new CustomError(400, 'ID phải là số nguyên')
        
        return undefined
    }
    
}