
function random(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default random

export const randomEl = (arr: any[]) => { 
    if (!arr.length) return undefined;
    var ind = random(0, arr.length - 1);
    return arr[ind];
}