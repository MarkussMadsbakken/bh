import { auth } from "@/util/auth";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export const GET = auth(async function GET(req, ctx) {
    const auth = await req.auth;
    const params = await ctx.params;

    if (!auth?.user) {
        return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    if (!params?.userid) {
        return NextResponse.json({ error: "No userid provided" }, { status: 400 });
    }

    if (params.userid !== auth.user.id) {
        return NextResponse.json({ error: "You cant view drafts for other users" }, { status: 403 });
    }

    const draft = await prisma.postDraft.findFirst({
        where: {
            userId: params.userid
        }
    });

    return NextResponse.json(draft || {});
});

export const POST = auth(async function POST(req, ctx) {
    const auth = await req.auth;
    const params = await ctx.params;
    const body = await req.json();

    if (!auth?.user) {
        return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    if (!params?.userid) {
        return NextResponse.json({ error: "No userid provided" }, { status: 400 });
    }

    if (!body?.content || body.content === "") {
        return NextResponse.json({ error: "No content provided" }, { status: 400 });
    }

    if (!body?.title || body.title === "") {
        return NextResponse.json({ error: "No title provided" }, { status: 400 });
    }

    if (params.userid !== auth.user.id) {
        return NextResponse.json({ error: "You cant create drafts for other users" }, { status: 403 });
    }

    try {
        await prisma.postDraft.update({
            where: {
                userId: params.userid
            },
            data: {
                title: body.title,
                content: body.content
            }
        })
    } catch (e) {
        // update failed, create instead
        // better to catch instead of running a query to check if it exists
        await prisma.postDraft.create({
            data: {
                userId: params.userid,
                title: body.title,
                content: body.content
            }
        })
    }

    return NextResponse.json({ message: "Success" }, { status: 200 });
});
