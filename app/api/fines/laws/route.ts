
import { permission } from "@/types/permissions";
import { auth } from "@/util/auth";
import { NextResponse } from "next/server";

export const GET = auth(async function GET(req, ctx) {
    if (!req.auth) {
        return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    if (!req.auth.user.role.permissions.includes(permission.viewfines)) {
        return NextResponse.json({ message: "Unsufficient permissions" }, { status: 401 })
    }


    const laws = await fetch(`https://api.tihlde.org/groups/tihldebh/laws/`,
        {
            headers: {
                "method": "GET",
                "X-Csrf-Token": req.auth.user.token
            }
        }
    )
        .then(res => res.json());

    return NextResponse.json(laws)
})


export async function POST() {
    return NextResponse.json({ error: "Invalid method. Changing laws can only be done from https://tihlde.org" }, { status: 405 });
}

