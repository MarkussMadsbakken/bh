"use client"

import { signOut, useSession } from "next-auth/react"
import Image from "next/image";
import { useEffect, useState } from "react";
import LoginModal from "./loginmodal";
import ProfilePic from "./profilepic";

export default function Topbar() {
    const session = useSession();
    const [loginModalOpen, setLoginModalOpen] = useState(false);

    return (
        <div className="left-0 top-0 w-screen flex flex-row h-20">
            <ProfilePic userid={session.data?.user.name || ""} onclick={() => {
                if (!session.data?.user) {
                    setLoginModalOpen(true);
                }
            }} className="ml-auto flex h-20 w-20 justify-center align-middle" />
            {loginModalOpen && <LoginModal onCancel={() => setLoginModalOpen(false)} onFinish={() => setLoginModalOpen(false)} />}
        </div>
    )
}