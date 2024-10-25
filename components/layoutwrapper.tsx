import { LoginProvider } from "@/util/loginprovider";
import { SessionProvider } from "next-auth/react";
export default function LayoutWrapper({
    children,
}: Readonly<{ children: React.ReactNode }>) {

    return (
        <SessionProvider>
            <LoginProvider>
                {children}
            </LoginProvider>
        </SessionProvider>
    )
}