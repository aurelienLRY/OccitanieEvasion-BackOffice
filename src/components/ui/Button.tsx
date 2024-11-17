import React from "react";
import { Tooltip } from "antd";



/*icons */ 
import { BiEditAlt } from "react-icons/bi";
import { FaRegEye } from "react-icons/fa";
import { MdDelete } from "react-icons/md";




/**
 * Ce composant représente un bouton personnalisé avec une icône.
 * Il utilise un `Tooltip` de Material-UI pour afficher un titre lorsque l'utilisateur survole le bouton.
 * 
 * @param {object} props - Les propriétés du composant.
 * @param {string} props.title - Le titre à afficher dans le tooltip.
 * @param {React.ReactElement} props.icon - L'icône à afficher dans le bouton.
 * @param {() => void} props.onClick - La fonction à exécuter lorsque le bouton est cliqué.
 * @returns {JSX.Element} Le composant bouton avec tooltip.
 */
export const IconButton = ({
    title,
    icon,
    onClick,
  }: {
    title: string;
    icon: React.ReactElement;
    onClick: () => void;
  }) => {
    return (
      <Tooltip title={title}>
        <button
          onClick={onClick}
          className="bg-orange-500 hover:bg-orange-600 transition-all duration-300 text-white px-4 py-2 rounded-md text-sm flex flex-col gap-2 items-center justify-center min-w-20 min-h-20 group hover:rotate-12 "
        >
          {React.cloneElement(icon, {
            className:
              "text-4xl group-hover:scale-125  group-hover:-rotate-12 transition-all duration-300",
          })}
        </button>
    </Tooltip>
  );
}





/**
 * Ce composant représente un bouton d'édition.
 * Il utilise un `Tooltip` de Material-UI pour afficher un titre lorsque l'utilisateur survole le bouton.
 * 
 * @param {object} props - Les propriétés du composant.
 * @param {string} [props.title] - Le titre à afficher dans le tooltip.
 * @param {() => void} props.onClick - La fonction à exécuter lorsque le bouton est cliqué.
 * @param {string} [props.className] - Classes CSS supplémentaires pour le bouton.
 * @param {React.ReactNode} [props.children] - Les enfants à afficher à l'intérieur du bouton.
 * @returns {JSX.Element} Le composant bouton d'édition avec tooltip.
 */
 export const EditButton = ({
  title,
  onClick,
  className,
  children,
}: {
  title?: string;
  onClick: () => void;
  className?: string;
  children?: React.ReactNode;
}) => {
return (
  <Tooltip title={`${title ? title : "Modifier"}`}>
    <button
      onClick={onClick}
      className={`text-2xl group ${className}`}
    >
      <BiEditAlt className="group-hover:text-orange-600 transition-all duration-300" />
      {children}
    </button>
  </Tooltip>
  )
}

/**
 * Ce composant représente un bouton de détail.
 * Il utilise un `Tooltip` de Material-UI pour afficher un titre lorsque l'utilisateur survole le bouton.
 * 
 * @param {object} props - Les propriétés du composant.
 * @param {string} [props.title] - Le titre à afficher dans le tooltip.
 * @param {() => void} props.onClick - La fonction à exécuter lorsque le bouton est cliqué.
 * @param {string} [props.className] - Classes CSS supplémentaires pour le bouton.
 * @param {React.ReactNode} [props.children] - Les enfants à afficher à l'intérieur du bouton.
 * @returns {JSX.Element} Le composant bouton de détail avec tooltip.
 */
export const DetailButton = ({
  title,
  onClick,
  className,
  children,
}: {
  title?: string;
  onClick: () => void;
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <Tooltip title={`${title ? title : "Voir le détail"}`}>
      <button
        onClick={onClick}
        className={`text-2xl group ${className}`}
      >
        <FaRegEye className="group-hover:text-slate-200 transition-all duration-300 " />
        {children}
      </button>
    </Tooltip>
  )
}

/**
 * Ce composant représente un bouton de suppression.
 * Il utilise un `Tooltip` de Material-UI pour afficher un titre lorsque l'utilisateur survole le bouton.
 * 
  * @param {object} props - Les propriétés du composant.
 * @param {string} [props.title] - Le titre à afficher dans le tooltip.
 * @param {() => void} props.onClick - La fonction à exécuter lorsque le bouton est cliqué.
 * @param {string} [props.className] - Classes CSS supplémentaires pour le bouton.
 * @param {React.ReactNode} [props.children] - Les enfants à afficher à l'intérieur du bouton.
 * @returns {JSX.Element} Le composant bouton de suppression avec tooltip.
 */
export const DeleteButton = ({
  title,
  onClick,
  className,
  children,
}: {
  title?: string;
  onClick: () => void;
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <Tooltip title={`${title ? title : "Supprimer"}`}>
      <button
        onClick={onClick}
        className={`text-2xl group ${className}`}
      >
        <MdDelete className="group-hover:text-red-500 transition-all duration-300 " />
        {children}
      </button>
    </Tooltip>
  )
}
