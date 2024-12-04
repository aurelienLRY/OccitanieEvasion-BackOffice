/* Libs */
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { produce } from "immer";

/* Data */
import { isCacheDuration } from "@/store";
import { useSession } from "next-auth/react";

/* Types */
import { IUser } from "@/types";
import { GET_USER_SESSION } from "@/libs/actions";

/* user store types */
type TuseProfile = {
  profile: IUser | null;
  lastFetch: number;
  fetchProfile: () => Promise<void>;
  updateProfile: (updatedProfile: IUser) => void;
};

/* user store */
export const useProfile = create<TuseProfile>()(
  devtools((set, get) => ({
    profile: null,
    lastFetch: 0,
    updateProfile: (updatedProfile: IUser) => {
      set(
        produce((state: { profile: IUser | null }) => {
          state.profile = updatedProfile;
        })
      );
    },
    fetchProfile: async () => {
      const currentTime = Date.now();
      const cacheDuration = isCacheDuration;
      const lastFetch = get().lastFetch;
      if (currentTime - lastFetch > cacheDuration || get().profile === null) {
        const response = await GET_USER_SESSION();
        if (response.success && response.data) {
          set({ profile: response.data });
          set({ lastFetch: currentTime });
        }
      }
    },
  }))
);
