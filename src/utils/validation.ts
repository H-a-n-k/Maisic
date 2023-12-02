

export function isInt(str: any): boolean { 
    str = String(str);
    var n = Math.floor(Number(str));
    return n !== Infinity && String(n) === str && n >= 0;
}
