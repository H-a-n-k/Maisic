import { getDateStart } from "../utils/time";
import { CustomError } from "../middleware/errorHandler";
import Song, { AbstractSongList, OrderSong, SongList, SongListArtistDecorator, SongListCategoryDecorator, SongListKeywordDecorator, SongListLimitDecorator, SongListSortDecorator } from "../models/song";
import MyService from "./MyService";
import FollowService from "./follow.service";
import HistoryService from "./history.service";
import UserService from "./user.service";
import Artist from "../models/artist";
import User from "../models/user";
import { SelectQueryTemplate } from "../db/queryHelper";

enum Cols { 
    ID = 'ID', TenBH = 'TenBH', LoiNhac = 'LoiNhac', LuotTai = 'LuotTai',
    NgayPH = 'NgayPH', AnhBia = 'AnhBia', IDAlbum = 'IDAlbum', MusicAPIPath = 'MusicAPIPath',
    IDNgonNgu = 'IDNgonNgu', IDTheLoai = 'IDTheLoai', IDNgheSi = 'IDNgheSi', LuotNghe = 'LuotNghe'
}

export default class SongService extends MyService<Song> {
    protected genTableName(): string {
        return 'BaiHat'
    }
    protected genFields(): string[] {
        return [Cols.ID, Cols.TenBH, Cols.LoiNhac, Cols.LuotTai,
            Cols.NgayPH, Cols.AnhBia, Cols.IDAlbum, Cols.MusicAPIPath,
            Cols.IDNgonNgu, Cols.IDTheLoai, Cols.IDNgheSi, Cols.LuotNghe
        ]
    }
    protected genKeys(): string[] {
        return ['ID']
    }
    protected genAutoInc(): boolean {
        return true;
    }

    async validateData(item: Song): Promise<CustomError | undefined> {
        return undefined
    }
    async validateKey(item: Song): Promise<CustomError | undefined> {
        return undefined
    } 

    async findSong(keyword?: string, cateID?: number, artistID?: number , order?: OrderSong, asc: boolean = false, limit?: number): Promise<Song[]> { 
        var query = new SelectQueryTemplate({
            table: this.tableName,
            fields: [ this.tableName + '.' + Cols.ID, Cols.TenBH, Cols.AnhBia,
                Cols.NgayPH, Cols.LuotNghe, Cols.IDTheLoai, Cols.IDNgheSi, 'HoTen'],
            joinTables: [{ fromKey: Cols.IDNgheSi, toTb: 'NgheSi' }]
        })
        var list: Song[] = (await query.executeQuery()).data;

        var songList: AbstractSongList = new SongList(list)
        if (artistID) songList = new SongListArtistDecorator(songList, artistID)
        if (keyword) songList = new SongListKeywordDecorator(songList, keyword)
        if (cateID) songList = new SongListCategoryDecorator(songList, cateID)
        if (order) songList = new SongListSortDecorator(songList, order, asc)
        if(limit) songList = new SongListLimitDecorator(songList, limit)

        return songList.getList();
    }

    async addView(idSong: number, idAcc: number): Promise<boolean> { 
        var songFacade = new SongFacade();

        return await songFacade.addView(idSong, idAcc);
    }

    async add(item: Song): Promise<number> { 
        var newId = await super.add(item)
        if (newId < 0) return newId;
        item.ID = newId

        var songFacade = new SongFacade();
        if(item.IDNgheSi) songFacade.NotifyFollowers(item.IDNgheSi, item)

        return newId;
    }

    async find(item: Song): Promise<Song> {
        var fields = [...this.fields];
        fields[0] = 'BaiHat.ID';
        fields.push(...['TenTheLoai', 'HoTen', 'TenNgonNgu']);

        var query = new SelectQueryTemplate({
            table: this.tableName,
            joinTables: [
                { fromKey: Cols.IDTheLoai, toTb: 'TheLoai' },
                { fromKey: Cols.IDNgheSi, toTb: 'NgheSi' },
                { fromKey: Cols.IDNgonNgu, toTb: 'NgonNgu' }
            ],
            condition: 'BaiHat.ID = @id',
            fields: fields,
            params: [['id', item.ID]]
        });
        var song = (await query.executeQuery()).data[0];
        return song;
    }
}

class SongFacade { 
    songService: SongService
    historyService: HistoryService
    followService: FollowService
    userService: UserService

    constructor() { 
        this.songService = new SongService()
        this.historyService = new HistoryService()
        this.followService = new FollowService()
        this.userService = new UserService();
    }

    async addView(idSong: number, idAcc: number): Promise<boolean> { 
        var song = await this.songService.find({ ID: idSong });

        //tăng view trong bảng baihat
        if (!song) throw new CustomError(404, 'Không tìm thấy bài hát');
        if (!song.LuotNghe) song.LuotNghe = 0;
        song.LuotNghe++;
        var flag = await this.songService.update(song);
        if(!flag) throw new CustomError(500, 'Error updating view')
        
        var user = await this.userService.findUserByAcc(idAcc)

        //cập nhật lịch sử
        if (user) { 
            var date = getDateStart()
            var history = await this.historyService.find({ IDNguoiDung: user.ID, IDSong: idSong, NgayXem: date })
            console.log('find history', history, { IDNguoiDung: user.ID, IDSong: idSong, NgayXem: date })

            var historyUpdated = false;
            if (history) {
                if (!history.LuotXem) history.LuotXem = 0;
                history.LuotXem++;
                historyUpdated = await this.historyService.update(history)
            } else { 
                historyUpdated = await this.historyService.add({
                    IDNguoiDung: user.ID, IDSong: idSong, NgayXem: date, LuotXem: 1
                }) > 0
            }

            if(!historyUpdated) throw new CustomError(500, 'Error updating history')
        }
        
        return true
    }

    //add new -> add new song, get followers, add notif
    async NotifyFollowers(id: number, song: Song) {
        var artist = new Artist();
        artist.ID = id;

        var followers = await this.followService.findFollowByArtist(id);
        followers.forEach(x => { 
            var user = new User();
            user.ID = x.IDNguoiDung
            artist.register(user);
        })

        artist.setNewSong(song);
    }
}