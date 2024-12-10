import React from "react";
import { Editor } from "@tinymce/tinymce-react";

/* components */
import { Modal } from "@/components";

type Props = {
  Mail?: string;
  EmailContent?: (content: any) => void;
  isOpen: boolean;
  onClose: () => void;
  onSend: () => void;
};

// Ajout des constantes pour les configurations réutilisables
const EDITOR_CONFIG = {
  height: 650,
  menubar: false,
  plugins: ["lists", "emoticons"],
  toolbar:
    "undo redo | bold italic underline | alignleft aligncenter alignright alignfull | numlist bullist | emoticons",
  language: "fr_FR",
  browser_spellcheck: true,
};

/**
 * @description EmailTemplateEditor component
 * @param props { Mail: string, EmailContent: (content: any) => void, isOpen: boolean, onClose: () => void, onSend: () => void }
 * @returns React.ReactNode
 */
export const EmailTemplateEditor = (props: Props) => {
  const handleEditorChange = (content: string) => {
    props.EmailContent && props.EmailContent(content);
  };

  return (
    <Modal
      isOpen={props.isOpen}
      onClose={props.onClose}
      title="Éditeur de template"
    >
      <div className=" w-full min-h-[80vh] flex flex-col justify-between gap-4 p-4">
        <Editor
          apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY} // Remplace par ta clé API TinyMCE
          initialValue={props.Mail || ""}
          init={{ ...EDITOR_CONFIG }}
          onEditorChange={handleEditorChange}
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={props.onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Annuler
          </button>
          <button
            onClick={props.onSend}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            Envoyer
          </button>
        </div>
      </div>
    </Modal>
  );
};
