"use client"

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react"
import { useCountdown } from "usehooks-ts"

export default function BryggCountdown({ when }: { when: Date }) {
    const now = new Date()
    const diff = when.getTime() - now.getTime();
    const [loaded, setLoaded] = useState(false)
    const [sec, setSec] = useState(0);
    const [min, setMin] = useState(0);
    const [hour, setHour] = useState(0);
    const [days, setDays] = useState(0);

    const [cd, { startCountdown, stopCountdown }] = useCountdown({
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

    return (
        <>
            Neste brygging om:
            <div className="flex flex-row h-14">
                {(loaded) &&
                    <>
                        <CountdownNumber number={days} />
                        <CountdownNumber number={hour} />
                        <CountdownNumber number={min} />
                        <CountdownNumber number={sec} />
                    </>
                }
            </div >
        </>
    )
}

function CountdownNumber({ number }: { number: number }) {
    return (
        <AnimatePresence mode="popLayout">
            <motion.div className="text-3xl font-bold w-10 max-w-10 m-2"
                initial={{ opacity: 0, rotateX: -180 }}
                animate={{ opacity: [0, 0, 1], y: 0, rotateX: 0 }}
                exit={{ opacity: [1, 1, 0, 0, 0], scale: 1, rotateX: 180, x: [-8.5, -8.5], y: [-8, -8] }}
                key={number}
                transition={{ duration: 0.25 }}
            >
                {number > 9 ? number : `0${number}`}
            </motion.div>
        </AnimatePresence>
    )
}