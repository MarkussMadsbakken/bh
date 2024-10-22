"use client"

import { signOut, useSession } from "next-auth/react"
import Image from "next/image";
import { useEffect, useState } from "react";
import LoginModal from "./loginmodal";

export default function Sidebar() {
    const session = useSession();
    const [loginModalOpen, setLoginModalOpen] = useState(false);

    let imgLink = null;

    console.log(session.data)

    const [imageLink, setImageLink] = useState("");

    useEffect(() => {
        if (session.data) {
            fetch(`https://api.tihlde.org/users/${session.data.user.name}/`, {
                headers: {
                    "X-Csrf-Token": session.data.user.token,
                }
            }).then(res => res.json()).then(data => {
                setImageLink(data.image);
            })
        }
    })

    return (
        <div className="absolute right-0 top-0 h-full flex">
            <div className="p-4">
                <button onClick={() => {
                    if (!session.data?.user) {
                        setLoginModalOpen(true);
                    }
                }}>
                    {imageLink !== "" ?
                        <Image src={imageLink} width={50} height={50} alt="Profile picture" />
                        : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                        </svg>
                    }
                </button>
            </div>
            {loginModalOpen && <LoginModal onCancel={() => setLoginModalOpen(false)} onFinish={() => setLoginModalOpen(false)} />}
        </div>
    )
}