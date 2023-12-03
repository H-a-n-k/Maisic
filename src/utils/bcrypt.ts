
import bcrypt from 'bcrypt'

export const bcryptHash = async (str: string) => { 
    return await bcrypt.hash(str, 8);
}

export const bcryptVerify = async (str: string, hashed: string) => { 
    return await bcrypt.compare(str, hashed)
}