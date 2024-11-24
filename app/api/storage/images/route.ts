import { auth } from "@/util/auth"
import { useMinio, useUserImage } from "@/util/minio"
import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

const minio = useMinio();
const prisma = new PrismaClient();
const bucket = "user-image";

export async function GET(req, ctx) {
    return NextResponse.json({ error: "Invalid method" }, { status: 405 });
}

export const POST = auth(async function POST(req, ctx) {
    const formData = await req.formData();
    console.log(formData);
    const filename = randomUUID();
    console.log(filename);

    const auth = await req.auth;


    if (!auth?.user) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const file = formData.get("file") as File | null;
    if (!file) {
        return NextResponse.json({ error: "No files received." }, { status: 400 });
    }

    // Check if the file is an image
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validImageTypes.includes(file.type)) {
        return NextResponse.json({ error: "Invalid file type. Only images are allowed." }, { status: 400 });
    }

    if (!(await minio.bucketExists(bucket))) {
        return NextResponse.json({ error: "Invalid bucket" }, { status: 500 });
    }

    const filebuf = Buffer.from(await file.arrayBuffer());

    // put image
    await minio.putObject(bucket, filename, filebuf);
    await prisma.userImage.create({
        data: {
            image: useUserImage(filename),
            user: {
                connect: {
                    id: auth.user.id
                }
            }
        }
    });

    return NextResponse.json({ message: "Success", image: filename }, { status: 200 });
});