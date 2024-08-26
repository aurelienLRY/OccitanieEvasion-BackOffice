import { create } from "zustand";
import { ISession } from "@/libs/database/models/Session";

export const useStore = create((set) => ({
  sessions: [],
  setSessions: (sessions: ISession[]) => set({ sessions }),
  setSession: (session: ISession) => set({ session }),
  // Update Session
  updateSession: (session: ISession) => set({ session }),
}));