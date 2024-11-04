import React from "react";
import { Editor } from "@tinymce/tinymce-react";




 type Props = {
  Mail : string
  dynamicData ? : object
 }
export const EmailTemplateEditor = (props : Props) => {

  const variables = {
    ...props?.dynamicData,
    "customer.Last_name": "Nom de famille",
    "customer.First_name": "Prénom",

    // Ajoute d'autres variables ici
  };

  const handleEditorChange = (content: string) => {
    console.log('Contenu édité:', content);
  };

  return (
    <Editor
      apiKey="b9bgyhby8s8j54dawuecurbr976t0bb4onsx0vjtt5esxfu7" // Remplace par ta clé API TinyMCE
      initialValue={props.Mail}
      init={{
        height: 800,
        menubar: true,
        plugins: [
          'advlist autolink lists link image charmap print preview anchor',
          `anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks`,
          'searchreplace visualblocks code fullscreen',
          'insertdatetime media table paste code help wordcount'
        ],
        toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat | variables',
        setup: (editor) => {
          editor.ui.registry.addMenuButton('variables', {
            text: 'Insérer une variable ',
            fetch: (callback) => {
              const items = Object.keys(variables).map((key) => ({
                type: 'menuitem',
                text: variables[key],
                onAction: () => editor.insertContent(`{{${key}}}`)
              }));
              callback(items);
            }
          });
        },
        language: 'fr_FR', // Pour mettre l'interface en français
      }}
      onEditorChange={handleEditorChange}
    />
  );
};



