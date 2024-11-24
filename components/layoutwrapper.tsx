"use client"
import { LoginProvider } from "@/util/loginprovider";
import { ModalProvider } from "@/util/modalProvider";
import { SessionProvider } from "next-auth/react";
import { useEffect } from "react";
export default function LayoutWrapper({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    useEffect(() => {
        console.log(`%c laget av:             %c
                                                              
     /$$       /$$                                            
    | $$      | $$                                            
    | $$$$$$$ | $$$$$$$                                       
    | $$__  $$| $$__  $$                                      
    | $$  \\\ $$| $$  \\\ $$                                      
    | $$  | $$| $$  | $$                                      
    | $$$$$$$/| $$  | $$                                      
    |_______/ |__/  |__/                                      
                                                              
     /$$                 /$$           /$$                    
    |__/                | $$          | $$                    
     /$$ /$$$$$$$   /$$$$$$$  /$$$$$$ | $$   /$$  /$$$$$$$    
    | $$| $$__  $$ /$$__  $$ /$$__  $$| $$  /$$/ /$$_____/    
    | $$| $$  \\\ $$| $$  | $$| $$$$$$$$| $$$$$$/ |  $$$$$$     
    | $$| $$  | $$| $$  | $$| $$_____/| $$_  $$  \\\____  $$    
    | $$| $$  | $$|  $$$$$$$|  $$$$$$$| $$ \\\  $$ /$$$$$$$n    
    |__/|__/  |__/ \\\_______/ \\\_______/|__/  \\\__/ |_______/    \n\n`, "color: ; font-size: 27px; font-family: monospace;background-color: #fcbd20; font-weight: bold; text-align:center;", "color: ; font-size: 10px; font-family: monospace;background-color: #fcbd20; font-weight: bold");

    }, []);

    return (
        <SessionProvider>
            <LoginProvider>
                <ModalProvider>
                    {children}
                </ModalProvider>
            </LoginProvider>
        </SessionProvider>
    )
}