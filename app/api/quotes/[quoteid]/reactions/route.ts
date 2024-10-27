import { permission } from "@/types/permissions";
import { auth } from "@/util/auth";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export const GET = auth(async function GET(req, ctx) {
    const params = await ctx.params;

    if (!req.auth) {
        return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }


    if (!params?.quoteid) {
        return NextResponse.json({ error: "No quoteid provided" }, { status: 400 });
    }

    const reactions = await prisma.quoteReaction.findMany({
        where: {
            quoteId: parseInt(params.quoteid as string)
        },
        include: {
            user: true,
        }
    })

    return NextResponse.json(reactions)
});

export const POST = auth(async function POST(req, ctx) {
    if (!req.auth) {
        return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    if (!req.auth.user.role.permissions.includes(permission.addreaction)) {
        return NextResponse.json({ message: "Unsufficient permissions" }, { status: 403 })
    }

    const params = await ctx.params;
    const body = await req.json()

    if (!params?.quoteid) {
        return NextResponse.json({ message: "No quoteid provided" }, { status: 400 })
    }

    if (req.auth.user.id !== body.userid) {
        return NextResponse.json({ message: "You can't react to quotes on behalf of other users" }, {
            status: 403
        });
    }

    // Get all reactions
    const reactions = await prisma.quoteReaction.findMany({
        where: {
            quoteId: parseInt(params.quoteid as string)
        }
    })

    // Check if the user has already reacted with the same reaction
    const userReaction = reactions.find(reaction => req.auth && reaction.userId === req.auth.user.id && reaction.reaction === body.reaction)

    if (userReaction) {
        // TODO: ensure that the reaction actually is removed
        await prisma.quoteReaction.delete({
            where: {
                id: userReaction.id
            }
        })
        return NextResponse.json({ message: "Reaction removed" })
    }

    if (!req.auth.user.id) {
        return NextResponse.json({ message: "No user id provided" }, { status: 400 })
    }

    // Add the reaction
    const r = await prisma.quoteReaction.create({
        data: {
            reaction: body.reaction,
            quoteId: parseInt(params.quoteid as string),
            userId: req.auth.user.id
        }
    })

    if (!r) {
        return NextResponse.json({ message: "Failed to add reaction" }, { status: 500 })
    }

    return NextResponse.json({ message: "Reaction added" })
})
