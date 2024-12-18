"use client";
import { iconComponentFor$, imagePlugin, InsertImage, insertImage$, readOnly$, RealmPlugin, saveImage$, TooltipWrap, useCellValues, usePublisher, useTranslation } from "@mdxeditor/editor";
import { forwardRef, useEffect, useState } from "react";
import { Button } from "../input";
import Modal, { ModalTab } from "../modal";
import { ImageUpload } from "../imageUpload";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { ImageSelectModal } from "../imageSelectModal";


export const CustomInsertImage = forwardRef((props, ref) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [readOnly, iconComponentFor] = useCellValues(readOnly$, iconComponentFor$);
    const translation = useTranslation();
    const publishImage = usePublisher(insertImage$);

    return (
        <>
            <button onClick={() => setModalOpen(!modalOpen)} className="hover:bg-neutral-200 p-1 rounded">
                <TooltipWrap title={translation("toolbar.image", "insert image")}>
                    {iconComponentFor("add_photo")}
                </TooltipWrap>
            </button>
            {
                modalOpen && <ImageSelectModal onSelect={(image) => {
                    publishImage({ src: image });
                    setModalOpen(false);
                }
                } onCancel={() => setModalOpen(false)} />
            }
        </>
    )
});

function ViewUploadedImages({ onSelect }: { onSelect?: (image: string) => void }) {
    const [images, setImages] = useState<string[]>([]);
    const session = useSession();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!session.data?.user) return;
        fetch("/api/users/" + session.data.user.id + "/images/").then(res => res.json()).then(data => {
            setImages(data);
            setLoading(false);
        });

    }, [session.data?.user]);

    const imageSkeleton = (key: string) => {
        return (
            <div className="w-40 h-40 bg-neutral-400 rounded-md animate-pulse p-1" key={key}></div>
        )
    }

    return (
        <div className="grid grid-cols-3 items-center grid-flow-row justify-items-center space-y-2">
            {loading && [1, 2, 3, 4, 5, 6].map((a) => imageSkeleton(a.toString()))}
            {!loading && images.map((image) => {
                return (
                    <button key={image} className="bg-neutral-100 shadow-lg self-center p-1 rounded-md border-2 hover:border-neutral-800 border-transparent h-40 w-40 grid justify-items-center items-center" onClick={() => {
                        onSelect?.(image);
                    }}>
                        <Image src={image} width={140} height={140} alt="uploaded image" className="rounded-md" />
                    </button>
                )
            })}
        </div>
    )
}