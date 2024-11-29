import { NextRequest, NextResponse } from "next/server";

/* services */
import { checkToken } from "@/services";
/* types */
import { ICallback } from "@/types";

/**
 * Vérifie si le token est valide.
 * @param {NextRequest} req - La requête entrante.
 * @param {NextResponse} res - La réponse sortante.
 * @returns {Promise<NextResponse<ICallback>>} - La réponse contenant le résultat de la vérification du token.
 */
export async function GET(
  req: NextRequest,
  res: NextResponse
): Promise<NextResponse<ICallback>> {
  try {
    const token = req.nextUrl.searchParams.get("token");
    if (!token) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          feedback: null,
          error: "Not authenticated",
        },
        { status: 400 }
      );
    }

    try {
      // Vérification si le token est valide
      const tokenInfo = await checkToken(token);
      const isTokenValid = tokenInfo.expiry_date > Date.now();
      return NextResponse.json(
        {
          success: true,
          data: { valid: isTokenValid, tokenInfo: tokenInfo },
          feedback: null,
          error: null,
        },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          data: { valid: false },
          feedback: null,
          error: "Invalid or expired token",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("API GOOGLE IS VALIDE - ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        data: null,
        feedback: null,
        error: "Error during token check",
      },
      { status: 500 }
    );
  }
}
