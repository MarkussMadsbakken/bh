"use client";
import { Suspense, useState } from "react";
import dynamic from "next/dynamic";
import '@mdxeditor/editor/style.css'

const EditorComponent = dynamic(() => import("./editorComponent"), { ssr: false });

export default function MarkdownEditor() {
    return (
        <div className="w-full h-full p-10">
            <div className="w-full h-full bg-white rounded-xl">
                <Suspense fallback={<div>Loading...</div>}>
                    <EditorComponent markdown="## hei!" />
                </Suspense>
            </div>
        </div>
    )

}