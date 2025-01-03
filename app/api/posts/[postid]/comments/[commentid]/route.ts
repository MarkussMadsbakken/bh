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

export const DELETE = auth(async function POST(req, ctx) {
    const auth = await req.auth;
    const params = await ctx.params;

    if (!auth?.user.id) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (!params?.postid) {
        return NextResponse.json({ error: "No postid provided" }, { status: 400 });
    }

    if (!auth.user.role.permissions.includes(permission.createComment)) {
        return NextResponse.json({ error: "Unsufficient permissions" }, { status: 403 });
    }

    const comment = await prisma.postComment.findUnique({
        where: {
            id: parseInt(Array.isArray(params.commentid) ? params.commentid[0] : params.commentid)
        }
    });

    if (!comment) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (comment.userId !== auth.user.id && !auth.user.role.permissions.includes(permission.editAllComments)) {
        return NextResponse.json({ error: "You cant delete comments from other users" }, { status: 403 });
    }

    const res = await prisma.postComment.delete({
        where: {
            id: parseInt(Array.isArray(params.commentid) ? params.commentid[0] : params.commentid)
        },
    });

    if (!res) {
        return NextResponse.json({ error: "Could not delete comment" }, { status: 404 });
    }

    return NextResponse.json({ message: "Success" }, { status: 200 });
});
