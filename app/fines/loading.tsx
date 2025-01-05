import { FineSkeleton } from "@/components/fines/fine";

export default function Loading() {
    return (
        <div className="w-screen flex flex-col">
            <div className="w-5/6 self-center">
                {[1, 2, 3, 4, 5].map((key) => {
                    return (
                        <div className="m-4" key={key}>
                            <FineSkeleton />
                        </div>
                    )
                })}
            </div>
        </div >
    )
}