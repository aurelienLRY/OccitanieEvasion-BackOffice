import { authOptions } from "@/app/api/auth/auth";
import { google } from "googleapis";
import { getServerSession } from "next-auth/next";

import { NextRequest, NextResponse } from "next/server";
import { GET_USER_BY_ID } from "@/libs/actions";

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user._id) {
      return NextResponse.json({ error: "Not authenticated" });
    }
    const profile = await GET_USER_BY_ID(session.user._id);
    if (!profile.success) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }
    if (!profile.data?.tokenCalendar) {
      return NextResponse.json({ error: "Token not found" }, { status: 404 });
    }

    let token = profile.data?.tokenCalendar;
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: token });
    const calendar = google.calendar({ version: "v3", auth });
    const calendarId = await calendar.calendarList.list();
    return NextResponse.json(calendarId.data, { status: 200 });
  } catch (error: any) {
    console.log("---- ERROR  API/SERVICES/GOOGLE/ACTION ----");
    console.log("error : ", error);
    console.log("---- END ERROR  API/SERVICES/GOOGLE/ACTION ----");
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
  }
}
