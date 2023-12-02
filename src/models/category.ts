import IClonable from "../types/IClonable";

export default interface Category { 
    ID?: number,
    TenTheLoai?: string,
    MoTa?: string,
    
    superID?: number
}

export class CompositeCategory implements Category, IClonable<CompositeCategory> {
    ID?: number;
    TenTheLoai?: string;
    MoTa?: string;
    superID?: number; 

    subCategories?: CompositeCategory[]

    static convertList(cates: Category[]): CompositeCategory[] {
        return cates.map(x => {
            var y = new CompositeCategory();
            y.copy(x);
            return y
        })
    }

    clone(): CompositeCategory {
        var x: CompositeCategory = {...this}
        return x;
    }
    copy(item: Category): void {
        this.ID = item.ID
        this.TenTheLoai = item.TenTheLoai
        this.MoTa = item.MoTa
        this.superID = item.superID
    }

    setSubList(cates: CompositeCategory[]) { 
        this.subCategories = cates.filter(x => x.superID == this.ID)
        this.subCategories.forEach(x => x.setSubList(cates))
    }
}
