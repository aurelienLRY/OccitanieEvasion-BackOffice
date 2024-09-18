import { Editor } from "@tiptap/react";

import {
  RiBold,
  RiItalic,
  RiStrikethrough,
  RiH1,
  RiH2,
  RiH3,
  RiH4,
  RiH5,
  RiH6,
  RiParagraph,
  RiListOrdered,
  RiListUnordered,
  RiDoubleQuotesL,
  RiSeparator,
  RiTextWrap,
  RiArrowGoBackLine,
  RiArrowGoForwardLine,
} from "react-icons/ri";

import { Tooltip } from "antd";

const ToolBar = ({ editor }: { editor: Editor }) => {
  return (
    <div className="flex flex-row gap-1 items-center border border-orange-600 rounded-md p-2">
        <button
        className={isActive(editor, "bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Tooltip title="Bold">
          <RiBold />
        </Tooltip>
      </button>

      <button
        className={isActive(editor, "italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Tooltip title="Italic">
          <RiItalic />
        </Tooltip>
      </button>
      <button
        className={isActive(editor, "strike")}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Tooltip title="Barré">
          <RiStrikethrough />
        </Tooltip>
      </button>

      <div className=" text-orange-600">|</div>

      <button
        className={isActive(editor, 'heading', { level: 1 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        <Tooltip title="H1">
          <RiH1 />
        </Tooltip>
      </button>
      <button
        className={isActive(editor, 'heading', { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Tooltip title="H2">
          <RiH2 />
        </Tooltip>
      </button>
      <button
        className={isActive(editor, 'heading', { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <Tooltip title="H3">
          <RiH3 />
        </Tooltip>
      </button>
      <button
        className={isActive(editor, 'heading', { level: 4 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
      >
        <Tooltip title="H4">
          <RiH4 />
        </Tooltip>
      </button>
      <button
        className={isActive(editor, 'heading', { level: 5 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
      >
        <Tooltip title="H5">
          <RiH5 />
        </Tooltip>
      </button>
      <button
        className={isActive(editor, 'heading', { level: 6 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
      >
        <Tooltip title="H6">
          <RiH6 />
        </Tooltip>
      </button>

      <div className=" text-orange-600">|</div>

      <button
        className={isActive(editor, "paragraph")}
        onClick={() => editor.chain().focus().setParagraph().run()}
      >
        <Tooltip title="P">
          <RiParagraph />
        </Tooltip>
      </button>
      <button
        className={isActive(editor, "bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <Tooltip title="Liste ordonnée">
          <RiListOrdered />
        </Tooltip>
      </button>
      <button
        className={isActive(editor, "bulletList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <Tooltip title="Liste non ordonnée">
          <RiListUnordered />
        </Tooltip>
      </button>
      <button
        className={isActive(editor, "horizontalRule")}
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      >
        <Tooltip title="Séparateur">
          <RiSeparator />
        </Tooltip>
      </button>

      <button
        className={isActive(editor, "blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Tooltip title="Citation">
          <RiDoubleQuotesL />
        </Tooltip>
      </button>

      <button
        className={isActive(editor, "hardBreak")}
        onClick={() => editor.chain().focus().setHardBreak().run()}
      >
        <Tooltip title="Saut de ligne">
          <RiTextWrap />
        </Tooltip>
      </button>

      <div className=" text-orange-600">|</div>

      <button
        className={isActive(editor, "undo")}
        onClick={() => editor.chain().focus().undo().run()}
      >
        <Tooltip title="Annuler">
          <RiArrowGoBackLine />
        </Tooltip>
      </button>


      <button
        className={isActive(editor, "redo")}
        onClick={() => editor.chain().focus().redo().run()}
      >
        <Tooltip title="Rétablir">
          <RiArrowGoForwardLine  />
        </Tooltip>
      </button>
    </div>
  );
};

export default ToolBar;



const isActive = (editor: any, type: string, options?: any) => {
    return `hover:text-gray-400 ${editor.isActive(type, options) ? "text-orange-500 font-bold" : "text-white"}`
 }