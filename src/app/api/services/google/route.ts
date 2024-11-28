import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  const origin = req.nextUrl.searchParams.get("origin") || "/dashboard";

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.NEXTAUTH_URL}/api/services/google/callback` // URL de callback
  );

  // URL d'autorisation Google
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events",
    ],
    state: origin, // Inclure l'URL d'origine comme état
  });

  return NextResponse.json({ authUrl });
}
