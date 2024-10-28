import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: any, ctx: { params: any; }) {
    const params = await ctx.params

    const user = await prisma.user.findUnique({
        where: {
            id: params.userid
        },
    });

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log(user);

    return NextResponse.json(user.image);
}

export async function POST() {
    return NextResponse.json({ error: "Invalid method. Members can only be changed via tihlde.org" }, { status: 405 });
}