"use client"

import { Post } from "@prisma/client";
import { useEffect, useState } from "react";
import MarkdownEditor from "../markdown/markdownEditor";
import { useSession } from "next-auth/react";
import { permission } from "@/types/permissions";
import { EditIcon, TrashIcon } from "../icons";
import NewPostButton from "./newPostButton";
import Separator from "../separator";

export default function Posts() {
    const [posts, setPosts] = useState<Post[]>([]);
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

    const handleDelete = async (post: Post) => {
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

    const handleEdit = async (post: Post) => {
        console.log("Edit post", post);
    }

    return (
        <div className="w-full">
            <div className="w-full text-center font-semibold text-2xl">
                Innlegg
            </div>
            <div className="flex flex-col justify-center items-center space-y-6 mt-6">
                <div className="w-3/4">
                    {posts.map((post) => (
                        <PostComponent
                            key={post.id}
                            post={post}
                            onDelete={handleDelete}
                            onEdit={handleEdit}
                            editable={session.data?.user.role.permissions.includes(permission.editAllPosts) || session.data?.user.id === post.userId} />
                    ))}
                </div>
            </div>
            {session.data?.user.role.permissions.includes(permission.createPost) && <NewPostButton />}
        </div>
    );
}

function PostComponent({ post, editable, onEdit, onDelete }: { post: Post, editable?: boolean, onEdit?: (post: Post) => void, onDelete?: (post: Post) => void }) {
    return (
        <div className="w-full relative z-0 bg-white rounded-lg p-2 flex flex-col">
            <div className="absolute right-6 top-6 flex flex-row space-x-2">
                <button onClick={() => onEdit?.(post)}>
                    <EditIcon className="size-6" />
                </button>
                <button onClick={() => onDelete?.(post)}>
                    <TrashIcon className="size-6" />
                </button>
            </div>
            <div className="w-full text-center font-bold text-2xl p-4">
                {post.title}
            </div>
            <div className="w-3/4 self-center">
                <Separator />
            </div>
            <MarkdownEditor content={post.content} editable={false} />
        </div>
    );
}