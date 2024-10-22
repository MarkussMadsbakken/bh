import { SessionProvider } from "next-auth/react";
export default function LayoutWrapper({
    children,
}: Readonly<{ children: React.ReactNode }>) {

    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    )
}