import { permission } from "@/types/permissions";
import { auth } from "@/util/auth";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

// TODO: this api route is currently not used.... remove?
export const GET = auth(async function GET(req, ctx) {
    if (!req.auth) {
        return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    if (!req.auth.user.role.permissions.includes(permission.viewfines)) {
        return NextResponse.json({ message: "Unsufficient permissions" }, { status: 401 })
    }


    // Get all fines
    const fines = await fetch(`https://api.tihlde.org/groups/tihldebh/fines/`,
        {
            headers: {
                "method": "GET",
                "X-Csrf-Token": req.auth.user.token
            }
        }
    )
        .then(res => res.json());

    console.log(fines);

    return NextResponse.json(fines)
})


export async function POST() {
    return NextResponse.json({ error: "Invalid method. Changing profile picture can only be done from https://tihlde.org" }, { status: 405 });
}

