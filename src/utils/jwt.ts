import jwt from "jsonwebtoken";
import UserInfo from "../types/userInfo";

const SECRET = 'theres_no_secret_between_us';

export const jwtGen = (user: UserInfo) => {
    return jwt.sign(user, SECRET);
}

export const jwtVerify = (token: string): UserInfo => {
    return jwt.verify(token, SECRET) as UserInfo;
 }

