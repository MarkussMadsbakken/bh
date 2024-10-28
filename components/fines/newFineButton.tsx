"use client"
import { useEffect, useState } from "react";
import { Button, Dropdown, DropdownHeader, DropdownItem, TextArea, TextInput } from "../input";
import Modal from "../modal";
import { useSession } from "next-auth/react";
import Warning from "../warning";
import { Quote, User } from "@prisma/client";

export default function NewFineButton() {
    const [modalOpen, setModalOpen] = useState(false);
    const [quote, setQuote] = useState<number>();
    const [context, setContext] = useState("");
    const [author, setAuthor] = useState("");
    const [authors, setAuthors] = useState<User[]>([]);
    const [laws, setLaws] = useState<{ id: string, description: string, paragraph: number, title: string }[]>([]);
    const [law, setLaw] = useState("");
    const [quotes, setQuotes] = useState<Quote[]>([])

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

    useEffect(() => {
        if (author) {
            console.log("/api/quotes/saidBy/" + author)
            fetch("/api/quotes/saidBy/" + author).then(res => res.json()).then(quotes => setQuotes(quotes));
        }
        console.log(author)
    }, [author])

    useEffect(() => {
        console.log(quotes)
    }, [quotes])

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
                <div className="space-y-4 w-[50vw] px-4 py-2">
                    <div className="text-xl text-center">
                        Ny bot
                    </div>
                    <div className="flex flex-col w-full justify-center content-center">
                        <div className="ml-2">
                            Hvem?
                        </div>
                        {authors.length === 0 ? <div className="w-full h-12 flex justify-center items-center">Laster inn brukere...</div> :
                            <Dropdown open={authors.indexOf(authors.find(a => a.id === author) ?? {} as User)} className="w-full" placeholder="Velg..."
                                onSelect={(v) => {
                                    if (authors[v]) {
                                        console.log(authors[v].id)
                                        setAuthor(authors[v].id)
                                    }
                                }
                                }>
                                {authors.map((author, i) => (
                                    <DropdownItem key={i}>
                                        {author.firstname}
                                    </DropdownItem>
                                ))}
                            </Dropdown>
                        }
                    </div>
                    <div className="flex flex-col w-full justify-center content-center">
                        <div className="ml-2">
                            Lov
                        </div>
                        {laws.length === 0 ? <div className="w-full h-12 flex justify-center items-center">Laster inn lovverk</div> :
                            <Dropdown open={laws.indexOf(laws.find(l => l.id === law) ?? { id: "", description: "", paragraph: 0, title: "" })} className="w-full" placeholder="Velg..." onSelect={(n) => {
                                if (laws[n]) {
                                    setLaw(laws[n].id);
                                }
                            }} >
                                {laws.map((law, i) => {

                                    if (law.paragraph % 1 === 0) {
                                        const reducedParagraph = law.paragraph.toString().split(".")[0];
                                        return (
                                            <DropdownHeader key={i}>
                                                <>
                                                    {"§" + reducedParagraph} - {law.title}
                                                </>
                                            </DropdownHeader>
                                        )
                                    }

                                    return (
                                        <DropdownItem key={i} onSelect={() => setLaw(law.id)}>
                                            <>
                                                {"§" + law.paragraph} {law.title}
                                            </>
                                        </DropdownItem>
                                    )
                                })}
                            </Dropdown>
                        }
                        <div className="ml-2 mb-2 font-light">
                            {law && laws.find(l => l.id === law)?.description}
                        </div>
                    </div>
                    <div>
                        <div className="ml-2">
                            Begrunnelse
                        </div>
                        <TextArea placeholder="Skriv..." className="w-full stagger h-12 rounded-md" onChange={e => setQuote(e)} />
                    </div>

                    <div>
                        <div className="ml-2">
                            Antall bøter
                        </div>
                        <TextInput placeholder="Skriv..." className="w-full stagger h-12 rounded-md" acceptedValues={["1", "2", "3", "4", "5", "6", "7", "8", "9", "-"]} onChange={e => setContext(e)} />
                    </div>

                    <div className="flex flex-col w-full justify-center content-center">
                        <div className="ml-2">
                            Sitat (valgfritt)
                        </div>
                        {quotes.length === 0 ? <div className="w-full h-12 flex justify-center items-center">Venter på valg av bruker...</div> :
                            <Dropdown open={quotes.indexOf(quotes.find(q => q.id === quote) ?? {} as Quote)} className="w-full" placeholder="Velg..."
                                onSelect={(v) => {
                                    if (quotes[v])
                                        setQuote(quotes[v].id)
                                }
                                }>
                                {quotes.map((quote, i) => (
                                    <DropdownItem key={i}>
                                        {quote.quote}
                                    </DropdownItem>
                                ))}
                            </Dropdown>
                        }
                    </div>

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