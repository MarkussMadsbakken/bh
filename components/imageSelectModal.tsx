"use client"
import { useEffect, useState } from "react";
import Modal, { ModalTab } from "./modal";
import { ImageUpload } from "./imageUpload";
import { useSession } from "next-auth/react";
import Image from "next/image";


export function ImageSelectModal({ onSelect, onCancel }: { onSelect?: (image: string) => void, onCancel?: () => void }) {

    return (
        <Modal onClose={() => onCancel?.()}>
            <ModalTab name="Velg">
                <div className="w-screen max-w-xl flex flex-col space-y-8 mb-4 font-semibold">
                    <div className="w-full h-fit text-center text-lg">
                        Velg bilde
                    </div>
                    <ViewUploadedImages onSelect={onSelect} />
                </div>
            </ModalTab>
            <ModalTab name="Last opp">
                <div className="w-full flex flex-col space-y-8 mb-4">
                    <div className="w-full h-fit text-center text-lg font-semibold">
                        Last opp
                    </div>
                    <div className="w-screen max-w-xl flex flex-col justify-center h-24">
                        <ImageUpload onUpload={onSelect} />
                    </div>
                </div>
            </ModalTab>
        </Modal>
    )
}


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