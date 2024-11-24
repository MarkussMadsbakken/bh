"use client";

import { useCallback, useState } from "react";
import Dropzone from "react-dropzone";
import { motion } from "framer-motion";
import { useUserImage } from "@/util/minio";

export function ImageUpload({ onUpload }: { onUpload?: (filename: string) => void }) {
    const iconVariants = {
        hidden: {
            translateY: -20,
            opacity: 0
        },
        visible: {
            translateY: 0,
            opacity: 1
        },
    }

    const [loading, setLoading] = useState(false);

    const uploadFile = async (file: any) => {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/storage/images/", {
            method: "POST",
            body: formData
        });
        if (res.ok) {
            setLoading(false);
            const data = await res.json();

            // This should be using useUserImage, but that somehow breaks everything...
            // cool!
            onUpload?.(`http://bh.tihlde.org:9000/user-image/${data.image}`);
        }
    };

    return (
        <Dropzone onDrop={useCallback((acceptedFiles: any) => {
            setLoading(true);
            uploadFile(acceptedFiles[0]);
        }, [])}>
            {({ getRootProps, getInputProps, isDragActive }) => (
                <div {...getRootProps()}
                    className={`border w-full max-w-full h-full max-h-full box-border flex justify-center align-middle border-neutral-200 rounded-lg p-6 cursor-pointer transition-all shadow-lg ${isDragActive ? 'bg-blue-50 shadow-lg' : 'hover:bg-blue-50 hover:shadow-lg'
                        }`}>
                    <input {...getInputProps()} />
                    <div className="flex w-full h-full justify-center align-middle items-center">
                        <motion.h3
                            initial="hidden"
                            animate={isDragActive && !loading ? "visible" : "hidden"}
                            variants={iconVariants}
                            className="absolute text-lg font-medium"
                        >
                            Drop to upload
                        </motion.h3>
                        <motion.div
                            initial="visible"
                            animate={isDragActive || loading ? "hidden" : "visible"}
                            variants={iconVariants}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                            </svg>
                        </motion.div>
                        <motion.div
                            initial="hidden"
                            animate={loading ? "visible" : "hidden"}
                            variants={iconVariants}
                            className="absolute"
                            hidden={!loading}
                        >
                            <svg aria-hidden="true" className="inline w-8 h-8 [&&]:text-neutral-200 animate-spin [&&]:fill-neutral-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                            </svg>
                        </motion.div>
                    </div>
                </div>
            )}
        </Dropzone>
    );

}