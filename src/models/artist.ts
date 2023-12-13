import IClonable from "types/IClonable"
import Song from "./song"

export interface IObserver { 
    update(obj: ICelebrity): void
}

export interface ICelebrity { 
    register(obj: IObserver): void
    unregister(obj: IObserver): void
    notify(): void
    getNewSong(): Song | null
    setNewSong(song: Song): void

    observers: IObserver[]
    newSong?: Song
}

export default class Artist implements ICelebrity {
    ID?: number
    HoTen?: string
    NgaySinh?: Date
    GioiTinh?: number
    NgayTao?: Date
    AnhDaiDien?: string
    TieuSu?: string
    IDTaiKhoan?: number

    observers: IObserver[] = []
    newSong?: Song

    getNewSong(): Song | null {
        return this.newSong ?? null
    }
    setNewSong(song: Song): void {
        this.newSong = song
        this.notify()
    }
    register(obj: IObserver): void {
        this.observers.push(obj)
    }
    unregister(obj: IObserver): void {
        this.observers = this.observers.filter(x => x != obj)
    }
    notify(): void {
        this.observers.forEach(x => x.update(this))
    }
}

export class ArtistPrototype extends Artist implements IClonable<ArtistPrototype>{ 
    clone(): ArtistPrototype {
        return { ...this }
    }
    copy(item: Artist): void {
        throw new Error("Method not implemented.")
    }
}