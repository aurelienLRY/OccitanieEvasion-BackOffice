"use server";

import fs from "fs";
import path from "path";
import sharp from "sharp";
import * as yup from "yup";

const imageSchema = yup.object({
  avatar: yup
    .mixed<File>()
    .required("Veuillez fournir une image.")
    .test(
      "type",
      "Format de fichier invalide. Formats acceptés : jpeg, jpg, png, gif.",
      (value: File | undefined) => {
        return (
          value && ["image/jpeg", "image/png", "image/gif"].includes(value.type)
        );
      }
    ),
});

export async function uploadAvatarAction(formData: FormData, userId: string) {
  // Validation des données avec yup
  const formDataObject = Object.fromEntries(formData);
  try {
    await imageSchema.validate(formDataObject, { abortEarly: false });

    const avatarFile = formData.get("avatar") as File;

    // Chemin où stocker l'image (public/img/avatar/userId)
    const uploadPath = path.join(
      process.cwd(),
      "public",
      "img",
      "avatar",
      userId
    );
    // nom de l'image
    const avatarName = `avatar-${new Date().getTime()}.webp`;
    // chemin de l'image
    const avatarPath = path.join("img", "avatar", userId, avatarName);

    // Créer le dossier s'il n'existe pas
    await fs.promises.mkdir(uploadPath, { recursive: true });

    const arrayBuffer = await avatarFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Conversion en WebP et enregistrement
    await sharp(buffer)
      .resize({ width: 100, height: 100 })
      .webp({ quality: 80, lossless: true })
      .toFile(path.join(uploadPath, avatarName));

    // supprime les autres photo du dossier  de l'utilisateur
    const files = await fs.promises.readdir(uploadPath);
    for (const file of files) {
      if (file !== avatarName) {
        await fs.promises.unlink(path.join(uploadPath, file));
      }
    }

    return { success: true, path: avatarPath.replaceAll("\\", "/") };
  } catch (err: any) {
    console.log("err", err);
    // Gérer les erreurs de validation
    return { success: false, errors: err };
  }
}

/**
 * Fonction qui vérifie si l'url de l'avatar existe et présent dans le dossier public sinon retourne l'avatar par défaut
 * @param avatarUrl - url de l'avatar
 * @returns url de l'avatar ou url de l'avatar par défaut
 */
export async function checkAvatarExists(avatarUrl: string) {
  try {
    console.log("checkAvatarExists avatarUrl ", avatarUrl);
    const response = await fetch(avatarUrl);
    console.log("checkAvatarExists response ", response);
    if (
      response.ok &&
      response.headers.get("content-type")?.includes("image")
    ) {
      return avatarUrl;
    } else {
      return "/img/default-avatar.webp";
    }
  } catch (error) {
    return "/img/default-avatar.webp";
  }
}
