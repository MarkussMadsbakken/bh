import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: any, ctx: { params: any; }) {
    const params = await ctx.params

    const image = await prisma.user.findUnique({
        where: {
            id: params.userid
        },
        select: {
            image: true
        }
    });

    return NextResponse.json(image)
}

export async function POST() {
    return NextResponse.json({ error: "Invalid method. Members can only be changed via tihlde.org" }, { status: 405 });
}