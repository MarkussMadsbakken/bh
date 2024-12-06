"use client"
import { useEffect, useRef, useState } from "react";
import { Button, TextInput } from "../input";
import Modal from "../modal";
import MarkdownEditor from "../markdown/markdownEditor";
import { MDXEditorMethods } from "@mdxeditor/editor";
import { useSession } from "next-auth/react";
import { permission } from "@/types/permissions";

export default function NewPostButton({ onPostPublish }: { onPostPublish?: () => void }) {
    const [modalOpen, setModalOpen] = useState(false);
    const mdxRef = useRef<MDXEditorMethods | null>(null);
    const session = useSession();
    const [title, setTitle] = useState("");
    const [draftLoaded, setDraftLoaded] = useState(false);
    const [draft, setDraft] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleError = (error: string) => {
        if (title === "") {
            setError("Du må legge til tittel broder!");
            return;
        }

        if (mdxRef.current?.getMarkdown() === "") {
            setError("Ikke noe innhold?? Mistenkelig...");
            return;
        }

        setError(error);
    };

    const handlePublish = async () => {
        await fetch("/api/posts/", {
            method: "POST",
            body: JSON.stringify({
                title: title,
                content: mdxRef.current?.getMarkdown()
            })
        }).then(res => res.json()).then((res) => {
            if (res.error) {
                handleError(res.error);
            } else {
                setModalOpen(false);
                onPostPublish?.();
            }
        })
    }

    const handleSave = async () => {
        console.log(mdxRef.current?.getMarkdown());
        await fetch("/api/users/" + session.data?.user.id + "/drafts/post", {
            method: "POST",
            body: JSON.stringify({
                title: title,
                content: mdxRef.current?.getMarkdown()
            })
        }).then(res => res.json()).then((res) => {
            if (res.error) {
                handleError(res.error);
            } else {
                setModalOpen(false);
            }
        });
    }

    const fetchDraft = async () => {
        await fetch("/api/users/" + session.data?.user.id + "/drafts/post", {
            method: "GET"
        }).then(res => res.json()).then((res) => {
            if (res.content) {
                setDraft(res.content);
            }

            if (res.title) {
                setTitle(res.title);
            }

            setDraftLoaded(true);
        });
    }

    useEffect(() => {
        if (session.data) {
            fetchDraft();
        }
    }, [session.data, modalOpen]);

    return (
        <>
            <div className="fixed bottom-0 right-0">
                <div className="mb-16 mr-16">
                    <Button variant="primary" className="bg-neutral-100 shadow-lg border-none text-lg" onClick={() => setModalOpen(true)}>
                        Nytt innlegg
                    </Button>
                </div>
            </div>
            {modalOpen && <Modal onClose={() => setModalOpen(false)}>
                <div className="space-y-4 sm:max-w-4xl md:w-[50vw] px-4 py-2">
                    <div className="text-xl text-center">
                        Nytt innlegg
                    </div>
                    <div>
                        <div className="ml-2">
                            Tittel
                        </div>
                        {draftLoaded && <TextInput placeholder="Skriv..." className="w-full stagger h-12 rounded-md" value={title} onChange={setTitle} />}
                    </div>
                    <div>
                        <div className="ml-2">
                            Innhold
                        </div>
                        <div className="border border-neutral-600 rounded-md p-1">
                            <div className="w-full min-h-96 max-h-96 overflow-y-scroll">
                                {draftLoaded && <MarkdownEditor editorRef={mdxRef} content={draft} />}
                            </div>
                        </div>
                    </div>
                    <div className="h-6 text-red-600 w-full text-center">
                        {error}
                    </div>
                    <div className="flex w-full p-2 justify-center space-x-8 content-center">
                        <Button variant="primary" onClick={handleSave}>Lagre utkast</Button>
                        <Button variant="primary" onClick={handlePublish}>Publiser</Button>
                    </div>
                </div>
            </Modal >
            }
        </>
    )
}