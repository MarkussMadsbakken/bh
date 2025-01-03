"use client"

import { Post, Prisma } from "@prisma/client";
import { useEffect, useRef, useState } from "react";
import MarkdownEditor from "../markdown/markdownEditor";
import { useSession } from "next-auth/react";
import { permission } from "@/types/permissions";
import { EditIcon, LoadingSpinner, TrashIcon } from "../icons";
import NewPostButton from "./newPostButton";
import Separator from "../separator";
import ConfirmationDialogue from "../confirmationDialogue";
import { Button, TextInput } from "../input";
import Link from "next/link";
import PostComment, { commentWithAuthor } from "./postComment";

const postWithAuthorAndComments = Prisma.validator<Prisma.PostDefaultArgs>()({
    include: {
        author: true,
        PostComment: {
            include: {
                author: true
            }
        }
    },
});

export type postWithAuthorAndComments = Prisma.PostGetPayload<typeof postWithAuthorAndComments>;


export default function Posts() {
    const [posts, setPosts] = useState<postWithAuthorAndComments[]>([]);
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

    const handleDelete = async (post: postWithAuthorAndComments) => {
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

    const handleEdit = async (post: postWithAuthorAndComments) => {
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
            {session.data?.user.role.permissions.includes(permission.createPost) && <NewPostButton onPostPublish={fetchPosts} />}
        </div>
    );
}

function PostComponent({ post, editable, onEdit, onDelete }: { post: postWithAuthorAndComments, editable?: boolean, onEdit?: (post: Post) => void, onDelete?: (post: Post) => void }) {
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [comments, setComments] = useState<commentWithAuthor[]>(post.PostComment);
    const session = useSession();

    const handleCommentDelete = async (comment: commentWithAuthor) => {
        setComments(comments.filter(c => c.id !== comment.id));

        await fetch(`/api/posts/${post.id}/comments/${comment.id}`, {
            method: "DELETE",
        }).then(res => res.json()).then((res) => {
            if (res.error) {
                console.error(res.error);
            } else {
                // refetch comments
            }
        });
    }

    const handleCommentPublish = (comment: commentWithAuthor) => {
        setComments([...comments, comment]);
    }

    return (
        <div className="w-full relative z-0 bg-white rounded-lg mb-10 overflow-hidden">
            <div className="p-4 flex flex-col mb-4 shadow-lg">
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
                            <Link href={`/users/${post.author.username}`}>
                                <div className="w-fit justify-self-start hover:underline">
                                    {post.author.firstname}
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="w-3/4 self-center">
                    <Separator />
                </div>
                <MarkdownEditor content={post.content} editable={false} />
                {showConfirmDelete && <ConfirmationDialogue message="Er du sikker på at du vil slette dette innlegget?" onCancel={() => setShowConfirmDelete(false)} onConfirm={() => onDelete?.(post)} />}
            </div>
            <div className="w-full h-full p-6">
                <div className="text-lg w-full text-center font-semibold mb-2">
                    Kommentarer
                </div>

                {session.data?.user.role.permissions.includes(permission.addreaction) &&
                    <NewCommentForm postId={post.id} onCommentPublish={(c) => {
                        handleCommentPublish(c);
                    }} />
                }
                <div className="space-y-4">
                    {comments.length > 0 ?
                        comments.map((comment) =>
                        (
                            <PostComment key={comment.id} comment={comment}
                                canDelete={comment.author.id == session.data?.user.id || session.data?.user.role.permissions.includes(permission.deleteAllComments)}
                                onDelete={() => handleCommentDelete(comment)}
                            />
                        )
                        ) :

                        <div className="text-sm text-center">
                            Ingen kommentarer enda...
                        </div>
                    }
                </div>
            </div>
        </div >
    );
}

function NewCommentForm({ onCommentPublish, postId }: { onCommentPublish?: (comment: commentWithAuthor) => void, postId: number }) {
    const [comment, setComment] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const formRef = useRef<HTMLInputElement>(null);

    const handlePublish = async () => {
        if (comment === "") return;
        if (loading) return;

        setLoading(true);

        const res = await fetch(`/api/posts/${postId}/comments`, {
            method: "POST",
            body: JSON.stringify({ comment: comment }),
        }).then(res => res.json());


        if (res.error) {
            console.log(res.error);
            setLoading(false);
            return;
        }

        if (!res.comment) {
            console.error("Bad response from server");
            setLoading(false);
            return;
        }

        setComment("");
        onCommentPublish?.(res.comment);
        setLoading(false);
    }

    return (
        <div className="w-full flex flex-row space-x-2 h-16 p-2">
            <TextInput placeholder="Skriv en kommentar..." className="w-full" onChange={setComment} onEnterClear onSubmit={handlePublish} ref={formRef} />
            <Button className="bg-neutral-200 p-2 rounded-lg w-1/4" onClick={handlePublish}>
                {loading ? <LoadingSpinner /> : "Publiser"}
            </Button>
        </div>
    )

}