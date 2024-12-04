import { google } from "googleapis";

/**
 * Client OAuth2 Google
 */
export const oauth2Client = await new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.NEXTAUTH_URL}/api/services/google/callback` // URL de callback
);
