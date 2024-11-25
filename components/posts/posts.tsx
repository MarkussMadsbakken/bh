"use client"

import { Post, Prisma } from "@prisma/client";
import { useEffect, useState } from "react";
import MarkdownEditor from "../markdown/markdownEditor";
import { useSession } from "next-auth/react";
import { permission } from "@/types/permissions";
import { EditIcon, TrashIcon } from "../icons";
import NewPostButton from "./newPostButton";
import Separator from "../separator";
import ConfirmationDialogue from "../confirmationDialogue";

const postWithAuthor = Prisma.validator<Prisma.PostDefaultArgs>()({
    include: {
        author: true,
    }
})

export type postWithAuthor = Prisma.PostGetPayload<typeof postWithAuthor>;


export default function Posts() {
    const [posts, setPosts] = useState<postWithAuthor[]>([]);
    const session = useSession();

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        const res = await fetch("/api/posts", {
            method: "GET"
        });
        const data = await res.json();
        setPosts(data);
    }

    const handleDelete = async (post: postWithAuthor) => {
        await fetch("/api/posts/" + post.id, {
            method: "DELETE"
        }).then(res => res.json()).then((res) => {
            if (res.error) {
                console.error(res.error);
            } else {
                fetchPosts();
            }
        });
    }

    const handleEdit = async (post: postWithAuthor) => {
        console.log("Edit post", post);
    }

    return (
        <div className="w-full">
            <div className="w-full text-center font-semibold text-2xl">
                Innlegg
            </div>
            <div className="flex flex-col justify-center items-center space-y-6 mt-6">
                <div className="w-3/4">
                    {posts.toReversed().map((post) => (
                        <PostComponent
                            key={post.id}
                            post={post}
                            onDelete={handleDelete}
                            onEdit={handleEdit}
                            editable={session.data?.user.role.permissions.includes(permission.editAllPosts) || session.data?.user.id === post.userId} />
                    ))}
                </div>
            </div>
            {session.data?.user.role.permissions.includes(permission.createPost) && <NewPostButton onPostPublish={fetchPosts} />}
        </div>
    );
}

function PostComponent({ post, editable, onEdit, onDelete }: { post: postWithAuthor, editable?: boolean, onEdit?: (post: Post) => void, onDelete?: (post: Post) => void }) {
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);

    return (
        <div className="w-full relative z-0 bg-white rounded-lg mb-10 overflow-hidden">
            <div className="p-4 flex flex-col mb-4">
                {editable &&
                    <div className="absolute right-6 top-6 flex flex-row space-x-2">
                        <button onClick={() => onEdit?.(post)}>
                            <EditIcon className="size-6" />
                        </button>
                        <button onClick={() => setShowConfirmDelete(true)}>
                            <TrashIcon className="size-6" />
                        </button>
                    </div>
                }
                <div className="w-full text-center p-4 flex flex-col items-center justify-center">
                    <div className="font-bold text-2xl">
                        {post.title}
                    </div>
                    <div className="grid grid-cols-2 grid-flow-col-dense font-extralight text-xs">
                        <div className="w-fit justify-self-end">
                            {new Date(post.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center w-1/3 justify-self-center">
                            <div className="w-full border-t border-neutral-800 rounded-xl"></div>
                        </div>
                        <div>
                            <div className="w-fit justify-self-start">
                                {post.author.firstname}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-3/4 self-center">
                    <Separator />
                </div>
                <MarkdownEditor content={post.content} editable={false} />
                {showConfirmDelete && <ConfirmationDialogue message="Er du sikker på at du vil slette dette innlegget?" onCancel={() => setShowConfirmDelete(false)} onConfirm={() => onDelete?.(post)} />}
            </div>
            <div className="bg-neutral-200 w-full h-full p-2">
                <div className="text-lg w-full text-center font-semibold">
                    Kommentarer
                </div>

                <div className="text-sm text-center">
                    Ingen kommentarer enda...
                </div>
            </div>
        </div >
    );
}