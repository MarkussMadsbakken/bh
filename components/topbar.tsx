"use client"

import { signOut, useSession } from "next-auth/react"
import { useRef, useState } from "react";
import ProfilePic from "./profilepic";
import { useClickOutside } from "@/util/hooks";
import { Button } from "./input";
import Separator from "./separator";
import { motion } from "framer-motion";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useLoginModal } from "@/util/loginprovider";

export default function Topbar() {
    const session = useSession();
    const [accountOptionOpen, setAccountOptionOpen] = useState(false);
    const accountOptionRef = useRef<HTMLDivElement>(null);
    const loginModal = useLoginModal();

    useClickOutside(accountOptionRef, () => {
        setAccountOptionOpen(false);
    })

    return (
        <>
            <div className="w-full h-fit fixed backdrop-blur-xl z-[100] bg-[#fae296]">
                <div className="left-0 top-0 max-w-3xl z-50 ml-auto mr-auto p-2 h-24 relative">
                    <div className="relatve flex flex-row h-full w-full justify-between">
                        <div className="flex flex-row w-1/2 space-x-4 self-center" >
                            <TopbarLink href="/">Hjem</TopbarLink>
                            <TopbarLink href="/brygg">Brygg</TopbarLink>
                        </div>
                        <div ref={accountOptionRef} className={`ml-auto  flex flex-col justify-center ${accountOptionOpen ? "absolute bg-white rounded-lg    shadow-lg z-50 p-4 h-fit transition-all duration-300 right-0 " : "relative h-20 align-middle"}`}>
                            <motion.div layout className="self-center">
                                <ProfilePic userid={session.data?.user.name || ""} onclick={() => {
                                    if (!session.data?.user) {
                                        loginModal.open();
                                    } else {
                                        setAccountOptionOpen(!accountOptionOpen);
                                    }

                                }} />
                            </motion.div>

                            {accountOptionOpen &&
                                <div className="flex flex-col pt-6 text-center justify-center align-middle w-44">
                                    {session.data?.user.name}
                                    <Separator />
                                    <Button variant="primary" className="mt-2" onClick={() => {
                                        setAccountOptionOpen(false);
                                        redirect(`/users/${session.data?.user.name}`);
                                    }} >
                                        Profil
                                    </Button>
                                    <Button variant="primary" className="mt-2" onClick={() => signOut()}>Logg ut</Button>
                                </div>}
                        </div>
                    </div>
                </div>
            </div>
            <div className="h-24 w-full" />
        </>
    )
}

function TopbarLink({ href, children }: { href: string, children: React.ReactNode }) {
    return (
        <Link href={href} className="p-2 h-16 w-24 flex justify-center align-middle rounded-lg bg-neutral-100">
            <div className="self-center font-normal">
                {children}
            </div>
        </Link>
    )
}