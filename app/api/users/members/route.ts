import { auth } from "@/util/auth";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export const GET = auth(async function GET(req, ctx) {
    if (!req.auth) {
        return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    const members = await prisma.user.findMany({
        where: {
            NOT: {
                role: "GUEST"
            }
        },
        select: {
            username: true,
            firstname: true,
        }
    });

    return NextResponse.json(members);
})

export async function POST() {
    return NextResponse.json({ error: "Invalid method. Members can only be changed via tihlde.org" }, { status: 405 });
}