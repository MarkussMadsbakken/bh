import { User } from "@prisma/client";

export type TihldeUser = {
    user_id: string;
    first_name: string;
    last_name: string;
    image: string;
    gender: number;
    email: string;
}


export function convertFromTihlde(tihldeuser: TihldeUser): User {
    return {
        username: tihldeuser.user_id,
    }
}