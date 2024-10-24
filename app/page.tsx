import BryggCountdown from "@/components/bryggcountdown";
import Image from "next/image";

export default function Home() {

    return (
        <div className="grid grid-cols-1 content-center justify-items-center">
            <BryggCountdown when={new Date(Date.parse("2024-10-24T06:23:28.757Z"))} />
            <Image src="/bh.webp" width={100} height={100} alt="logo" />
        </div>
    );
}
