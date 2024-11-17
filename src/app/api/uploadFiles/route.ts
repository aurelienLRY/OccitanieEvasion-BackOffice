import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/auth";
import { uploadAvatarAction } from "@/utils/uploadAvatar.utils";

export async function POST(request: NextRequest) {
  // Vérifier la session utilisateur
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const userId = session.user._id as string;
  const formData = await request.formData();

  // Appeler la fonction pour traiter l'upload de l'avatar
  const result = await uploadAvatarAction(formData, userId);

  if (result.success) {
    return NextResponse.json({ result });
  } else {
    return NextResponse.json({ result }, { status: 400 });
  }
}
