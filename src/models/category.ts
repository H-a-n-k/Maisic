import IClonable from "../types/IClonable";

export default class Category{ 
    ID?: number
    TenTheLoai?: string
    MoTa?: string
    
    superID?: number
}

export class CompositeCategory extends Category implements IClonable<CompositeCategory> {
    subCategories?: CompositeCategory[]

    static convertList(cates: Category[]): CompositeCategory[] {
        return cates.map(x => {
            var y = new CompositeCategory();
            y.copy(x);
            return y
        })
    }

    setSubList(cates: CompositeCategory[]) { 
        this.subCategories = cates.filter(x => x.superID == this.ID)
        this.subCategories.forEach(x => x.setSubList(cates))
    }

    clone(): CompositeCategory {
        return {...this}
    }
    copy(item: Category): void {
        this.ID = item.ID
        this.TenTheLoai = item.TenTheLoai
        this.MoTa = item.MoTa
        this.superID = item.superID
    }
}
