"use client"
import { useEffect, useState } from "react";
import { Button, Dropdown, DropdownItem, TextArea, TextInput } from "../input";
import Modal from "../modal";
import { useSession } from "next-auth/react";
import Warning from "../warning";

export default function NewFineButton() {
    const [modalOpen, setModalOpen] = useState(false);
    const [quote, setQuote] = useState("");
    const [context, setContext] = useState("");
    const [author, setAuthor] = useState("");
    const [authors, setAuthors] = useState<{ username: string, firstname: string }[]>([]);
    const [laws, setLaws] = useState<{ id: string, description: string, paragraph: number, title: string }[]>([]);
    const [law, setLaw] = useState("");

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
            fetch("/api/fines/laws").then(res => res.json()).then(laws => setLaws(laws));
        }
    }, [modalOpen, session.data])

    return (
        <>
            <div className="fixed bottom-0 right-0">
                <div className="mb-16 mr-16">
                    <Button variant="primary" className="bg-neutral-100 shadow-lg border-none text-lg" onClick={() => setModalOpen(true)}>
                        Ny bot
                    </Button>
                </div>
            </div>
            {modalOpen && <Modal onClose={() => setModalOpen(false)}>
                <div className="p-2 w-full space-y-4">
                    <div className="text-xl text-center">
                        Ny bot
                    </div>
                    <div className="flex w-full justify-center content-center">
                        {authors.length === 0 ? <div className="w-full h-12 flex justify-center items-center">Laster inn forfattere...</div> :
                            <Dropdown open={-1} className="w-full" placeholder="Hvem?">
                                {authors.map((author, i) => (
                                    <DropdownItem key={i} onSelect={() => setAuthor(author.username)}>
                                        {author.firstname}
                                    </DropdownItem>
                                ))}
                            </Dropdown>
                        }
                    </div>
                    <div className="flex w-full justify-center content-center">
                        {laws.length === 0 ? <div className="w-full h-12 flex justify-center items-center">Laster inn forfattere...</div> :
                            <Dropdown open={-1} className="w-full" placeholder="Lov">
                                {laws.map((law, i) => (
                                    <DropdownItem key={i} onSelect={() => setLaw(law.id)}>
                                        <>
                                            {"§" + law.paragraph} {law.title}
                                        </>
                                    </DropdownItem>
                                ))}
                            </Dropdown>
                        }
                    </div>
                    <TextArea placeholder="Bot" className="w-full stagger h-12 rounded-md" onChange={e => setQuote(e)} />
                    <TextInput placeholder="Kontekst" className="w-full stagger h-12 rounded-md" onChange={e => setContext(e)} />
                    <div>
                        <Warning title="Dette vil også opprette en bot på tihlde.org!" />
                        <Button variant="primary" className="w-full stagger h-12 rounded-md mt-2" onClick={() => { createQuote(); setModalOpen(false) }}>
                            Opprett bot
                        </Button>
                    </div>
                </div>
            </Modal >
            }
        </>
    )
}