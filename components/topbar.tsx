"use client"

import { signOut, useSession } from "next-auth/react"
import { useEffect, useRef, useState } from "react";
import LoginModal from "./loginmodal";
import ProfilePic from "./profilepic";
import { useClickOutside } from "@/util/hooks";
import { Button } from "./input";
import Separator from "./separator";
import { animate, motion } from "framer-motion";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function Topbar() {
    const session = useSession();
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [accountOptionOpen, setAccountOptionOpen] = useState(false);
    const accountOptionRef = useRef<HTMLDivElement>(null);

    useClickOutside(accountOptionRef, () => {
        setAccountOptionOpen(false);
    })

    return (
        <>
            <div className="w-full h-fit fixed backdrop-blur-xl z-[100]">
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
                                        setLoginModalOpen(true);
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
            {loginModalOpen && <LoginModal onCancel={() => setLoginModalOpen(false)} onFinish={() => setLoginModalOpen(false)} />}
            <div className="h-24 w-full" />
        </>
    )
}

function TopbarLink({ href, children }: { href: string, children: React.ReactNode }) {
    return (
        <Link href={href} className="p-2 border h-16 w-24 flex justify-center align-middle rounded-lg">
            <div className="self-center font-normal">
                {children}
            </div>
        </Link>
    )
}