"use client"

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react"
import { useCountdown } from "usehooks-ts"
import DetBrygges from "./detbrygges";

export default function BryggCountdown({ when }: { when: Date }) {
    const now = new Date()
    const diff = when.getTime() - now.getTime();
    const [loaded, setLoaded] = useState(false)
    const [sec, setSec] = useState(0);
    const [min, setMin] = useState(0);
    const [hour, setHour] = useState(0);
    const [days, setDays] = useState(0);

    const [cd, { startCountdown }] = useCountdown({
        countStart: Math.floor(diff / 1000),
        intervalMs: 1000,
    })

    useEffect(() => {
        setLoaded(true);
        startCountdown();
    }, [])

    useEffect(() => {
        setSec(Math.floor(cd) % 60);
        setMin(Math.floor(cd / 60) % 60);
        setHour(Math.floor(cd / 3600) % 24);
        setDays(Math.floor(cd / 86400));
    }, [cd])

    if (diff < 0) {
        return (
            <DetBrygges />
        )
    }

    return (
        <>
            <div className="font-normal text-xl">
                Neste brygging om:
            </div>
            <div className="flex flex-row h-18 space-x-8">
                {(loaded) &&
                    <>
                        <CountdownNumber number={days} dayText="dager" />
                        <CountdownNumber number={hour} dayText="timer" />
                        <CountdownNumber number={min} dayText="minutter" />
                        <CountdownNumber number={sec} dayText="sekunder" />
                    </>
                }
            </div >
        </>
    )
}

function CountdownNumber({ number, dayText }: { number: number, dayText: string }) {
    return (
        <div className="flex flex-col items-center">
            <AnimatePresence mode="popLayout">
                <motion.div className="text-3xl font-bold w-14 max-w-14 m-2 rounded-lg p-2 bg-neutral-100"
                    initial={{ opacity: 0, rotateX: -180 }}
                    animate={{ opacity: [0, 0, 1], y: 0, rotateX: 0 }}
                    exit={{ opacity: [1, 1, 0, 0, 0], scale: 1, rotateX: 180, x: [-8, -8], y: [-8, -8] }}
                    key={number}
                    transition={{ duration: 0.25 }}
                >
                    <div className="text-center">
                        {number > 9 ? number : `0${number}`}
                    </div>
                </motion.div>
            </AnimatePresence>
            {dayText}
        </div>
    )
}