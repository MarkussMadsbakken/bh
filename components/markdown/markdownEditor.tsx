"use client";
import { Suspense, useState } from "react";
import dynamic from "next/dynamic";

const EditorComponent = dynamic(() => import("./editorComponent"), { ssr: false });

export default function MarkdownEditor() {
    return (
        <div className="w-full h-full p-10">
            <div className="w-full h-full bg-white rounded-md p-2">
                <Suspense fallback={<div>Loading...</div>}>
                    <EditorComponent markdown="## hei!" />
                </Suspense>
            </div>
        </div>
    )

}