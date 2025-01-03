import { permission } from "@/types/permissions";
import { auth } from "@/util/auth";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req, ctx) {
    return NextResponse.json({ error: "Invalid method" }, { status: 405 });
}

export const POST = auth(async function POST(req, ctx) {
    const auth = await req.auth;
    const params = await ctx.params;

    if (!auth?.user.id) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (!auth.user.role.permissions.includes(permission.createComment)) {
        return NextResponse.json({ error: "Unsufficient permissions" }, { status: 403 });
    }

    if (!params?.postid) {
        return NextResponse.json({ error: "No postid provided" }, { status: 400 });
    }

    const body = await req.json();
    const comment = body?.comment;
    if (!comment || comment === "") {
        return NextResponse.json({ error: "No comment provided" }, { status: 400 });
    }

    const post = await prisma.post.findUnique({
        where: {
            id: parseInt(Array.isArray(params.postid) ? params.postid[0] : params.postid)
        }
    });

    if (!post) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const postComment = await prisma.postComment.create({
        data: {
            content: comment,
            userId: auth.user.id,
            postId: post.id
        },
        include: {
            author: true
        }
    });
    return NextResponse.json({ message: "Success", comment: postComment }, { status: 200 });
});

