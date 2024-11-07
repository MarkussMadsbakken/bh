"use client"
import { useEffect, useState } from "react";
import { Button, Dropdown, DropdownHeader, DropdownItem, TextArea, TextInput } from "../input";
import Modal from "../modal";
import { useSession } from "next-auth/react";
import Warning from "../warning";
import { Quote, User } from "@prisma/client";

export default function NewFineButton() {
    const [modalOpen, setModalOpen] = useState(false);
    const [user, setUser] = useState("");
    const [users, setUsers] = useState<User[]>([]);
    const [laws, setLaws] = useState<{ id: string, description: string, paragraph: number, title: string }[]>([]);
    const [law, setLaw] = useState("");
    const [reason, setReason] = useState("");
    const [fineAmount, setFineAmount] = useState<number | undefined>();
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [quote, setQuote] = useState<number | undefined>();
    const session = useSession();

    const createFine = () => {
        console.log({ user, law, reason, fineAmount, quote });
        const res = fetch("/api/fines", {
            method: "POST",
            body: JSON.stringify({ user, law, reason, fineAmount, hasQuote: quote !== undefined, quote }),
        }).then(res => res.json()).then(data => console.log(data));
        //setModalOpen(false)
    }

    useEffect(() => {
        if (session.data && modalOpen) {
            fetch("/api/users/members").then(res => res.json()).then(members => setUsers(members));
            fetch("/api/fines/laws").then(res => res.json()).then(laws => setLaws(laws));
        }
    }, [modalOpen, session.data])

    useEffect(() => {
        if (user) {
            console.log("/api/quotes/saidBy/" + user)
            fetch("/api/quotes/saidBy/" + user).then(res => res.json()).then(quotes => {
                setQuotes(quotes)
            });
        } else {
            setQuotes([]);
            setQuote(undefined);
        }
    }, [user])

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
                <div className="space-y-4 sm:max-w-4xl md:w-[50vw] px-4 py-2">
                    <div className="text-xl text-center">
                        Ny bot
                    </div>
                    <div className="flex flex-col w-full justify-center content-center">
                        <div className="ml-2">
                            Hvem?
                        </div>
                        {users.length === 0 ? <div className="w-full h-12 flex justify-center items-center">Laster inn brukere...</div> :
                            <Dropdown open={users.indexOf(users.find(a => a.id === user) ?? {} as User)} className="w-full" placeholder="Velg..."
                                onSelect={(v) => {
                                    if (users[v]) {
                                        setUser(users[v].id)
                                    } else {
                                        setUser("");
                                    }
                                }
                                }>
                                {users.map((user, i) => (
                                    <DropdownItem key={i}>
                                        {user.firstname}
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
                                } else {
                                    setLaw("");
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
                        <TextArea placeholder="Skriv..." className="w-full stagger h-12 rounded-md" onChange={e => setReason(e)} />
                    </div>

                    <div>
                        <div className="ml-2">
                            Antall bøter
                        </div>
                        <TextInput placeholder="Skriv..." className="w-full stagger h-12 rounded-md" acceptedValues={["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-"]} onChange={e => setFineAmount(parseInt(e))} />
                    </div>

                    <div className="flex flex-col w-full justify-center content-center">
                        <div className="ml-2">
                            Sitat (valgfritt)
                        </div>
                        {quotes.length === 0 ? <div className="w-full h-12 flex justify-center items-center"> {user ? users.find(_user => _user.id === user)?.firstname + " har ingen sitater. Lame!" : "Venter på valg av bruker..."}</div> :
                            <Dropdown open={quotes.indexOf(quotes.find(q => q.id === quote) ?? {} as Quote)} className="w-full" placeholder="Velg..."
                                onSelect={(v) => {
                                    if (quotes[v]) {
                                        setQuote(quotes[v].id)
                                    } else {
                                        setQuote(undefined);
                                    }
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
                        <Button variant="primary" className="w-full stagger h-12 rounded-md mt-2" onClick={() => { createFine(); }}>
                            Opprett bot
                        </Button>
                    </div>
                </div>
            </Modal >
            }
        </>
    )
}