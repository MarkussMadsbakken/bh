
import { auth } from "@/util/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export const GET = auth(async function GET(req, ctx: { params?: Record<string, string | string[]> }) {
    if (!req.auth) {
        return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    const params = await ctx.params;

    // Get user memberships
    const user = await fetch(`https://api.tihlde.org/users/${params?.userid}/`,
        {
            headers: {
                "method": "GET",
                "X-Csrf-Token": req.auth.user.token
            }
        }
    )
        .then(res => res.json());

    return NextResponse.json(user.image);
})


export async function POST() {
    return NextResponse.json({ error: "Invalid method. Changing profile picture can only be done from https://tihlde.org" }, { status: 405 });
}

