import { auth } from "@/util/auth";
import Collapsible from "../collapsible";
import { User } from "@prisma/client";
import { TihldeUser } from "@/util/tihldeTypes";
import ProfilePic from "../profilepic";
import Image from "next/image";

export interface FineProps {
    id: string,
    amount: number,
    approved: boolean,
    payed: boolean,
    description: string,
    reason: string,
    defense: string,
    image: string,
    created_at: string,
    user: TihldeUser,
    created_by: TihldeUser,
}


export default async function Fine(props: FineProps) {
    const session = await auth();

    return (
        <Collapsible title={
            <div className="flex flex-col p-2 h-full w-full">
                <div className="flex flex-row h-full w-full text-lg justify-between">
                    <div className="flex flex-row items-center">
                        <Image src={props.user.image} alt="Profile picture" width={40} height={40} className="rounded-full mr-4" />
                        <div className="h-fit">
                            {props.user.first_name} {props.user.last_name}
                        </div>
                        <div className="ml-2 font-light">
                            {props.user.user_id === session?.user.name ? "(deg)" : ""}
                        </div>
                    </div>
                    <div className="mr-5 grid grid-cols-2 items-center space-x-2">
                        {props.approved ? <ApprovedIcon approved /> : <ApprovedIcon approved={false} />}
                        {props.payed ? <PayedIcon payed /> : <PayedIcon payed={false} />}
                    </div>
                </div>
                <div className="flex flex-row justify-between ml-2 text-sm">
                    <div>
                        {props.description}
                    </div>
                    <div className="mr-5 w-5 text-center">
                        {props.amount}
                    </div>
                </div>
            </div>

        }>
            <div className="flex flex-col bg-gray-100 p-4">
                <div className="flex-row justify-between">
                    <div className="whitespace-pre-wrap">
                        {props.reason}
                    </div>
                </div>
            </div>
        </Collapsible>
    )
}

export function FineSkeleton() {
    return (
        <Collapsible title={
            <div className="flex flex-col p-2 h-full w-full">
                <div className="flex flex-row h-full w-full text-lg justify-between">
                    <div className="flex flex-row items-center">
                        <div className="rounded-full animate-pulse h-10 w-10 bg-gray-300 mr-4" />
                        <div className="h-fit">
                            <div className="animate-pulse bg-gray-300 h-6 w-56 rounded-md" />
                        </div>
                    </div>
                    <div className="mr-5 grid grid-cols-2 items-center space-x-2">
                        <div className="animate-pulse bg-gray-300 h-4 w-4 rounded-md" />
                        <div className="animate-pulse bg-gray-300 h-4 w-4 rounded-md" />
                    </div>
                </div>
                <div className="flex flex-row justify-between ml-2 text-sm">
                    <div>
                        <div className="animate-pulse bg-gray-300 h-4 w-48 mt-1 rounded-md" />
                    </div>
                    <div className="mr-5 w-5 text-center">
                        <div className="animate-pulse bg-gray-300 h-4 w-6 rounded-md" />
                    </div>
                </div>
            </div>

        }>
            <div className="flex flex-col bg-gray-100 p-4">
                <div className="flex-row justify-between">
                    <div className="whitespace-pre-wrap">
                        <div className="animate-pulse bg-gray-300 h-4 w-96 rounded-md" />
                    </div>
                </div>
            </div>
        </Collapsible>

    )
}

function ApprovedIcon({ approved }: { approved: boolean }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className={`w-4 h-4 stroke-[1.5px] ${approved ? "text-green-500" : "text-red-500"}`}>
            <path d="M20 6 9 17l-5-5"></path>
        </svg>
    )
}

function PayedIcon({ payed }: { payed: boolean }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className={`w-4 h-4 stroke-[1.5px] ${payed ? "text-green-500" : " text-red-500"}`}>
            <path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17"></path>
            <path d="m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9"></path>
            <path d="m2 16 6 6"></path>
            <circle cx="16" cy="9" r="2.9"></circle>
            <circle cx="6" cy="5" r="3"></circle>
        </svg>
    )
}
