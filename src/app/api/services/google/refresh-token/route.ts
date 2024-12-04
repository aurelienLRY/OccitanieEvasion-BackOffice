import { NextRequest, NextResponse } from "next/server";
import { ICallbackForUser, IUser } from "@/types";
import { refreshAccessToken } from "@/services";
/* update user */
import { UPDATE_USER } from "@/libs/actions";

/**
 * Récupération du nouveau token d'accès
 * @param {NextRequest} req - La requête entrante.
 * @returns {Promise<NextResponse<ICallbackForUser>>} - La réponse contenant le résultat de la vérification du token.
 */
export async function POST(
  req: NextRequest
): Promise<NextResponse<ICallbackForUser>> {
  const { profile }: { profile: IUser } = await req.json();
  if (!profile?.tokenRefreshCalendar) {
    return NextResponse.json(
      {
        success: false,
        data: null,
        feedback: null,
        error: "Refresh token manquant",
      },
      { status: 400 }
    );
  }

  try {
    const credentials = await refreshAccessToken(profile.tokenRefreshCalendar);
    const newData = {
      ...profile,
      tokenCalendar: credentials.access_token,
      ...(credentials.refresh_token && {
        tokenRefreshCalendar: credentials.refresh_token,
      }),
    };
    const updatedUser = await UPDATE_USER(
      profile._id as string,
      newData as IUser
    );
    if (!updatedUser.success) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          feedback: null,
          error: "Impossible de rafraîchir le token",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: updatedUser.data,
        feedback: null,
        error: null,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors du rafraîchissement du token :", error);
    return NextResponse.json(
      {
        success: false,
        data: null,
        feedback: null,
        error: "Impossible de rafraîchir le token",
      },
      { status: 500 }
    );
  }
}
