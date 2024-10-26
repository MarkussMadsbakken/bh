import { permission } from "@/types/permissions";
import { auth } from "@/util/auth";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
    const quotes = await prisma.quote.findMany({
        include: {
            author: true,
            createdBy: true,
            reactions: {
                include: {
                    user: true
                }
            }
        }
    })
    return NextResponse.json(quotes);
}

export const POST = auth(async function POST(req, ctx) {
    if (!req.auth) {
        return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    if (!req.auth.user.role.permissions.includes(permission.createquote)) {
        return NextResponse.json({ message: "You do not have sufficient permissions" }, { status: 403 })
    }

    if (!req.auth.user.name) {
        return NextResponse.json({ message: "No user name found" }, { status: 400 })
    }

    const quote = await req.json();

    const res = await prisma.quote.create({
        data: {
            author: {
                connect: {
                    username: quote.author,
                }
            },
            createdBy: {
                connect: {
                    username: req.auth.user.name,
                }
            },
            quote: quote.quote,
            context: quote.context,
        }
    })

    console.log(res);

    return NextResponse.json({ message: "Not implemented" }, { status: 501 })
}) 