import { useState } from "react";
import Modal from "./modal";
import { LoadingSpinner } from "./icons";

export default function ConfirmationDialogue({ onConfirm, onCancel, message }: { onConfirm: () => void, onCancel: () => void, message: string }) {
    const [confirmLoading, setConfirmLoading] = useState(false);

    return (
        <Modal onClose={onCancel}>
            <div className="bg-white p-4 mt-2 rounded-md">
                <div className="text-lg">{message}</div>
                <div className="flex justify-center space-x-6 mt-4">
                    <button onClick={onCancel} className="bg-red-500 text-white rounded-md px-4 py-2 w-28 h-12">Nei</button>
                    <button onClick={() => { setConfirmLoading(true); onConfirm() }} className="bg-green-500 text-white rounded-md px-4 py-2 ml-2 w-28 h-12">{confirmLoading ? <LoadingSpinner /> : "Kjøøør"} </button>
                </div>
            </div>
        </Modal>
    )
}