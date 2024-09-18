/* LIBRAIRIES */
import { Tooltip } from "antd";
import React, { useEffect } from "react";

/*icons*/
import { IoMdCloseCircle } from "react-icons/io";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

/**
 * Modal Component
 * @param isOpen: boolean
 * @param onClose: () => void
 * @param children: React.ReactNode
 */
export default function Modal({ isOpen, onClose, children }: Props) {
  const handleClose = () => {
    onClose();
  };

  /*
   * HandleEscape Function
   * @param e: KeyboardEvent
   * @returns void
   */
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  // Utilisation de useEffect pour ajouter et nettoyer l'événement keydown
  useEffect(() => {
    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {/*overlay*/}
      <div
        className={`fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex justify-center items-center z-40 ${
          isOpen ? "block" : "hidden"
        }`}
      >
        {/*modal*/}
        <div className="min-w-[300px] w-fit lg:max-w-[70vw] max-h-[90vh] overflow-y-auto bg-slate-700 dark:bg-sky-800 rounded-md shadow-md shadow-slate-400 dark:shadow-sky-400">
          <div className="flex justify-end">
            <Tooltip title="Fermer">
              <button onClick={handleClose}>
                <IoMdCloseCircle className="text-4xl text-white text-right p-1 hover:text-red-500 transition-all duration-300" />
              </button>
            </Tooltip>
          </div>
          <div className="px-4 pb-4 flex justify-center items-center w-full">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
