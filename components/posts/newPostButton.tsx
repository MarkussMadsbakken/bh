"use client"
import { useEffect, useState } from "react";
import { Button, Dropdown, DropdownHeader, DropdownItem, TextArea, TextInput } from "../input";
import Modal from "../modal";
import { useSession } from "next-auth/react";
import Warning from "../warning";
import { Quote, User } from "@prisma/client";

export default function NewPostButton() {
    const [modalOpen, setModalOpen] = useState(false);
    const session = useSession();


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
                    <TextArea placeholder="Skriv..." />

                    <div className="flex w-full p-2 justify-center space-x-8 content-center">
                        <Button variant="primary">Lagre utkast</Button>
                        <Button variant="primary">Publiser</Button>
                    </div>
                </div>
            </Modal >
            }
        </>
    )
}