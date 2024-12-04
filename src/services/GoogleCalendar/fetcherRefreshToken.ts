import { ICallbackForUser, IUser } from "@/types";

/**
 * Récupère un nouveau token.
 * @param profile - Le profil de l'utilisateur.
 * @returns Un objet ICallbackForUser avec le nouveau token.
 */
export const fetcherRefreshToken = async (
  profile: IUser
): Promise<ICallbackForUser> => {
  try {
    const fetcherRefreshToken = await fetch(
      "/api/services/google/refresh-token",
      {
        method: "POST",
        body: JSON.stringify({
          profile: profile,
        }),
      }
    );
    const isRefresh = await fetcherRefreshToken.json();
    if (isRefresh.success && isRefresh.data) {
      return {
        success: true,
        error: null,
        feedback: [],
        data: isRefresh.data,
      };
    } else {
      throw new Error("Erreur lors de la récupération du token");
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message as string,
      feedback: null,
      data: null,
    };
  }
};
