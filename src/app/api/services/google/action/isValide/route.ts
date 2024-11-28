import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { authOptions } from "@/app/api/auth/auth";
import { getServerSession } from "next-auth/next";
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
    if (!profile?.data?.tokenCalendar) {
      return NextResponse.json({ error: "Token not found" }, { status: 404 });
    }
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: profile.data.tokenCalendar });
    const tokenInfo = await auth.getTokenInfo(profile.data.tokenCalendar);
    console.log("tokenInfo", tokenInfo);

    return NextResponse.json(tokenInfo, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
