"use server";
import { ICalendarEvent } from "@/types";
import { google } from "googleapis";
import { oauth2Client } from "@/services";

/**
 * Update an event on the Google Calendar
 * @param refreshToken - The refresh token of the user
 * @param event - The event to update
 * @param eventId - The ID of the event to update
 * @returns The response from the Google Calendar API
 */
export const updateEvent = async (
  refreshToken: string,
  event: ICalendarEvent,
  eventId: string
) => {
  oauth2Client.setCredentials({ refresh_token: refreshToken });
  const calendar = google.calendar({ version: "v3", auth: oauth2Client });
  const response = await calendar.events.update({
    calendarId: "primary",
    eventId: eventId,
    requestBody: event,
  });
  return response;
};
