"use client";

import { BoldItalicUnderlineToggles, InsertImage, KitchenSinkToolbar, ListsToggle, MDXEditor, MDXEditorMethods, StrikeThroughSupSubToggles, UndoRedo, codeBlockPlugin, codeMirrorPlugin, diffSourcePlugin, directivesPlugin, frontmatterPlugin, headingsPlugin, imagePlugin, linkDialogPlugin, linkPlugin, listsPlugin, markdownShortcutPlugin, quotePlugin, sandpackPlugin, tablePlugin, thematicBreakPlugin, toolbarPlugin } from "@mdxeditor/editor";
import { FC } from "react";

interface EditorProps {
    markdown: string;
    editorRef?: React.RefObject<MDXEditorMethods | null>;
}

/**
 * Extend this Component further with the necessary plugins or props you need.
 * proxying the ref is necessary. Next.js dynamically imported components don't support refs.
 */
const Editor: FC<EditorProps> = ({ markdown, editorRef }) => {
    return (
        <MDXEditor
            markdown={markdown}
            ref={editorRef}
            plugins={[
                toolbarPlugin({ toolbarContents: () => <KitchenSinkToolbar /> }),
                listsPlugin(),
                quotePlugin(),
                headingsPlugin(),
                linkPlugin(),
                linkDialogPlugin(),
                imagePlugin(),
                tablePlugin(),
                thematicBreakPlugin(),
                frontmatterPlugin(),
                codeBlockPlugin({ defaultCodeBlockLanguage: 'txt' }),
                codeMirrorPlugin({ codeBlockLanguages: { js: 'JavaScript', css: 'CSS', txt: 'text', tsx: 'TypeScript' } }),
                diffSourcePlugin({ viewMode: 'rich-text', diffMarkdown: 'boo' }),
                markdownShortcutPlugin()
            ]}
        />
    )
};

export default Editor;