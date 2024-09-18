

/* libs */
import React, { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import Link from '@tiptap/extension-link'


/* components */
import BubbleMenu from "@/components/tiptap/BubbleMenu";
import ToolBar from "@/components/tiptap/ToolBar";

/* Styles */
import scss from  '@/libs/sendBox/template/style.module.scss'

type Props = {
  className?: string;
  isBubbleMenu: boolean;
  isToolBar: boolean;
  myContent: string;
  editorContent: (content: string) => void;
};

function MyTiptap ({ className, isBubbleMenu, isToolBar, myContent , editorContent }: Props) {
  const editor = useEditor({
    extensions: [StarterKit , TextAlign.configure({ types: ['heading', 'paragraph'] }), Highlight, Table, TableCell, TableHeader, TableRow, Link],
    content: myContent,
    onUpdate: ({ editor }) => {
      editorContent(editor.getHTML());
    }
  });

  if (!editor) return null;

  return (
    <div className="flex flex-col gap-2 items-center justify-center">
      {isBubbleMenu && <BubbleMenu editor={editor} />}
      {isToolBar && <ToolBar editor={editor} />}
      <EditorContent editor={editor} className={`${className} ${scss.templateEmail}`} />
    </div>
  );
};

export default MyTiptap;
