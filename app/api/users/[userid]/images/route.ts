import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req, ctx) {
    return NextResponse.json({ error: "Invalid method" }, { status: 405 });
}

export async function GET(req, ctx) {
    const params = await ctx.params;
    const res = await prisma.userImage.findMany({
        where: {
            userId: params.userid
        },
        select: {
            image: true
        }
    });

    return NextResponse.json(res.map((x) => x.image));
}