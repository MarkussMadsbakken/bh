
export default function Warning({ title, className }: { title: string, className?: string }) {
    return (
        <div className={`bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded flex flex-row space-x-2 align-middle items-center ${className ?? ""}`} role="alert">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
            <strong className="font-bold text-sm text-center h-fit">{title}</strong>
        </div>
    )
}
