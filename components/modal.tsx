"use client"
import { useClickOutside } from "@/util/hooks";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";

interface ModalProps {
    onClose?: () => void;
    children: React.ReactNode;
}

export default function Modal(props: ModalProps) {
    const tabs = React.Children.map(props.children, (child) => {
        if (!React.isValidElement(child)) {
            return null;
        }
        return child.type === ModalTab ? child : null;
    })?.filter((tab) => tab !== null);

    const [activeTab, setActiveTab] = useState(0);
    const tabNames = tabs?.map((tab) => tab?.props.name);
    const modalRef = React.useRef<HTMLDivElement>(null);

    const tabContentVariants = {
        visible: { opacity: 1, x: 0 },
        left: { opacity: 0, x: -200 },
        right: { opacity: 0, x: 200 },
    }

    useClickOutside(modalRef, () => {
        props.onClose?.();
    })

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15, ease: "easeOut" }} role="dialog" className="relative z-[999]" aria-labelledby="modal-title" aria-modal="true">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <div className="fixed inset-0 z-10 w-screen">
                <div className="flex min-h-screen items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <motion.div ref={modalRef} layout transition={{ duration: 0.15 }} className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl sm:my-8 sm:max-w-4xl max-h-[50vh] sm:max-h-[80vh] overflow-y-auto h-fit w-fit">
                        {(tabs && tabs.length != 0) &&
                            <>
                                <div className={`grid grid-cols-${tabs.length} shadow-inner`}>
                                    {tabNames?.map((name, index) => (
                                        <button key={index} onClick={() => setActiveTab(index)} className={`p-2 transition-colors ${activeTab === index ? "bg-neutral-50 " : "bg-neutral-200 hover:bg-neutral-100"}`}>
                                            {name}
                                        </button>
                                    ))}
                                </div>
                                <div className="p-4 w-full">
                                    {props.onClose !== null &&
                                        <button onClick={props.onClose} className="absolute z-30 right-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    }
                                    <AnimatePresence>
                                        {tabs.map((tab, i) => {
                                            const isLastElement = i === tabs.length - 1;

                                            return (
                                                <motion.div
                                                    key={i}
                                                    initial={false}
                                                    animate={activeTab == i ? "visible" : isLastElement ? "right" : "left"}
                                                    variants={tabContentVariants}
                                                    transition={{ duration: 0.2, type: "spring" }}
                                                    className="relative"
                                                >
                                                    {activeTab == i && tab
                                                    }
                                                </motion.div>
                                            )
                                        })}
                                    </AnimatePresence>
                                </div>
                            </>
                        }

                        {(!tabs || tabs.length == 0) &&
                            <div className="p-4 w-fit">
                                {props.onClose !== null &&
                                    <button onClick={props.onClose} className="absolute z-30 right-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                }
                                {props.children}
                            </div>
                        }
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function ModalTab({ children, name }: Readonly<{ children: React.ReactNode, name: string }>) {
    return (
        <div className="flex flex-col">
            {children}
        </div>
    );
}