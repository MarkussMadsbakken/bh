"use client"
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function Collapsible({
    title,
    children,
    startOpen = false,
}: Readonly<{
    title: React.ReactNode;
    children: React.ReactNode;
    startOpen?: boolean;
}>) {
    const [open, setOpen] = useState(startOpen);

    return (
        <div className="rounded-lg mb-4 bg-neutral-100 h-fit overflow-hidden">
            <div
                className="flex items-center justify-between p-4 cursor-pointer h-full"
                onClick={() => setOpen(!open)}
            >
                <h2 className="text-lg font-semibold">{title}</h2>
                <svg
                    className={`w-6 h-6 transition-transform transform ${open ? "rotate-180" : ""
                        }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </div>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                    >
                        <div className="p-4 border-t border-gray-300">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}