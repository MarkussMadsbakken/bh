import BryggCountdown from "@/components/bryggcountdown";
import Posts from "@/components/posts/posts";
import Separator from "@/components/separator";
import Image from "next/image";

export default function Home() {
    return (
        <div className="grid grid-cols-1 content-center justify-items-center mt-10 space-y-10">
            <BryggCountdown when={new Date(Date.parse("2025-01-10T06:23:28.757Z"))} />
            <Separator />
            <Posts />
            <Footer />
        </div>
    );
}

const Footer = () => {
    return (
        <footer className="w-full text-center text-4x font-light py-20 bg-amber-200">
            <Image src="/bh.webp" width={100} height={100} alt="logo" className="m-auto" />
            <h2 className="p-2">© Tihlde BH</h2>
        </footer>
    )
}
