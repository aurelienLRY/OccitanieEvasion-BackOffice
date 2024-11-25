import { authOptions } from "@/app/api/auth/auth";
import { calendar } from "@nextui-org/react";
import { google } from "googleapis";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.tokenCalendar) {
    return NextResponse.json({ error: "Not authenticated" });
  }

  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: session.user.tokenCalendar });
  const calendar = google.calendar({ version: "v3", auth });

  const events = await calendar.events.list({
    calendarId: "primary",
    timeMin: new Date().toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: "startTime",
  });

  return NextResponse.json(events.data);
}

export async function POST(req: NextRequest, res: NextResponse) {
  const { summary, location, description, start, end } = await req.json();
  const event = {
    summary,
    location,
    description,
    start: { dateTime: start, timeZone: "UTC" },
    end: { dateTime: end, timeZone: "UTC" },
  };

  const response = await calendar.events.insert({
    calendarId: "primary",
    requestBody: event,
  });
  return NextResponse.json(response.data);
}
