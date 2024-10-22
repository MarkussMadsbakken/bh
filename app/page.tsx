"use client"
import { Button } from "@/components/input";
import LoginModal from "@/components/loginmodal";
import { auth } from "@/util/auth";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";

export default function Home() {
    const session = useSession();

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <Image src="/bh.webp" width={100} height={100} alt="logo" />
            <Button onClick={() => signOut()}>Sign out</Button>
        </div>
    );
}
