import BryggCountdown from "@/components/bryggcountdown";
import Posts from "@/components/posts/posts";
import Separator from "@/components/separator";
import Image from "next/image";
import { Suspense } from "react";

export default function Home() {
    return (
        <div className="grid grid-cols-1 content-center justify-items-center mt-10 space-y-10">
            <div className="w-full text-center space-y-5 mb-16">
                <Image src="/bh.webp" width={150} height={150} alt="logo" className="m-auto" />
                <h1 className="font-semibold text-2xl">Tihlde BH</h1>
                <p className="text-xl"> Velkommen til brygg og hygg!</p>
            </div>
            <BryggCountdown when={new Date(Date.parse("2025-01-10T06:23:28.757Z"))} />
            <Posts />
            <Footer />
        </div>
    );
}

const Footer = () => {
    return (
        <footer className="w-full text-center text-4x font-light py-20 bg-[#fae296]">
            <Image src="/bh.webp" width={100} height={100} alt="logo" className="m-auto" />
            <h2 className="p-2">© Tihlde BH</h2>
        </footer>
    )
}
