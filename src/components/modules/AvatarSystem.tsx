"use client";
/*libs*/
import { useState } from "react";
import Image from "next/image";
import { Tooltip } from "antd";
import { useSession } from "next-auth/react";
import { Spin } from "antd";

/* actions */
import { UPDATE_USER } from "@/libs/actions";
/*components*/
import { ToasterAction } from "@/components";
/* icons */
import { FaCloudUploadAlt } from "react-icons/fa";
import { FaRegCheckCircle } from "react-icons/fa";
/* types */
import { IUser } from "@/types";

/**
 * Ce composant gère le système d'avatar pour les utilisateurs.
 * Il permet aux utilisateurs de télécharger une nouvelle image d'avatar,
 * de prévisualiser l'image avant de la soumettre et de mettre à jour leur profil utilisateur avec la nouvelle image.
 *
 * @component
 * @example
 * return (
 *   <AvatarSystem />
 * )
 */
export const AvatarSystem = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploaded, setIsUploaded] = useState(false);

  const { data: session } = useSession();
  console.log(session);
  const userId = session?.user._id;
  if (!userId) {
    throw new Error("Utilisateur non authentifié.");
  }

  /**
   * Handle image change
   * @param e - The event
   */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImagePreview(URL.createObjectURL(file));
      const formData = new FormData();
      formData.append("avatar", file, file.name);
      handleSubmit(formData); // Ajouter l'image à formData et soumettre
    }
  };

  /**
   * Handle form submit
   * @param formData - The form data
   */
  const handleSubmit = async (formData: FormData) => {
    const fetchAvatar = await fetch("/api/uploadFiles", {
      method: "POST",
      body: formData,
    });
    const { result } = await fetchAvatar.json();
    console.log("result >>", result);
    if (result.success) {
      console.log("result PATH", result.path);
      setIsUploaded(true);
      const updateUser = await UPDATE_USER(userId, {
        ...session?.user,
        avatar: result.path as string,
      } as IUser);

      // TODO: Mettre a jour la session

      ToasterAction({
        result: updateUser,
        defaultMessage: "Image téléchargée avec succès",
      });
    }
  };

  return (
    <form action={handleSubmit} className="flex flex-col items-center">
      <div className="relative">
        <Tooltip title="Changer mon avatar">
          <label htmlFor="avatar-input" className="cursor-pointer group">
            <Image
              src={
                imagePreview ||
                `/${session?.user?.avatar}` ||
                "/img/default-avatar.webp"
              }
              alt="Preview"
              width={100}
              height={100}
              className="rounded-full object-cover h-24 w-24"
            />
            {isUploaded ? (
              <FaRegCheckCircle className="absolute h-8 w-8 bottom-0 right-3 text-green-500" />
            ) : (
              <FaCloudUploadAlt className="absolute h-8 w-8 bottom-0 right-3 text-slate-300 hover:text-slate-500 cursor-pointer transition-all duration-300 group-hover:bottom-1 group-hover:text-slate-500" />
            )}
            <input
              id="avatar-input"
              type="file"
              name="avatar"
              accept="image/webp, image/png, image/jpg, image/jpeg"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </Tooltip>
      </div>
    </form>
  );
};
