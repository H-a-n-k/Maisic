import Song from "../models/song";

export function compareName(a: Song, b: Song) {
    if (!a?.TenBH && !b?.TenBH) return 0;
    if (!a?.TenBH) return -1
    if(!b?.TenBH) return 1

    if (a.TenBH.toLowerCase() < b.TenBH.toLowerCase()) return -1;
    if (a.TenBH.toLowerCase() > b.TenBH.toLowerCase()) return 1;
    return 0;
}

function lim(x: number) { 
    return Math.max(Math.min(x, 1), -1)
}

export function compareView(a: Song, b: Song) {
    var x = a.LuotNghe ?? 0;
    var y = b.LuotNghe ?? 0;

    return lim(x - y);
}

export function compareDate(a: Song, b: Song) { 
    var x = a.NgayPH ? a.NgayPH.getTime() : 0
    var y = b.NgayPH ? b.NgayPH.getTime() : 0;

    return lim(x - y);
}