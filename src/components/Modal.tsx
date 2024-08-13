import { Tooltip } from "antd";
import React from "react";

/*icons*/
import { IoMdCloseCircle } from "react-icons/io";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export default function Modal({ isOpen, onClose, children }: Props) {
  const handleClose = () => {
    onClose();
  };

  return (
    <>
      {/*overlay*/}
      <div
        className={`fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex justify-center items-center z-40 ${
          isOpen ? "block" : "hidden"
        }`}
      >
        {/*modal*/}
        <div className="bg-transparent dark:bg-sky-950 min-w-fit w-full max-w-[70vw] rounded-md  ">
          <div className="flex justify-end">
            <Tooltip title="Fermer">
              <IoMdCloseCircle
                className="text-2xl text-right h-7 w-7 p-1 hover:text-red-500 transition-all duration-300"
                onClick={handleClose}
              />
            </Tooltip>
          </div>
          <div className="px-4 pb-4">{children}</div>
        </div>
      </div>
    </>
  );
}
