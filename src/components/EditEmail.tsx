"use client";

/*libs*/
import React, { useState } from "react";

/*components*/
import Modal from "@/components/Modal";
import MyTiptap from "@/components/tiptap/index";
/* Template */
import { customerConfirmation } from "@/libs/sendBox/template/RegistrationConfirmation";

/* Types */
import { ICustomerSession, ISessionWithDetails } from "@/types";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  myContent: string;
};

const EditEmail = ({
  isOpen,
  onClose,
  myContent,
}: Props) => {

  const [newContent, setNewContent] = useState(myContent);


  const updateContent = (content: string) => {
  setNewContent(content);
};

 

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-4 justify-center items-center">
        <h1 className="text-2xl font-bold">Éditeur d&apos;Email</h1>
    
        <div className="flex flex-col dark:bg-gray-800 rounded-lg w-full  overflow-hidden">
          <div className="dark:bg-gray-600 h-7 flex w-full items-center px-3">
            <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
            <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
          </div>
                <MyTiptap
                  isBubbleMenu={true}
                  isToolBar={false}
                  myContent={myContent}
                  editorContent={updateContent}
                />
        </div>
        <button onClick={() => {
          console.log(newContent);
        }}>
          Save
        </button>
      </div>
    </Modal>
  );
};

export default EditEmail;
