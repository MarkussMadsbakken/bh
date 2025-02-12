"use client"

import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function ProfilePic({ onclick, userid, className }: { onclick?: () => void, userid: string, className?: string }) {

    const session = useSession();
    const [imageLink, setImageLink] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (session.data) {
            fetch(`/api/users/${userid}/pfp`)
                .then(res => res.json()).then(data => {
                    if (!data) {
                        console.log("No image found for user", userid);
                        setLoading(false);
                        return;
                    }
                    setImageLink(data);
                    setLoading(false);
                })
        } else {
            if (session.status !== "loading") {
                setLoading(false);
            }
        }
    }, [session])

    return (
        <div className={`flex h-fit w-20 justify-center ${className} `}>
            <button
                className="w-full h-full"
                onClick={() => {
                    if (loading) return;
                    onclick?.();
                }}>
                {imageLink !== "" ?
                    <Image src={imageLink} width={75} height={75} alt="Profile picture" />
                    : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`size-10 ${loading ? "animate-pulse opacity-0" : ""}`}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                }
            </button>
        </div>
    )

}
