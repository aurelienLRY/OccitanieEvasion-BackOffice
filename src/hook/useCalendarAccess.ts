"use client";
import { useCallback } from "react";
import { useProfile } from "@/store";
import { IUser } from "@/types";

export const useCalendarAccess = () => {
  const { profile, updateProfile } = useProfile();
  const token_access = profile?.tokenCalendar;
  const token_refresh = profile?.tokenRefreshCalendar;

  const refreshToken = useCallback(async () => {
    const act = await fetch("/api/services/google/refresh-token", {
      method: "POST",
      body: JSON.stringify({ profile }),
    });
    const result = await act.json();
    if (result.success) {
      updateProfile(result.data as IUser);
    }
  }, [profile, updateProfile]);

  const intervalRefresh = useCallback(() => {
    const interval = setInterval(refreshToken, 1000 * 60 * 60 * 24);
    return () => clearInterval(interval);
  }, [refreshToken]);

  return { refreshToken, token_access, token_refresh, intervalRefresh };
};
