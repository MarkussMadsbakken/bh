import { auth } from "@/util/auth";
import Collapsible from "../collapsible";
import { User } from "@prisma/client";

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
    user: User,
    created_by: User,
}


export default async function Fine(props: FineProps) {
    const session = await auth();

    return (
        <Collapsible title={
            <div className="flex flex-row h-full w-full justify-center  ">
                {props.user.username == session?.user.name ? <h1> din </h1> : <h1> {props.created_by.username} </h1>}
            </div>
        }>
            <div className="flex flex-col bg-gray-100 p-4 rounded-lg shadow-md">
                <div className="flex justify-between">
                    <h1 className="text-xl font-bold">{props.amount} kr</h1>
                    <h2 className="text-sm">{props.created_at}</h2>
                </div>
                <div className="flex justify-between">
                    <h3 className="text-sm">{props.description}</h3>
                    <h4 className="text-sm">{props.payed ? "Betalt" : "Ikke betalt"}</h4>
                </div>
            </div>
        </Collapsible>
    )
}