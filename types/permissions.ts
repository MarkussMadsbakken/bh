
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
    createComment = "createComment",
    deleteAllComments = "deleteAllComments",
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
                permission.createComment,
                permission.deleteAllComments
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
                permission.editAllPosts,
                permission.createComment,
                permission.deleteAllComments
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
                permission.editAllPosts,
                permission.createComment,
                permission.deleteAllComments
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
                permission.addreaction,
                permission.createComment,
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