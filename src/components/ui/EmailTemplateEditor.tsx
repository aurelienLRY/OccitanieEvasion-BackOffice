import React from "react";
import { Editor } from "@tinymce/tinymce-react";

 /* components */
import { Modal } from "@/components";


 type Props = {
  Mail? : string
  EmailContent ? : (content: any) => void
  isOpen : boolean
  onClose : () => void
 }

 
export const EmailTemplateEditor = (props : Props) => {
  const handleEditorChange = (content: string) => {
   props.EmailContent && props.EmailContent(content)
  };
  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
    <Editor
      apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY} // Remplace par ta clé API TinyMCE
      initialValue={props.Mail || ""}
      init={{
        height: 600,
        menubar: true,
        plugins: [
          'advlist autolink lists link image charmap print preview anchor',
          `anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks`,
          'searchreplace visualblocks code fullscreen',
          'insertdatetime media table paste code help wordcount'
        ],
        toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat ',
        language: 'fr_FR', // Pour mettre l'interface en français
      }}
      onEditorChange={handleEditorChange}
    />
    </Modal>
  );
};



