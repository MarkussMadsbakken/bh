"use client"
import { useEffect, useState } from "react";
import { Button, Dropdown, DropdownItem, TextArea, TextInput } from "../input";
import Modal from "../modal";
import { useSession } from "next-auth/react";
import Warning from "../warning";

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
                <div className="p-2 w-full space-y-4 sm:max-w-3xl md:w-[40vw]">
                    <div className="text-xl text-center">
                        Nytt sitat
                    </div>
                    <div className="flex w-full justify-center content-center">
                        {authors.length === 0 ? <div className="w-full h-12 flex justify-center items-center">Laster inn brukere...</div> :
                            <Dropdown open={-1} className="w-full"
                                onSelect={(i) => {
                                    if (i === -1) {
                                        setAuthor("");
                                    } else {
                                        setAuthor(authors[i].username);
                                    }
                                }}
                            >
                                {authors.map((author, i) => (
                                    <DropdownItem key={i}>
                                        {author.firstname}
                                    </DropdownItem>
                                ))}
                            </Dropdown>
                        }
                    </div>
                    <TextArea placeholder="Sitat" className="w-full  rounded-md" onChange={e => setQuote(e)} />
                    <TextArea placeholder="Kontekst" className="w-full  rounded-md" onChange={e => setContext(e)} />
                    <div className="h-fit text-red-600">
                        {author === session.data?.user.name && <Warning title="Er du sikker på at du vil legge til et sitat på deg selv?" />}
                    </div>
                    <Button variant="primary" className="w-full stagger h-12 rounded-md" onClick={() => { createQuote(); setModalOpen(false) }}>
                        Legg til sitat
                    </Button>
                </div>
            </Modal >
            }
        </>
    )
}