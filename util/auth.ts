import { Role, roles } from "@/types/permissions";
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [Credentials({
        credentials: {
            username: {},
            password: {}
        },
        authorize: async (credentials) => {
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

            // Get user memberships
            const tihldeMemberships = await fetch(`https://api.tihlde.org/users/${credentials.username}/memberships/`, {
                headers: {
                    "X-Csrf-Token": data.token,
                }
            }).then(res => res.json());

            let role = roles.guest;


            // Check if member of bh
            tihldeMemberships.results.forEach(element => {
                if (element.group.slug === "tihldebh") {
                    if (element.memberships_type === "LEADER") {
                        role = roles.tihldeLeader
                    } else {
                        role = roles.member
                    }
                }
            });

            // Check if admin (todo)

            return {
                name: credentials.username,
                token: data.token,
                role: role
            }
        }
    })],

    pages: {
    }
})