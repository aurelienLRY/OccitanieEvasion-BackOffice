import { BubbleMenu as TipTapBubbleMenu } from "@tiptap/react";
import {
  RiBold,
  RiItalic,
  RiStrikethrough,
  RiCodeSSlashLine,
  RiEmotionLine,
  RiH1,
  RiH2,
  RiH3,
  RiH4,
  RiH5,
  RiH6,
  RiParagraph,
  RiListOrdered,
  RiListUnordered,
  RiCodeBoxLine,
  RiDoubleQuotesL,
  RiSeparator,
  RiTextWrap,
  RiFormatClear,
  RiArrowGoBackLine,
  RiArrowGoForwardLine,
  RiAlignJustify,
  RiAlignLeft,
  RiAlignCenter,
  RiAlignRight,
} from "react-icons/ri";
import { PiHighlighterLight } from "react-icons/pi";

import { Tooltip } from "antd";

type Props = {
  editor: any;
};

export default function BubbleMenu({ editor }: Props) {
  if (!editor) return null;
  return (
    <TipTapBubbleMenu
      editor={editor}
      className="flex flex-col items-center md:flex-row md:gap-1 bg-slate-500 px-2 py-1  rounded-md md:min-w-fit"
    >
      <div className="flex flex-row gap-1 items-center justify-center">
        <button
          className={isActive(editor, "bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          {thisIcon(<RiBold />, "Bold")}
        </button>

        <button
          className={isActive(editor, "italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          {thisIcon(<RiItalic />, "Italic")}
        </button>
        <button
          className={isActive(editor, "strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          {thisIcon(<RiStrikethrough />, "Barré")}
        </button>
      </div>

      <div className=" text-orange-600 rotate-90 md:rotate-0 ">|</div>

      <div className="flex flex-row gap-1 items-center justify-center">
        <button
          className={isActive(editor, "heading", { level: 1 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
        >
          {thisIcon(<RiH1 />, "H1")}
        </button>
        <button
          className={isActive(editor, "heading", { level: 2 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          {thisIcon(<RiH2 />, "H2")}
        </button>
        <button
          className={isActive(editor, "heading", { level: 3 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          {thisIcon(<RiH3 />, "H3")}
        </button>
        <button
          className={isActive(editor, "heading", { level: 4 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 4 }).run()
          }
        >
          {thisIcon(<RiH4 />, "H4")}
        </button>
        <button
          className={isActive(editor, "heading", { level: 5 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 5 }).run()
          }
        >
          {thisIcon(<RiH5 />, "H5")}
        </button>
        <button
          className={isActive(editor, "heading", { level: 6 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 6 }).run()
          }
        >
          {thisIcon(<RiH6 />, "H6")}
        </button>
      </div>
      <div className=" text-orange-600 rotate-90 md:rotate-0  ">|</div>

      <div className="flex flex-row gap-1 items-center justify-center">
        <button
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          className={isActive(editor, "highlight")}
        >
          {thisIcon(<PiHighlighterLight />, "Surligner")}
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={isActive(editor, "textAlign", { textAlign: "left" })}
        >
          {thisIcon(<RiAlignLeft />, "Aligner à gauche")}
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={isActive(editor, "textAlign", { textAlign: "center" })}
        >
          {thisIcon(<RiAlignCenter />, "Centrer")}
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={isActive(editor, "textAlign", { textAlign: "right" })}
        >
          {thisIcon(<RiAlignRight />, "Aligner à droite")}
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          className={isActive(editor, "textAlign", { textAlign: "justify" })}
        >
          {thisIcon(<RiAlignJustify />, "Justifier")}
        </button>
      </div>
      <div className=" text-orange-600 rotate-90 md:rotate-0  ">|</div>

      <div className="flex flex-row gap-1 items-center justify-center">
        <button
          className={isActive(editor, "paragraph")}
          onClick={() => editor.chain().focus().setParagraph().run()}
        >
          {thisIcon(<RiParagraph />, "Paragraphe")}
        </button>
        <button
          className={isActive(editor, "bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          {thisIcon(<RiListOrdered />, "Liste ordonnée")}
        </button>
        <button
          className={isActive(editor, "bulletList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          {thisIcon(<RiListUnordered />, "Liste non ordonnée")}
        </button>
        <button
          className={isActive(editor, "horizontalRule")}
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          {thisIcon(<RiSeparator />, "Séparateur")}
        </button>

        <button
          className={isActive(editor, "blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          {thisIcon(<RiDoubleQuotesL />, "Citation")}
        </button>

        <button
          className={isActive(editor, "hardBreak")}
          onClick={() => editor.chain().focus().setHardBreak().run()}
        >
          {thisIcon(<RiTextWrap />, "Saut de ligne")}
        </button>
      </div>
      <span className=" text-orange-600 rotate-90 md:rotate-0">|</span>

      <div className="flex flex-row gap-1 items-center justify-center">
        <button
          className={isActive(editor, "undo")}
          onClick={() => editor.chain().focus().undo().run()}
        >
          {thisIcon(<RiArrowGoBackLine />, "Annuler")}
        </button>

        <button
          className={isActive(editor, "redo")}
          onClick={() => editor.chain().focus().redo().run()}
        >
          {thisIcon(<RiArrowGoForwardLine />, "Rétablir")}
        </button>
      </div>
    </TipTapBubbleMenu>
  );
}

const isActive = (editor: any, type: string, options?: any) => {
  return `hover:text-gray-400 ${
    editor.isActive(type, options) ? "text-orange-500 font-bold" : "text-white"
  }`;
};

const thisIcon = (icon: any, title: string) => {
  return <Tooltip title={title}>{icon}</Tooltip>;
};
