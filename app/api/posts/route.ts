import { permission } from "@/types/permissions";
import { auth } from "@/util/auth";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req, ctx) {
    const posts = await prisma.post.findMany({
        include: {
            author: true
        }
    });
    return NextResponse.json(posts);
}

export const POST = auth(async function POST(req, ctx) {
    const auth = await req.auth;

    if (!auth?.user.id) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (!auth.user.role.permissions.includes(permission.createPost)) {
        return NextResponse.json({ error: "Unsufficient permissions" }, { status: 403 });
    }

    const body = await req.json();

    if (!body?.content || body.content === "") {
        return NextResponse.json({ error: "No content provided" }, { status: 400 });
    }

    if (!body?.title || body.title === "") {
        return NextResponse.json({ error: "No title provided" }, { status: 400 });
    }

    const post = await prisma.post.create({
        data: {
            title: body.title,
            content: body.content,
            userId: auth.user.id
        }
    });

    // delete draft!
    if (post) {
        await prisma.postDraft.update({
            where: {
                userId: auth.user.id
            },
            data: {
                content: "",
                title: ""
            }
        })
    }

    return NextResponse.json({ message: "Success" }, { status: 200 });

});