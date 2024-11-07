"use client"
import { useEffect, useState } from "react";
import { Button, Dropdown, DropdownItem, TextInput } from "../input";
import Modal from "../modal";
import { useSession } from "next-auth/react";

export default function NewQuoteButton() {
    const [modalOpen, setModalOpen] = useState(false);
    const [quote, setQuote] = useState("");
    const [context, setContext] = useState("");
    const [author, setAuthor] = useState("");
    const [authors, setAuthors] = useState<{ username: string, firstname: string }[]>([]);

    const session = useSession();

    const createQuote = () => {
        fetch("/api/quotes", {
            method: "POST",
            body: JSON.stringify({ quote, context, author }),

        });
    }

    useEffect(() => {
        if (session.data && modalOpen) {
            fetch("/api/users/members").then(res => res.json()).then(members => setAuthors(members));
        }
    }, [modalOpen, session.data])

    return (
        <>
            <div className="fixed bottom-0 right-0">
                <div className="mb-16 mr-16">
                    <Button variant="primary" className="bg-neutral-100 shadow-lg border-none text-lg" onClick={() => setModalOpen(true)}>
                        Nytt sitat
                    </Button>
                </div>
            </div>
            {modalOpen && <Modal onClose={() => setModalOpen(false)}>
                <div className="p-2 w-full space-y-4">
                    <div className="text-xl text-center">
                        Nytt sitat
                    </div>
                    <div className="flex w-full justify-center content-center">
                        {authors.length === 0 ? <div className="w-full h-12 flex justify-center items-center">Laster inn brukere...</div> :
                            <Dropdown open={-1} className="w-full">
                                {authors.map((author, i) => (
                                    <DropdownItem key={i} onSelect={() => setAuthor(author.username)}>
                                        {author.firstname}
                                    </DropdownItem>
                                ))}
                            </Dropdown>
                        }
                    </div>
                    <TextInput placeholder="Sitat" className="w-full stagger h-12 rounded-md" onChange={e => setQuote(e)} />
                    <TextInput placeholder="Kontekst" className="w-full stagger h-12 rounded-md" onChange={e => setContext(e)} />
                    <Button variant="primary" className="w-full stagger h-12 rounded-md" onClick={() => { createQuote(); setModalOpen(false) }}>
                        Legg til sitat
                    </Button>
                </div>
            </Modal >
            }
        </>
    )
}