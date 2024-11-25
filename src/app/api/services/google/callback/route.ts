import { NextRequest, NextResponse } from "next/server";
import { oauth2Client } from "@/services";
import { authOptions } from "@/app/api/auth/auth";
import { connectDB, disconnectDB } from "@/libs/database/mongodb";
import { IUser } from "@/types";
import User from "@/libs/database/models/User";
import { getServerSession } from "next-auth";

export async function GET(req: NextRequest, res: NextResponse) {
  const code = req.nextUrl.searchParams.get("code");
  const origin = req.nextUrl.searchParams.get("state") || "/dashboard"; // Récupérer l'URL d'origine
  const session = await getServerSession(authOptions);
  if (!code || !session) {
    console.log("API GOOGLE CALLBACK - SESSION : ", session);
    console.log("API GOOGLE CALLBACK - CODE : ", code);
    return NextResponse.json({ error: "Element manquant" });
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);

    if (!tokens.access_token) {
      return NextResponse.json({ error: "Token manquant" });
    } else {
      const newUser = {
        ...session.user,
        tokenCalendar: tokens.access_token,
        calendar: true,
      };
      await connectDB();
      const updateUser: IUser | null = await User.findByIdAndUpdate(
        session.user._id,
        newUser,
        { new: true }
      );
      if (!updateUser) {
        return NextResponse.json({ error: "Utilisateur non trouvé" });
      }
      //TODO: Mettre à jour la session avec le nouveau user

      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}${origin}`);
    }
  } catch (error) {
    console.error("Erreur lors de l'échange des tokens :", error);
    return NextResponse.json({ error: "Erreur lors de l'autorisation" });
  } finally {
    await disconnectDB();
  }
}
