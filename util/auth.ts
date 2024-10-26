import { roles } from "@/types/permissions";
import { PrismaClient } from "@prisma/client";
import NextAuth, { User } from "next-auth"
import Credentials from "next-auth/providers/credentials"

const prisma = new PrismaClient();

async function createUser(username: string, token: string) {
    let role: "ADMIN" | "MEMBER" | "GUEST" | "LEADER" = "GUEST";

    // Get user memberships
    const tihldeMemberships = await fetch(`https://api.tihlde.org/users/${username}/memberships/`, {
        headers: {
            "X-Csrf-Token": token,
        }
    }).then(res => res.json());

    // Get user memberships
    const tihldeuser = await fetch(`https://api.tihlde.org/users/${username}/`, {
        headers: {
            "X-Csrf-Token": token,
        }
    }).then(res => res.json());

    // Check if member of bh
    tihldeMemberships.results.forEach(element => {
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
        }
    })
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

            role = user?.role ? roles[user.role as "ADMIN" | "MEMBER" | "GUEST" | "LEADER"] : roles.GUEST;

            return {
                name: credentials.username,
                token: data.token,
                role: role
            } as User
        }
    })],

    callbacks: {
        async jwt({ token, user }) {

            if (user) {
                token.token = user.token;
                token.role = user.role;
            }

            // maybe stupid but lets double check role with db
            const name = token.name || user.name

            if (name) {
                const u = await prisma.user.findFirst({
                    where:
                    {
                        username: name
                    }
                })

                if (u) {
                    token.role = u?.role ? roles[u.role as "ADMIN" | "MEMBER" | "GUEST" | "LEADER"] : roles.GUEST;
                }
            }

            return token;
        },

        session({ session, token }) {

            session.user.token = token.token;
            session.user.role = token.role;
            return session;
        }
    },

    pages: {
    }
})