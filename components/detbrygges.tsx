import { motion } from "framer-motion"

export default function DetBrygges() {
    return (
        <motion.div className='bg-red-500 z-10'
            initial={{ opacity: 0, scaleX: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleX: 1, scaleY: 1 }}
            transition={{ duration: 0.75, ease: "easeOut" }}
        >
            <div className="relative w-screen p-16 overflow-x-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
                <div className="flex absolute left-0 animate-marquee-infinite w-fit h-full top-0">
                    <ScrollContent />
                    <ScrollContent />
                </div>
            </div>
        </motion.div>
    )
}

function ScrollContent() {
    return (
        <div className="w-screen flex flex-row space-2 justify-around align-middle [&>*]:self-center">
            <div>
                Det brygges!!!!
            </div>

            <div>
                Det brygges!!!!
            </div>

        </div>
    )
}