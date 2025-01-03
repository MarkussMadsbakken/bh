import { Prisma } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { TrashIcon } from "../icons";

const commentWithAuthor = Prisma.validator<Prisma.PostCommentDefaultArgs>()({
    include: {
        author: true,
    },
});

export type commentWithAuthor = Prisma.PostCommentGetPayload<typeof commentWithAuthor>;


export default function PostComment({ comment, canDelete, onDelete }: { comment: commentWithAuthor, canDelete?: boolean, onDelete?: () => void }) {
    console.log(canDelete);

    return (
        <div className="relative w-full flex flex-row rounded-xl bg-white shadow-lg p-4 space-x-4">
            <Link href={`/users/${comment.author.username}`} className="flex flex-col w-fit hover:underline hover:cursor-pointer">
                {comment.author.image ?
                    <Image src={comment.author.image} width={50} height={50} alt="profile" className="rounded-full" />
                    : <div className="w-10 h-10 bg-gray-300 rounded-full"></div>}
                {comment.author.firstname}
            </Link>
            <div className="flex flex-col w-full min-h-full">
                <div className="text-sm text-gray-500 h-fit">
                    {new Date(comment.createdAt).toLocaleDateString()}
                </div>
                <div className="text-lg h-full">
                    {comment.content}
                </div>
            </div>

            {canDelete &&
                <button onClick={onDelete} className="absolute right-6 top-6">
                    <TrashIcon className="size-6" />
                </button>
            }
        </div>
    )
}