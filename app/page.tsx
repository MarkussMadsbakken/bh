"use client"
import { Button } from "@/components/input";
import LoginModal from "@/components/loginmodal";
import { auth } from "@/util/auth";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";

export default function Home() {

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 ">
            <Image src="/bh.webp" width={100} height={100} alt="logo" />
        </div>
    );
}
