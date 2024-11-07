import { roles } from "@/types/permissions";
import { PrismaClient, Role } from "@prisma/client";
import NextAuth, { User } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { TihldeUser } from "./tihldeTypes";

const prisma = new PrismaClient();

async function createUser(username: string, token: string) {
    let role: "ADMIN" | "MEMBER" | "GUEST" | "LEADER" = "GUEST";

    // Get user memberships
    const tihldeMemberships = await fetch(`https://api.tihlde.org/users/${username}/memberships/`, {
        headers: {
            "X-Csrf-Token": token,
        }
    }).then(res => res.json());

    // Get user
    const tihldeuser: TihldeUser = await fetch(`https://api.tihlde.org/users/${username}/`, {
        headers: {
            "X-Csrf-Token": token,
        }
    }).then(res => res.json());

    // Check if member of bh
    tihldeMemberships.results.forEach((element: any) => {
        if (element.group.slug === "tihldebh") {
            if (element.memberships_type === "LEADER") {
                role = "LEADER"
            } else {
                role = "MEMBER"
            }
        }
    });

    const a = await prisma.user.create({
        data: {
            username: username,
            role: role,
            image: tihldeuser.image,
            firstname: tihldeuser.first_name,
        }
    })

    return a;
}

async function updateUser(username: string, token: string) {

    // Get user memberships
    const tihldeMemberships = await fetch(`https://api.tihlde.org/users/${username}/memberships/`, {
        headers: {
            "X-Csrf-Token": token,
        }
    }).then(res => res.json());

    // Get user
    const tihldeuser: TihldeUser = await fetch(`https://api.tihlde.org/users/${username}/`, {
        headers: {
            "X-Csrf-Token": token,
        }
    }).then(res => res.json());

    let role: Role = Role.GUEST;

    // Check if member of bh
    tihldeMemberships.results.forEach((element: any) => {
        if (element.group.slug === "tihldebh") {
            if (element.memberships_type === "LEADER") {
                role = Role.LEADER;
            } else {
                role = Role.MEMBER;
            }
        }
    });

    // manually check if member of bh indeks
    // TODO: add this to database :=)

    if (username === "markumad" || username === "jacoble" || username === "nikoltan ") {
        role = Role.INDEKS;
    }

    const a = await prisma.user.update({
        where: {
            username: username
        },
        data: {
            role: role,
            image: tihldeuser.image,
            firstname: tihldeuser.first_name,
        }
    })

    return a;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [Credentials({
        credentials: {
            username: {},
            password: {}
        },
        authorize: async (credentials) => {

            if (!credentials.username || !credentials.password) {
                return null;
            }

            const res = await fetch("https://api.tihlde.org/auth/login/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user_id: credentials.username,
                    password: credentials.password,
                })
            })

            if (!res.ok) {
                return null;
            }

            const data = await res.json();

            if (!data.token) {
                return null;
            }

            let role = roles.GUEST;

            // Check if user preexists
            const user = await prisma.user.findFirst({
                where: {
                    username: credentials.username
                }
            });

            if (!user) {
                // create a new user
                await createUser(credentials.username as string, data.token);
            }

            const updatedUser = await updateUser(credentials.username as string, data.token);

            role = user?.role ? roles[updatedUser.role as "ADMIN" | "MEMBER" | "GUEST" | "LEADER"] : roles.GUEST;

            return {
                name: credentials.username,
                token: data.token,
                role: role,
                id: user?.id,
                firstname: user?.firstname
            } as User
        }
    })],

    callbacks: {
        async jwt({ token, user }) {

            if (user) {
                token.token = user.token;
                token.role = user.role;
                token.id = user.id;
                token.firstname = user.firstname;
            }

            // maybe stupid but lets double check role with db
            const name = token.name ?? user.name

            if (name) {
                const u = await updateUser(name, token.token as string);

                if (u) {
                    token.role = u?.role ? roles[u.role as "ADMIN" | "MEMBER" | "GUEST" | "LEADER" | "INDEKS"] : roles.GUEST;
                }
            }

            return token;
        },

        session({ session, token }) {
            session.user.id = token.id;
            session.user.token = token.token;
            session.user.role = token.role;
            session.user.firstname = token.firstname;
            return session;
        }
    },

    pages: {
    }
})