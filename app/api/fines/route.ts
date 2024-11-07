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

    return NextResponse.json(fines)
})


export const POST = auth(async function POST(req, ctx) {
    if (!req.auth) {
        return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    if (!req.auth.user.role.permissions.includes(permission.createfine)) {
        return NextResponse.json({ message: "Unsufficient permissions" }, { status: 401 })
    }

    const body: { user: string, law: string, reason: string, fineAmount: number, hasQuote: boolean, quote: number, image: string } = await req.json();
    console.log(body);

    if (!body.user) {
        return NextResponse.json({ message: "Ingen bruker valgt" }, { status: 400 })
    }

    if (!body.law) {
        return NextResponse.json({ message: "Ingen lov valgt" }, { status: 400 })
    }

    if (!body.fineAmount && body.fineAmount !== 0) {
        return NextResponse.json({ message: "Ikke valgt antall bøter" }, { status: 400 })
    }

    // create fine
    // TODO: implement this when file upload is ready
    /*
    const res = await fetch(`https://api.tihlde.org/groups/tihldebh/fines/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Csrf-Token": req.auth.user.token
        },
        body: JSON.stringify({
            user: body.user,
            law: body.law,
            reason: body.reason,
            fineAmount: body.fineAmount,
            hasQuote: body.hasQuote,
            quote: body.quote,
            image: body.image
        })
    });
    */

    return NextResponse.json({ message: "Not implemented" }, { status: 501 })
})

