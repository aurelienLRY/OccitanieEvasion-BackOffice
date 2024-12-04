import { oauth2Client } from "@/services";

/**
 * Récupération du nouveau token d'accès
 * @param token Refresh token
 * @returns Credentials
 */
export const refreshAccessToken = async (token: string) => {
  oauth2Client.setCredentials({ refresh_token: token });
  const { credentials } = await oauth2Client.refreshAccessToken();
  return credentials;
};
