import NextAuth, { DefaultSession } from "next-auth"
import { Role } from "./permissions"

declare module "next-auth" {

    export interface Session {
        user: User
    }

    export interface User {
        name: string
        token: string
        role: Role
        firstname: string
    }
}