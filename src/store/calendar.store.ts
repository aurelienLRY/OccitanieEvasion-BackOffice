"use client";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { fetcherCheckToken } from "@/services/GoogleCalendar/fetcherCheckToken";
import { fetcherRefreshToken } from "@/services/GoogleCalendar/fetcherRefreshToken";

/* STORE */
import { useProfile } from "@/store";
import { ICallback, ICallbackForUser, ICalendarTokenInfo } from "@/types";

type TuseCalendar = {
  tokenIsValid: boolean;
  expiryDate: number;
  refreshToken: () => Promise<ICallbackForUser | null>;
  checkToken: () => Promise<
    | (ICallback & {
        data: { valid: boolean; tokenInfo: ICalendarTokenInfo | undefined };
      })
    | null
  >;
};

export const useCalendar = create<TuseCalendar>()(
  devtools((set, get) => ({
    tokenIsValid: false,
    expiryDate: 0,
    refreshToken: async () => {
      const { profile } = useProfile.getState();
      const updateProfile = useProfile.getState().updateProfile;
      if (profile) {
        const rep = await fetcherRefreshToken(profile);
        if (rep.success && rep.data) {
          updateProfile({
            ...profile,
            tokenCalendar: rep.data.tokenCalendar,
          });
          return rep;
        }
      }
      return null;
    },
    checkToken: async () => {
      const { profile } = useProfile.getState();
      if (profile && profile.tokenCalendar) {
        const rep = await fetcherCheckToken(profile.tokenCalendar);
        if (rep.success && rep.data && rep.data.tokenInfo) {
          set({
            tokenIsValid: rep.data.valid as boolean,
            expiryDate: rep.data.tokenInfo.expiry_date as number,
          });
        } else {
          await get().refreshToken();
          await get().checkToken();
        }
      }
      return null;
    },
  }))
);
