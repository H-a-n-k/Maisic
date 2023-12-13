import IClonable from "types/IClonable"
import { compareDate, compareName, compareView } from "../utils/compare"

export default class Song {
    ID?: number
    TenBH?: string
    LoiNhac?: string
    LuotNghe?: number
    LuotTai?: number
    NgayPH?: Date
    AnhBia?: string
    MusicAPIPath?: string
    
    IDNgonNgu?: number
    IDAlbum?: number
    IDTheLoai?: number
    IDNgheSi?: number
}

export class SongPrototype extends Song implements IClonable<SongPrototype> {

    clone(): SongPrototype {
        var song = new SongPrototype();
        var ret = { ...this }
        ret.clone = song.clone;
        ret.copy = song.copy
        return ret
    }
    copy(item: SongPrototype): void {
        throw new Error("Method not implemented.")
    }
}

export abstract class AbstractSongList { 
    abstract getList(): Song[]
}

export class SongList extends AbstractSongList {

    list: Song[]

    constructor(list: Song[]) { 
        super()

        this.list = list;
    }

    getList(): Song[] {
        return this.list;
    } 
}

abstract class SongListDecorator extends AbstractSongList { 
    songList: AbstractSongList

    constructor(songList: AbstractSongList) { 
        super();
        this.songList = songList
    }

    getList(): Song[] {
        return this.songList.getList()
    }
}

export class SongListKeywordDecorator extends SongListDecorator { 
    keyword: string

    constructor(songList: AbstractSongList, keyword: string) { 
        super(songList)
        this.keyword = keyword
    }

    getList(): Song[] {
        var list = this.songList.getList();
        list = list.filter(x => x.TenBH?.toLowerCase().includes(this.keyword.toLowerCase()))

        return list
    }
}

export class SongListCategoryDecorator extends SongListDecorator { 
    categoryID: number
    
    constructor(songList: AbstractSongList, categoryID: number) {
        super(songList)
        this.categoryID = categoryID
    }

    getList(): Song[] {
        var list = this.songList.getList();
        list = list.filter(x => x.IDTheLoai == this.categoryID)

        return list
    }
}

export enum OrderSong { 
    Name = 'name', View = 'view', Date = "date"
}

export class SongListSortDecorator extends SongListDecorator { 

    static readonly OrderSong = OrderSong
    orderCol: OrderSong
    asc: boolean

    constructor(songList: AbstractSongList, orderCol: OrderSong, asc: boolean = false) { 
        super(songList)

        this.orderCol = orderCol
        this.asc = asc
    }

    getList(): Song[] {
        var list = this.songList.getList();
        switch (this.orderCol) { 
            case OrderSong.Name:
                list.sort(compareName)
                break;
            case OrderSong.View:
                list.sort(compareView)
                break;
            case OrderSong.Date:
                list.sort(compareDate)
            default: break;
        }

        if(!this.asc) return list.reverse()

        return list;
    }
}

export class SongListLimitDecorator extends SongListDecorator {
    limit: number

    constructor(songList: AbstractSongList, limit: number) {
        super(songList)
        this.limit = limit
    }

    getList(): Song[] {
        var list = this.songList.getList();
        list = list.splice(0, this.limit)

        return list
    }
}