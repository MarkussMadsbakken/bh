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
        <div className="left-0 top-0 w-screen flex flex-row h-20 z-50">
            <div className="flex flex-row w-1/2">
                <Link href="/">
                    Hjem
                </Link>
            </div>
            <div ref={accountOptionRef} className={`ml-auto flex flex-col w-fit m-4 justify-center ${accountOptionOpen ? "absolute right-0 top-0 border-neutral-200 border rounded-md shadow-lg z-40 p-4 h-fit transition-all duration-300" : "relative h-20 align-middle"}`}>
                <motion.div layout className="self-center">
                    <ProfilePic userid={session.data?.user.name || ""} onclick={() => {
                        if (!session.data?.user) {
                            setLoginModalOpen(true);
                        } else {
                            setAccountOptionOpen(!accountOptionOpen);
                        }

                    }} />
                </motion.div>

                {loginModalOpen && <LoginModal onCancel={() => setLoginModalOpen(false)} onFinish={() => setLoginModalOpen(false)} />}
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
    )
}