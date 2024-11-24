import BryggCountdown from "@/components/bryggcountdown";
import NewPostButton from "@/components/posts/newPostButton";
import Posts from "@/components/posts/posts";
import { permission } from "@/types/permissions";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function Home() {
    return (
        <div className="grid grid-cols-1 content-center justify-items-center mt-10">
            <BryggCountdown when={new Date(Date.parse("2024-12-10T06:23:28.757Z"))} />
            <Image src="/bh.webp" width={100} height={100} alt="logo" />
            <Posts />
        </div>
    );
}
