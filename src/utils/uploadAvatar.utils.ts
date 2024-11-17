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

    return { success: true, path: avatarPath.replaceAll("\\", "/") };
  } catch (err: any) {
    console.log("err", err);
    // Gérer les erreurs de validation
    return { success: false, errors: err };
  }
}
