import NotifService from "../services/notif.service"
import { ICelebrity, IObserver } from "./artist"

export default class User implements IObserver {
    ID?: number
    HoTen?: string
    NgaySinh?: Date
    GioiTinh?: boolean
    NgayTao?: Date
    AnhDaiDien?: string
    LastNotifyTime?: Date

    IDTaiKhoan?: number

    update(obj: ICelebrity): void {
        var notify = new NotifService()
        notify.add({IDBaiHat: obj.getNewSong()!.ID!, IDNguoiDung: this.ID!, DaXem: false})
    }
}