"use client"

import { signOut, useSession } from "next-auth/react"

export default function Sidebar() {
    const session = useSession();

    console.log(session);

    return (
        <></>
    )
}