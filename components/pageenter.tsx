"use client"

import { delay, motion } from "framer-motion";
import Topbar from "./topbar";

export default function PageEnter({ children }: { children: React.ReactNode }) {
    return (
        <>
            <motion.div
                className="h-screen w-screen z-[100] bg-white absolute top-0 left-0"
                initial={{ y: 0 }}
                animate={{ y: "-100vh" }}
                transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
            >
            </motion.div>
            <motion.div
                className="z-[100] relative"
                initial={{ y: "100vh" }}
                animate={{ y: 0 }}
                transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
            >
                <Topbar />
            </motion.div>
            {children}
        </>
    )
}