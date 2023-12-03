import path from "path";

export const dataDir = path.join(__dirname, '../data');

export enum MulterField { 
    fileMusic = 'fileMusic',
    fileText = 'fileText',
    fileImage = 'fileImage',
    file = 'file'
}

export enum Role {
    admin = 'admin',
    user = 'nguoidung',
    artist = 'nghesi'
}