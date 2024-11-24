"use client";
import { Suspense, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { MDXEditorMethods } from "@mdxeditor/editor";

const EditorComponent = dynamic(() => import("./editorComponent"), { ssr: false });

export default function MarkdownEditor({ editorRef, content, editable }: { editorRef?: React.RefObject<MDXEditorMethods | null>, content?: string, editable?: boolean }) {
    return (
        <div className="w-full h-full bg-white rounded-md">
            <Suspense fallback={<div>Loading...</div>}>
                <EditorComponent markdown={content ?? ""} editorRef={editorRef} editable={editable ?? true} />
            </Suspense>
        </div>
    )

}