"use server";
import { ICalendarEvent } from "@/types";
import { google } from "googleapis";
import { oauth2Client } from "@/services";

/**
 * Add an event to Google Calendar
 * @param refreshToken - The refresh token
 * @param event - The event
 * @returns The response from Google Calendar
 */
export const addEvent = async (refreshToken: string, event: ICalendarEvent) => {
  oauth2Client.setCredentials({ refresh_token: refreshToken });
  const calendar = google.calendar({ version: "v3", auth: oauth2Client });
  const response = await calendar.events.insert({
    calendarId: "primary",
    requestBody: event,
  });
  return response;
};
