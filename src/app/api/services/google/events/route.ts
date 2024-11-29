// https://www.googleapis.com/calendar/v3/calendars/primary/events

import { NextRequest, NextResponse } from "next/server";
import { oauth2Client } from "@/services";
/* types */
import { ICallback } from "@/types";
import { google } from "googleapis";

export async function POST(
  req: NextRequest,
  res: NextResponse
): Promise<NextResponse<ICallback>> {
  const token = req.nextUrl.searchParams.get("token");
  try {
    oauth2Client.setCredentials({ access_token: token });

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    // Récupérer les événements du calendrier principal
    const response = await calendar.events.list({
      calendarId: "primary", // "primary" fait référence au calendrier principal de l'utilisateur
      timeMin: new Date().toISOString(), // Limite inférieure (par exemple, aujourd'hui)
      maxResults: 10, // Limitez le nombre d'événements à récupérer
      singleEvents: true, // Développe les événements récurrents
      orderBy: "startTime", // Trie par heure de début
    });

    return NextResponse.json(
      {
        success: true,
        data: response.data.items || [],
        feedback: null,
        error: null,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la récupération des événements :", error);
    return NextResponse.json(
      {
        success: false,
        data: null,
        feedback: null,
        error: "Impossible de récupérer les événements",
      },
      { status: 500 }
    );
  }
}
