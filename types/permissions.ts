
export enum permission {
    editevents = "editnextbrygg",
    createfine = "createfine",
    viewfines = "viewfines",
    viewquotes = "viewquotes",
    createquote = "createquote",
    editallquotes = "editallquotes",
    addreaction = "addreaction",
    createPost = "creatPost",
    editAllPosts = "editAllPosts",
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
                permission.addreaction,
                permission.createPost,
                permission.editAllPosts,
            ],
            shortname: "Leder"
        } as Role,
    INDEKS:
        {
            permissions: [
                permission.editevents,
                permission.createfine,
                permission.viewfines,
                permission.viewquotes,
                permission.createquote,
                permission.editallquotes,
                permission.addreaction,
                permission.createPost,
                permission.editAllPosts
            ],
            shortname: "BH Indeks"
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
                permission.createPost,
                permission.editAllPosts
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