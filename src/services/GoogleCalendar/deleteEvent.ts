"use server";
import { google } from "googleapis";
import { oauth2Client } from "@/services";

/**
 * Delete an event from the Google Calendar
 * @param refreshToken - The refresh token of the user
 * @param eventId - The ID of the event to delete
 * @returns The response from the Google Calendar API
 */
export const deleteEvent = async (refreshToken: string, eventId: string) => {
  oauth2Client.setCredentials({ refresh_token: refreshToken });
  const calendar = google.calendar({ version: "v3", auth: oauth2Client });
  const response = await calendar.events.delete({
    calendarId: "primary",
    eventId: eventId,
  });
  return response;
};
