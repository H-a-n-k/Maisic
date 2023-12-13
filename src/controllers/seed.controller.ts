import { Request, Response } from "express"
import CateService from "../services/category.service"
import { DeleteQueryTemplate } from "../db/queryHelper";
import Category, { CompositeCategory } from "../models/category";
import Artist, { ArtistPrototype } from "../models/artist";
import ArtistService from "../services/artist.service";
import LanguageService from "../services/language.service";
import Song, { SongPrototype } from "../models/song";
import { randomEl } from "../utils/random";
import { addDays } from "../utils/time";
import SongService from "../services/song.service";


class SeedController {

    async seed(req: Request, res: Response) {
        await deletes();

        var cates = await seedCate();
        var artists = await seedArtist();
        var lang = await langService.add({ TenNgonNgu: 'Tiếng Việt', mota: '' });
        await seedSong(cates, artists, lang);

        res.json('ok')
    }
}

const cateService = new CateService();
const artistService = new ArtistService();
const langService = new LanguageService();
const songService = new SongService();

const deletes = async () => {
    if (!await deleteTable('BaiHat')) return false
    if (!await deleteTable('TheLoai')) return false
    if (!await deleteTable('NgheSi')) return false
    if (!await deleteTable('NgonNgu')) return false

    return true
}

const deleteTable = async (table: string) => {

    const query = new DeleteQueryTemplate({
        table: table
    })
    var flag = (await query.executeQuery()).success
    return flag
}

const seedCate = async () => {
    var cate = new CompositeCategory();
    cate.TenTheLoai = 'Thể loại';
    cate.MoTa = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
    var cates: number[] = []
    var promises = [];
    for (var i = 1; i <= 10; i++) {
        let x = cate.clone();
        x.TenTheLoai += ' ' + i;
        promises.push(cateService.add(x).then(id => cates.push(id)));
    }

    await Promise.all(promises);
    return cates;
}

const seedArtist = async () => {
    var artist = new ArtistPrototype();
    artist.HoTen = 'Nguyễn Nghệ Sĩ'
    artist.GioiTinh = 0;
    artist.NgaySinh = new Date(2000, 1, 1);
    artist.TieuSu = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
    var artists: number[] = [];
    var promises = [];
    for (var i = 1; i <= 10; i++) {
        let x = artist.clone();
        x.HoTen += ' ' + i;
        promises.push(artistService.add(x).then(id => artists.push(id)));
    }

    await Promise.all(promises);
    return artists
}

const seedSong = async (cates: number[], artists: number[], lang: number) => {
    var promises = [];

    var song1 = new SongPrototype();
    song1.TenBH = 'Shape Of You';
    song1.AnhBia = 'img_1.jpg';
    song1.LoiNhac = 'text_1.txt';
    song1.MusicAPIPath = 'audio_1.mp3';
    song1.LuotNghe = 0;
    song1.LuotTai = 0;
    song1.NgayPH = new Date(2011, 1, 1);

    var song2 = song1.clone();
    song2.TenBH = 'Havana';
    song2.AnhBia = 'img_2.jpg';
    song2.LoiNhac = 'text_2.txt';
    song2.MusicAPIPath = 'audio_2.mp3';

    var song3 = song1.clone();
    song3.TenBH = 'Bad Guy';
    song3.AnhBia = 'img_3.jpg';
    song3.LoiNhac = 'text_3.txt';
    song3.MusicAPIPath = 'audio_3.mp3';

    var songs = [song1, song2, song3]
    for (var i = 0; i < songs.length; i++) {

        for (var j = 1; j <= 100; j++) {
            let song = songs[i].clone();
            song.TenBH += ' ' + j;
            song.IDTheLoai = randomEl(cates);
            song.IDNgheSi = randomEl(artists);
            song.IDNgonNgu = lang;
            song.NgayPH = addDays(song.NgayPH ?? new Date(), j * i);

            promises.push(songService.add(song));
        }
    }

    await Promise.all(promises);
}

const seedController = new SeedController

export default seedController