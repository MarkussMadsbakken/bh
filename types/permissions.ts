
export enum permission {
    editevents = "editnextbrygg",
    createfine = "createfine",
    viewfines = "viewfines",
    viewquotes = "viewquotes",
    createquote = "createquote",
    editallquotes = "editallquotes",
    addreaction = "addreaction",

}

export type Role = {
    permissions: permission[];
    shortname: string;
}

export const roles = {
    LEADER:
        {
            permissions: [
                permission.editevents,
                permission.createfine,
                permission.viewfines,
                permission.viewquotes,
                permission.createquote,
                permission.editallquotes,
                permission.addreaction
            ],
            shortname: "Leder"
        } as Role,
    ADMIN:
        {
            permissions: [
                permission.editevents,
                permission.createfine,
                permission.viewfines,
                permission.viewquotes,
                permission.createquote,
                permission.editallquotes,
                permission.addreaction,
            ],
            shortname: "Admin"
        } as Role,
    MEMBER:
        {
            permissions: [
                permission.createfine,
                permission.viewfines,
                permission.viewquotes,
                permission.createquote,
                permission.addreaction
            ],
            shortname: "Medlem"
        } as Role,
    GUEST:
        {
            permissions: [
                permission.viewquotes,
            ],
            shortname: "Gjest"
        } as Role
}