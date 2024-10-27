import { permission } from "@/types/permissions";
import { auth } from "@/util/auth";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export const GET = auth(async function GET(req, ctx) {
    if (!req.auth) {
        return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    if (!req.auth.user.role.permissions.includes(permission.viewquotes)) {
        return NextResponse.json({ message: "Unsufficient permissions" }, { status: 401 })
    }

    const params = await ctx.params;

    if (!params?.userid) {
        return NextResponse.json({ error: "No userid provided" }, { status: 400 });
    }

    const quotes = await prisma.quote.findMany({
        where: {
            authorId: params.userid as string
        }
    })

    return NextResponse.json(quotes)
});

export async function POST(req, ctx) {
    return NextResponse.json({ error: "Invalid method" }, { status: 405 });
}