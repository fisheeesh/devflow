"use client";

import {
    headingsPlugin,
    listsPlugin,
    quotePlugin,
    thematicBreakPlugin,
    markdownShortcutPlugin,
    MDXEditor,
    ConditionalContents,
    ChangeCodeMirrorLanguage,
    toolbarPlugin,
    UndoRedo,
    Separator,
    BoldItalicUnderlineToggles,
    ListsToggle,
    CreateLink,
    InsertImage,
    InsertTable,
    InsertThematicBreak,
    InsertCodeBlock,
    linkPlugin,
    linkDialogPlugin,
    tablePlugin,
    imagePlugin,
    codeBlockPlugin,
    codeMirrorPlugin,
    diffSourcePlugin,
    BlockTypeSelect,
    type MDXEditorMethods,
} from "@mdxeditor/editor";
import { basicDark } from "cm6-theme-basic-dark";
import { useTheme } from "next-themes";
import { forwardRef, Ref } from "react";

import "@mdxeditor/editor/style.css";
import "./dark-editor.css";

interface Props {
    value: string;
    fieldChange: (value: string) => void;
}

const Editor = forwardRef<MDXEditorMethods, Props>(
    ({ value, fieldChange, ...props }, ref: Ref<MDXEditorMethods>) => {
        const { resolvedTheme } = useTheme();
        const theme = resolvedTheme === "dark" ? [basicDark] : [];

        return (
            <MDXEditor
                key={resolvedTheme}
                markdown={value}
                ref={ref}
                className="background-light800_dark200 light-border-2 markdown-editor dark-editor grid w-full border"
                onChange={fieldChange}
                plugins={[
                    headingsPlugin(),
                    listsPlugin(),
                    linkPlugin(),
                    linkDialogPlugin(),
                    quotePlugin(),
                    thematicBreakPlugin(),
                    markdownShortcutPlugin(),
                    tablePlugin(),
                    imagePlugin(),
                    codeBlockPlugin({ defaultCodeBlockLanguage: "js" }),
                    codeMirrorPlugin({
                        codeBlockLanguages: {
                            html: "HTML",
                            css: "CSS",
                            js: "Javascript",
                            ts: "Typescript",
                            tsx: "TypeScript (React)",
                            jsx: "JavaScript (React)",
                            java: "Java",
                            python: 'Python',
                            sql: "SQL",
                            markdown: "Markdown",
                        },
                        autoLoadLanguageSupport: true,
                        codeMirrorExtensions: theme,
                    }),
                    diffSourcePlugin({ viewMode: "rich-text", diffMarkdown: "" }),
                    toolbarPlugin({
                        toolbarContents: () => (
                            <ConditionalContents
                                options={[
                                    {
                                        when: (editor) =>
                                            editor?.editorType === "codeblock",
                                        contents: () => <ChangeCodeMirrorLanguage />,
                                    },
                                    {
                                        fallback: () => (
                                            <>
                                                <UndoRedo />
                                                <Separator />
                                                <BlockTypeSelect />
                                                <Separator />
                                                <BoldItalicUnderlineToggles />
                                                <Separator />
                                                <ListsToggle />
                                                <Separator />
                                                <CreateLink />
                                                <InsertImage />
                                                <Separator />
                                                <InsertTable />
                                                <InsertThematicBreak />
                                                <InsertCodeBlock />
                                            </>
                                        ),
                                    },
                                ]}
                            />
                        ),
                    }),
                ]}
                {...props}
            />
        );
    }
);

Editor.displayName = "Editor";

export default Editor;