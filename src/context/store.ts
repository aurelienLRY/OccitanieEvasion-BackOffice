/*Libs*/
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { produce } from 'immer';
/* types*/
import { ISession , ISpot , ISessionWithDetails , IActivity , ICustomerSession } from "@/types";


/*************************************************************************/ 

/**
 * Sessions Type
 */
type TuseSessions = {
  sessions: ISession[];
  setSessions: (sessions: ISession[]) => void;
  updateSessions: (updatedSession: ISession) => void;
  deleteSessions: (deletedSession: ISession) => void;
  addSessions: (newSession: ISession) => void;
}

/**
 * Sessions Store
 */
export const useSessions = create<TuseSessions>()(devtools((set) => ({
  sessions: [] as ISession[],
  setSessions: (sessions: ISession[]) => set({ sessions }),
  // Update Session
  updateSessions: (updatedSession: ISession) => set(produce((state: { sessions: ISession[] }) => {
    const index = state.sessions.findIndex(s => s._id === updatedSession._id);
    if (index !== -1) {
      state.sessions[index] = updatedSession;
    } else {
      state.sessions.push(updatedSession);
    }
  })),
  deleteSessions: (deletedSession: ISession) => set(produce((state: { sessions: ISession[] }) => {
    state.sessions = state.sessions.filter(s => s._id !== deletedSession._id);
  })),
  addSessions: (newSession: ISession) => set(produce((state: { sessions: ISession[] }) => {
    state.sessions.push(newSession);
  })),
})));

/*************************************************************************/ 

/**
 * CustomerSessions Type
 */
type TuseCustomerSessions = {
  CustomerSessions: ICustomerSession[];
  setCustomerSessions: (CustomerSessions: ICustomerSession[]) => void;
  updateCustomerSessions: (updatedCustomerSession: ICustomerSession) => void;
  deleteCustomerSessions: (deletedCustomerSession: ICustomerSession) => void;
  addCustomerSessions: (newCustomerSession: ICustomerSession) => void;
}

/**
 * CustomerSessions Store
 */
export const useCustomerSessions = create<TuseCustomerSessions>()(devtools((set) => ({
  CustomerSessions: [] as ICustomerSession[],
  setCustomerSessions: (CustomerSessions: ICustomerSession[]) => set({ CustomerSessions }),
  updateCustomerSessions: (updatedCustomerSession: ICustomerSession) => set(produce((state: { CustomerSessions: ICustomerSession[] }) => {
    const index = state.CustomerSessions.findIndex(s => s._id === updatedCustomerSession._id);
    if (index !== -1) {
      state.CustomerSessions[index] = updatedCustomerSession;
    } else {
      state.CustomerSessions.push(updatedCustomerSession);
    }
  })),
  deleteCustomerSessions: (deletedCustomerSession: ICustomerSession) => set(produce((state: { CustomerSessions: ICustomerSession[] }) => {
    state.CustomerSessions = state.CustomerSessions.filter(s => s._id !== deletedCustomerSession._id);
  })),
  addCustomerSessions: (newCustomerSession: ICustomerSession) => set(produce((state: { CustomerSessions: ICustomerSession[] }) => {
    state.CustomerSessions.push(newCustomerSession);
  })),  

})));



/*************************************************************************/ 

/**
 * SessionWithDetails Type
 */
type TuseSessionWithDetails = {
  SessionWithDetails: ISessionWithDetails[];
  setSessionWithDetails: (SessionWithDetails: ISessionWithDetails[]) => void;
  updateSessionWithDetails: (updatedSessionWithDetails: ISessionWithDetails) => void;
  deleteSessionWithDetails: (deletedSessionWithDetails: ISessionWithDetails) => void;
  addSessionWithDetails: (newSessionWithDetails: ISessionWithDetails) => void;
}

/**
 * SessionWithDetails Store
 */
export const useSessionWithDetails = create<TuseSessionWithDetails>()(devtools((set) => ({
  SessionWithDetails: [] as ISessionWithDetails[],
  setSessionWithDetails: (SessionWithDetails: ISessionWithDetails[]) => set({ SessionWithDetails }),
  updateSessionWithDetails: (updatedSessionWithDetails: ISessionWithDetails) => set(produce((state: { SessionWithDetails: ISessionWithDetails[] }) => {
    const index = state.SessionWithDetails.findIndex(s => s._id === updatedSessionWithDetails._id);
    if (index !== -1) {
      state.SessionWithDetails[index] = updatedSessionWithDetails;
    } else {
      state.SessionWithDetails.push(updatedSessionWithDetails);
    }
  })),
  deleteSessionWithDetails: (deletedSessionWithDetails: ISessionWithDetails) => set(produce((state: { SessionWithDetails: ISessionWithDetails[] }) => {
    state.SessionWithDetails = state.SessionWithDetails.filter(s => s._id !== deletedSessionWithDetails._id);
  })),
  addSessionWithDetails: (newSessionWithDetails: ISessionWithDetails) => set(produce((state: { SessionWithDetails: ISessionWithDetails[] }) => {
    state.SessionWithDetails.push(newSessionWithDetails);
  })),
})));


/*************************************************************************/ 

/**
 * Spots Type
 */
type TuseSpots = {
  Spots: ISpot[];
  setSpots: (Spots: ISpot[]) => void;
  updateSpots: (updatedSpot: ISpot) => void;
  deleteSpots: (deletedSpot: ISpot) => void;
  addSpots: (newSpot: ISpot) => void;

}

/**
 * Spots Store
 */
export const useSpots = create<TuseSpots>()(devtools((set) => ({
  Spots: [] as ISpot[],
  setSpots: (Spots: ISpot[]) => set({ Spots }),
  updateSpots: (updatedSpot: ISpot) => set(produce((state: { Spots: ISpot[] }) => {
    const index = state.Spots.findIndex(s => s._id === updatedSpot._id);
    if (index !== -1) {
      state.Spots[index] = updatedSpot;
    } else {
      state.Spots.push(updatedSpot);
    }
  })),
  deleteSpots: (deletedSpot: ISpot) => set(produce((state: { Spots: ISpot[] }) => {
    state.Spots = state.Spots.filter(s => s._id !== deletedSpot._id);
  })),
  addSpots: (newSpot: ISpot) => set(produce((state: { Spots: ISpot[] }) => {
    state.Spots.push(newSpot);
  })),
})));

/*************************************************************************/ 


/**
 * Activities Type
 */
type TuseActivities = {
  Activities: IActivity[];
  setActivities: (Activities: IActivity[]) => void;
  updateActivities: (updatedActivity: IActivity) => void;
  deleteActivities: (deletedActivity: IActivity) => void;
  addActivities: (newActivity: IActivity) => void;
}

/**
 * Activities Store
 */
export const useActivities = create<TuseActivities>()(devtools((set) => ({
  Activities: [] as IActivity[],
  setActivities: (Activities: IActivity[]) => set({ Activities }),
  updateActivities: (updatedActivity: IActivity) => set(produce((state: { Activities: IActivity[] }) => {
    const index = state.Activities.findIndex(a => a._id === updatedActivity._id);
    if (index !== -1) {
      state.Activities[index] = updatedActivity;
    } else {
      state.Activities.push(updatedActivity);
    }
    })),
  deleteActivities: (deletedActivity: IActivity) => set(produce((state: { Activities: IActivity[] }) => {
    state.Activities = state.Activities.filter(a => a._id !== deletedActivity._id);
  })),
  addActivities: (newActivity: IActivity) => set(produce((state: { Activities: IActivity[] }) => {
    state.Activities.push(newActivity);
  })),
})));
