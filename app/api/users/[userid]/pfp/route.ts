import { auth } from "@/util/auth";
import { NextResponse } from "next/server";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const GET = auth(async function GET(req, ctx) {
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

