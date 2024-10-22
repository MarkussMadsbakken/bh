
export enum permission {
    editnextbrygg = "editnextbrygg",
    bot = "bot",
    editallbot = "editallbot",
}

export type Role = {
    permissions: permission[]
}

export const roles = {
    tihldeLeader:
        {
            permissions: [
                permission.editnextbrygg,
                permission.bot,
                permission.editallbot
            ]
        } as Role,
    admin:
        {
            permissions: [
                permission.editnextbrygg,
                permission.bot,
                permission.editallbot
            ]
        } as Role,
    member:
        {
            permissions: [
                permission.bot
            ]
        } as Role,
    guest:
        {
            permissions: []
        } as Role
}