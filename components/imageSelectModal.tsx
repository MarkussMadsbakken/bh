"use client"
import { useEffect, useState } from "react";
import Modal, { ModalTab } from "./modal";
import { ImageUpload } from "./imageUpload";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { TrashIcon } from "./icons";
import ConfirmationDialogue from "./confirmationDialogue";


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
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [deleteImage, setDeleteImage] = useState<string | undefined>();

    const fetchImages = async () => {
        if (!session.data?.user) return;
        fetch("/api/users/" + session.data.user.id + "/images/").then(res => res.json()).then(data => {
            setImages(data);
            setLoading(false);
        });

    }

    useEffect(() => {
        fetchImages();
    }, [session.data?.user]);

    const handleDelete = async () => {
        if (!deleteImage) return;

        await fetch("api/storage/images/", {
            method: "DELETE",
            body: JSON.stringify({ image: deleteImage }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json()).then(data => {
            if (data.error) {
                setShowDeleteConfirmation(false);
                console.error(data.error);
            } else {
                setImages(images.filter((image) => image !== deleteImage));
                setShowDeleteConfirmation(false);
                fetchImages();
            }
        })
    }

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
                    <div className="relative" key={image}>
                        <button className="relative bg-neutral-100 shadow-lg self-center p-1 rounded-md border-2 hover:border-neutral-800 border-transparent h-40 w-40 grid justify-items-center items-center" onClick={() => {
                            onSelect?.(image);
                        }}>
                            <Image src={image} width={140} height={140} alt="uploaded image" className="rounded-md" />
                        </button>

                        <button className="right-0 top-0 absolute w-fit h-fit bg-white rounded-md p-1" onClick={() => { setShowDeleteConfirmation(true); setDeleteImage(image) }}>
                            <TrashIcon className="" />
                        </button>
                    </div>
                )
            })}
            {showDeleteConfirmation && <ConfirmationDialogue message="Er du sikker på at du vil slette dette nydelige bildet?" onCancel={() => { setShowDeleteConfirmation(false); setDeleteImage(undefined) }} onConfirm={handleDelete} />}
        </div >
    )
}