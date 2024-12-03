/**
 * Google Calendar token info type
 */
export interface ICalendarTokenInfo {
  expiry_date: number;
  scopes: string[];
  azp: string;
  aud: string;
  exp: string;
  access_type: string;
}

/**
 * Google Calendar event type
 */
export interface ICalendarEvent {
  colorId?: string;
  eventType?: string;
  id?: string;
  summary: string;
  description: string;
  start: { dateTime: string; timeZone: string };
  end: { dateTime: string; timeZone: string };
  reminders?: {
    useDefault: boolean;
    overrides: { method: string; minutes: number }[];
  };
  location?: string;
}

export interface IEventModel {
  _id?: string;
  eventId: string;
  sessionId: string;
}
