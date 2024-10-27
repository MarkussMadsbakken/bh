"use client"
import NewQuoteButton from "@/components/quotes/newQuoteButton";
import QuoteComponent, { quoteWithReactions } from "@/components/quotes/quoteComponent";
import { permission } from "@/types/permissions";
import { PrismaClient, Quote } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

// IDEALLY this would be a server component!!!!!
// but refetching the quotes is just not a thing.
// Could be done with the server component fetching the quotes,
// and appending new quotes to the list.

export default function QuotesPage() {
    const session = useSession();
    const [loading, setLoading] = useState(true);
    const [quotes, setQuotes] = useState<quoteWithReactions[]>([]);

    const fetchQuotes = async () => {
        const res = await fetch("/api/quotes");
        const data = await res.json();
        setQuotes(data);
        setLoading(false);
    }

    useEffect(() => {
        fetchQuotes();
    }, [])

    // Check if user has access
    if (!session?.data?.user.role.permissions.includes(permission.viewquotes)) {
        return (
            <div className="h-96 flex flex-col justify-center">
                <div className="text-center">
                    <h1 className="text-2xl">Her har du ikke tilgang 😬</h1>
                    <p className="text-lg font-light">Logg deg inn og prøv på nytt</p>
                </div>
            </div>
        )
    }


    return (
        <>
            <div className="w-full flex-coc flex justify-center">
                {!loading && <QuoteComponent {...quotes[0]} />}
            </div>
            {session.data.user.role.permissions.includes(permission.createquote) && <NewQuoteButton />}
        </>
    )
}