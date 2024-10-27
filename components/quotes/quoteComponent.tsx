"use client"
import { reaction } from '@/types/quotes';
import { signIn, useSession } from 'next-auth/react';
import { Ephesis } from 'next/font/google'
import { useEffect, useRef, useState } from 'react';
import Reaction from '@/components/reaction';
import { useAnimate } from 'framer-motion';
import NewReactionPicker from "@/components/newReactionPicker";
import { Prisma, Quote, QuoteReaction, User } from '@prisma/client';
import { permission } from '@/types/permissions';

const Eph = Ephesis({ subsets: ['latin'], weight: "400" });

const quoteWithReactions = Prisma.validator<Prisma.QuoteDefaultArgs>()({
    include: {
        author: true,
        createdBy: true,
        reactions: {
            include: {
                user: true
            }
        }
    }
})

export type quoteWithReactions = Prisma.QuoteGetPayload<typeof quoteWithReactions>;

const quoteReactionWithUser = Prisma.validator<Prisma.QuoteReactionDefaultArgs>()({
    include: {
        user: true,
    }
})

export type quoteReactionWithUser = Prisma.QuoteReactionGetPayload<typeof quoteReactionWithUser>;

export default function QuoteComponent(props: Readonly<quoteWithReactions>) {
    const [addReactionScope, animateAddReaction] = useAnimate();
    const addReactionButtonRef = useRef<HTMLButtonElement>(null);

    const [reactions, setReactions] = useState<quoteReactionWithUser[]>(props.reactions)
    const [newReactionPickerOpen, setNewReactionPickerOpen] = useState<boolean>(false);

    const session = useSession();

    const date = new Date(props.createdAt).toLocaleDateString();

    const groupedReactions = reactions.reduce((acc: { [key: string]: User[] }, reaction) => {
        if (!acc[reaction.reaction]) {
            acc[reaction.reaction] = [];
        }
        acc[reaction.reaction].push(reaction.user);
        return acc;
    }, {} as { [key: string]: User[] });

    const fetchReactions = async () => {
        const res = await fetch(`/api/quotes/${props.id}/reactions`);
        const data = await res.json();
        setReactions(data);
    }


    const addReaction = async (reaction: reaction) => {
        // Optimistic update

        const prevReaction = reactions.find(r => r.userId === session.data?.user?.id && r.reaction === reaction)

        if (prevReaction) {
            setReactions(reactions.filter(r => r.id !== prevReaction.id))
        } else {
            // This might be a little bit hacky, but it works
            // The server will hopefully respond before the user can react again
            setReactions([...reactions, {
                id: reactions.length + 1,
                reaction: reaction,
                quoteId: props.id,
                user: {
                    firstname: session.data?.user.name ?? '',
                    id: session.data?.user.id ?? "?",
                    username: session.data?.user.firstname ?? "",
                    role: "MEMBER",
                    image: "",
                },
                userId: session.data?.user.id ?? "?"
            }])
        }


        const res = await fetch(`/api/quotes/${props.id}/reactions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                reaction: reaction,
                userid: session.data?.user.id
            })
        });

        if (res.ok) {
            fetchReactions();
        } else {
            const data = await res.json();
            console.error(data);
        }
    }


    useEffect(() => {

        //adds an event listener to the window to check if a click is outside the dropdown box
        if (newReactionPickerOpen) {
            window.addEventListener("click", checkClick);
        }

        //checks if a click is outside the dropdown box
        function checkClick(e: MouseEvent) {
            if (!addReactionScope.current?.contains(e.target) && !addReactionButtonRef.current?.contains(e.target as Node)) {
                setNewReactionPickerOpen(false);
                window.removeEventListener("click", checkClick);
            }
        }

        //removes the event listener when the component is unmounted
        return () => {
            window.removeEventListener("click", checkClick);
        };
    }, [newReactionPickerOpen]);

    return (
        <div className={`relative grid mt-4 md:mt-6 md:w-5/12 w-3/4 pb-2 md:pb-5 border rounded-lg transition-all duration-500 bg-white shadow-lg`}>
            <div className={`absolute inset-0 duration-1000`}></div>
            <div className='relative transition-all duration-1000'>
                <div className='mt-3 md:mt-8 flex flex-col justify-center items-center'>
                    <div className="flex flex-col md:relative justify-center items-center text-center w-full">
                        <div className="md:text-2xl text-lg w-7/12">{props.quote}</div>
                        <div className="flex md:absolute md:right-0 items-center justify-center select-none justify-self-end">
                            <div className={"text-2xl md:pl-2 text-center md:pr-4 " + Eph.className}>{"- " + props.author.firstname}</div>
                        </div>
                    </div>
                    <div className="p-2 font-extralight text-xs text-center">{props.context}</div>
                    <div className="mt-1 font-extralight text-xs">{date}</div>
                    <div className="mt-2 mb-4 font-extralight text-xs">{"Skrevet av: " + props.createdBy.firstname}</div>
                </div>
            </div>

            <div className='flex z-10 align-middle justify-center flex-row text-xs md:right-1 md:bottom-1 md:absolute md:text-base'>
                <div className="flex flex-row space-x-2 justify-center">
                    {groupedReactions && Object.keys(groupedReactions).map((key: string, i: number) => {
                        return (
                            <div key={i + key} className="">
                                <Reaction reaction={key as reaction} users={groupedReactions[key]} addReaction={() => {
                                    addReaction(key as reaction)
                                }} />
                            </div>
                        )
                    })}

                    {session.data?.user.role.permissions.includes(permission.addreaction) &&
                        <>
                            <button onClick={() => { session.data?.user ? setNewReactionPickerOpen(true) : signIn() }} ref={addReactionButtonRef}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                            </button>

                            {newReactionPickerOpen &&
                                <div ref={addReactionScope} className="absolute md:right-0 md:bottom-0 z-50 bg-neutral-700 p-2 rounded-md text-white shadow">
                                    <NewReactionPicker addReaction={(reaction) => {
                                        addReaction(reaction);
                                        setNewReactionPickerOpen(false);
                                    }} />
                                </div>}
                        </>
                    }

                    {session.data?.user.id === props.createdBy.id &&
                        <button onClick={() => { console.log("edit") }}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                            </svg>
                        </button>
                    }
                </div>
            </div>
        </div>
    );
}