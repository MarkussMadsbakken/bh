"use client"

import { signOut, useSession } from "next-auth/react"
import { useRef, useState } from "react";
import ProfilePic from "./profilepic";
import { useClickOutside } from "@/util/hooks";
import { Button } from "./input";
import Separator from "./separator";
import { motion } from "framer-motion";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import { useLoginModal } from "@/util/loginprovider";
import { permission } from "@/types/permissions";

export default function Topbar() {
    const session = useSession();
    const [accountOptionOpen, setAccountOptionOpen] = useState(false);
    const accountOptionRef = useRef<HTMLDivElement>(null);
    const loginModal = useLoginModal();
    const pathname = usePathname();

    useClickOutside(accountOptionRef, () => {
        setAccountOptionOpen(false);
    })

    return (
        <>
            <div className="w-full h-fit fixed backdrop-blur-xl z-[100]">
                <div className="absolute bg-[#fae296] w-full h-full opacity-70" />
                <div className="left-0 top-0 max-w-5xl z-50 ml-auto mr-auto p-2 h-24 relative">
                    <div className="flex flex-row w-full h-full justify-center">
                        <div className="flex flex-row w-fit space-x-4 self-center">
                            <TopbarLink href="/" underlined={pathname === "/"}>Hjem</TopbarLink>
                            <TopbarLink href="/brygg" underlined={pathname === "/brygg"}>Brygg</TopbarLink>
                            {session.data?.user.role.permissions.includes(permission.viewquotes) && <TopbarLink href="/quotes" underlined={pathname === "/quotes"}> Sitater </TopbarLink>}
                            {session.data?.user.role.permissions.includes(permission.viewfines) && <TopbarLink href="/fines" underlined={pathname === "/fines"}> Bøter </TopbarLink>}
                        </div>
                    </div>
                    <div className="absolute top-0 right-0 h-full w-max">
                        <div ref={accountOptionRef} className={`relative p-4 flex flex-col self-center justify-center ${accountOptionOpen ? "bg-white rounded-lg shadow-lg z-50 h-fit transition-all duration-300" : "h-full"}`}>
                            <div className="flex flex-row w-full h-fit justify-center align-middle">
                                <ProfilePic userid={session.data?.user.id ?? ""} onclick={() => {
                                    if (!session.data?.user) {
                                        loginModal.open();
                                    } else {
                                        setAccountOptionOpen(!accountOptionOpen);
                                    }

                                }} />
                            </div>

                            {accountOptionOpen &&
                                <div className="static bottom-0 w-full h-full ">
                                    <div className="flex flex-col pt-6 text-center justify-center align-middle w-44">
                                        <div className="grid flex-row space-x-2 w-full align-bottom">
                                            <div>
                                                {session.data?.user.name}
                                            </div>
                                            <div className="font-extralight text-xs h-fit">
                                                {session.data?.user.role.shortname}
                                            </div>
                                        </div>
                                        <Separator />
                                        <Button variant="primary" className="mt-2" onClick={() => {
                                            setAccountOptionOpen(false);
                                            redirect(`/users/${session.data?.user.name}`);
                                        }} >
                                            Profil
                                        </Button>
                                        <Button variant="primary" className="mt-2" onClick={() => signOut()}>Logg ut</Button>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div >
            <div className="h-24 w-full" />
        </>
    )
}

function TopbarLink({ href, underlined, children }: { href: string, underlined?: boolean, children: React.ReactNode }) {
    return (
        <Link href={href} className={`p-2 h-16 w-24 flex justify-center align-middle rounded-lg hover:underline underline-offset-8 ${underlined && "underline"}`}>
            <div className="self-center font-normal">
                {children}
            </div>
        </Link>
    )
}