import { permission } from "@/types/permissions";
import { auth } from "@/util/auth";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req, ctx) {
    return NextResponse.json({ error: "Invalid method" }, { status: 405 });
}

export async function POST(req, ctx) {
    return NextResponse.json({ error: "Invalid method" }, { status: 405 });
}

export const DELETE = auth(async function DELETE(req, ctx) {
    const auth = await req.auth;
    const params = await ctx.params;

    if (!auth?.user) {
        return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    if (!params?.postid) {
        return NextResponse.json({ error: "No postid provided" }, { status: 400 });
    }

    const post = await prisma.post.findUnique({
        where: {
            id: parseInt(params.postid as string)
        }
    });

    if (!post) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (post.userId !== auth.user.id && !auth.user.role.permissions.includes(permission.editAllPosts)) {
        return NextResponse.json({ error: "You cant delete posts from other users" }, { status: 403 });
    }

    await prisma.post.delete({
        where: {
            id: parseInt(params.postid as string)
        }
    });

    return NextResponse.json({ message: "Success" }, { status: 200 });
});