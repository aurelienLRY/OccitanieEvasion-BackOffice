"use server";

import { google } from "googleapis";
import { oauth2Client } from "@/services";

export const getEvent = async (token: string) => {
  oauth2Client.setCredentials({ access_token: token });
  const calendar = google.calendar({ version: "v3", auth: oauth2Client });
  const response = await calendar.events.list({
    calendarId: "primary",
    singleEvents: true,
    orderBy: "startTime",
  });
  return response;
};
