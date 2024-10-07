/*Libs*/
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { produce } from 'immer';


/* types*/
import { ISession , ISpot , ISessionWithDetails , IActivity , ICustomerSession } from "@/types";

/* Services */
import { GET_SESSIONS , GET_CUSTOMER_SESSIONS , GET_SESSIONS_WITH_DETAILS , GET_SPOTS , GET_ACTIVITIES} from "@/libs/actions";


/*************************************************************************/ 

 const isCacheDuration = 120000; // 2 minutes en millisecondes

/**
 * Sessions Type
 */
type TuseSessions = {
  sessions: ISession[];
  lastFetch: number;
  setSessions: (sessions: ISession[]) => void;
  updateSessions: (updatedSession: ISession) => void;
  deleteSessions: (deletedSession: ISession) => void;
  addSessions: (newSession: ISession) => void;
  updateLastFetch: () => void;
  fetchSessions: () => Promise<void>;
}

/**
 * Sessions Store
 */
export const useSessions = create<TuseSessions>()(devtools((set, get) => ({
  sessions: [] as ISession[],
  lastFetch: 0,
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
  updateLastFetch: () => set({ lastFetch: Date.now() }),
  fetchSessions: async () => {
    const currentTime = Date.now();
    const cacheDuration =  isCacheDuration
    const lastFetch = get().lastFetch;
    if (currentTime - lastFetch > cacheDuration || get().sessions.length === 0) {
      const response = await GET_SESSIONS();
      if (response.success && response.data) {
        set({ sessions: response.data });
        set({ lastFetch: currentTime });
      }
    }
  }
})));

/*************************************************************************/ 

/**
 * CustomerSessions Type
 */
type TuseCustomerSessions = {
  CustomerSessions: ICustomerSession[];
  lastFetch: number;
  setCustomerSessions: (CustomerSessions: ICustomerSession[]) => void;
  updateCustomerSessions: (updatedCustomerSession: ICustomerSession) => void;
  deleteCustomerSessions: (deletedCustomerSession: ICustomerSession) => void;
  addCustomerSessions: (newCustomerSession: ICustomerSession) => void;
  updateLastFetch: () => void;
  fetchCustomerSessions: () => Promise<void>;
}

/**
 * CustomerSessions Store
 */
export const useCustomerSessions = create<TuseCustomerSessions>()(devtools((set,get) => ({
  CustomerSessions: [] as ICustomerSession[],
  lastFetch: 0,
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
  
  updateLastFetch :() => set({ lastFetch: Date.now() }),
  fetchCustomerSessions: async () => {
    const currentTime = Date.now();
    const cacheDuration =  isCacheDuration;
    const lastFetch = get().lastFetch;
    if (currentTime - lastFetch > cacheDuration || get().CustomerSessions.length === 0) {
      const response = await GET_CUSTOMER_SESSIONS();
      if (response.success && response.data) {
        set({ CustomerSessions: response.data });
        set({ lastFetch: currentTime });  
      }
    }
  }
  

})));



/*************************************************************************/ 

/**
 * SessionWithDetails Type
 */
type TuseSessionWithDetails = {
  SessionWithDetails: ISessionWithDetails[];
  lastFetch: number;
  setSessionWithDetails: (SessionWithDetails: ISessionWithDetails[]) => void;
  updateSessionWithDetails: (updatedSessionWithDetails: ISessionWithDetails) => void;
  deleteSessionWithDetails: (deletedSessionWithDetails: ISessionWithDetails) => void;
  addSessionWithDetails: (newSessionWithDetails: ISessionWithDetails) => void;
  updateLastFetch: () => void;
  fetchSessionWithDetails: () => Promise<void>;
}

/**
 * SessionWithDetails Store
 */
export const useSessionWithDetails = create<TuseSessionWithDetails>()(devtools((set,get) => ({
  SessionWithDetails: [] as ISessionWithDetails[],
  lastFetch: 0,
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
  updateLastFetch: () => set({ lastFetch: Date.now() }),
  fetchSessionWithDetails: async () => {
    const currentTime = Date.now();
    const cacheDuration =  isCacheDuration;
    const lastFetch = get().lastFetch;
    if (currentTime - lastFetch > cacheDuration || get().SessionWithDetails.length === 0) {
      const response = await GET_SESSIONS_WITH_DETAILS();
      if (response.success && response.data) {
        set({ SessionWithDetails: response.data });
        set({ lastFetch: currentTime });
      }
    }
  }
})));


/*************************************************************************/ 

/**
 * Spots Type
 */
type TuseSpots = {
  Spots: ISpot[];
  lastFetch: number;
  setSpots: (Spots: ISpot[]) => void;
  updateSpots: (updatedSpot: ISpot) => void;
  deleteSpots: (deletedSpot: ISpot) => void;
  addSpots: (newSpot: ISpot) => void;
  updateLastFetch: () => void;
  fetchSpots: () => Promise<void>;
}

/**
 * Spots Store
 */
export const useSpots = create<TuseSpots>()(devtools((set,get) => ({
  Spots: [] as ISpot[],
  lastFetch: 0,
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
  updateLastFetch: () => set({ lastFetch: Date.now() }),
  fetchSpots: async () => {
    const currentTime = Date.now();
    const cacheDuration =  isCacheDuration;
    const lastFetch = get().lastFetch;
    if (currentTime - lastFetch > cacheDuration || get().Spots.length === 0) {
      const response = await GET_SPOTS();
      if (response.success && response.data) {  
        set({ Spots: response.data });
        set({ lastFetch: currentTime });
      }
    }
  } 
})));

/*************************************************************************/ 


/**
 * Activities Type
 */
type TuseActivities = {
  Activities: IActivity[];
  lastFetch: number;
  setActivities: (Activities: IActivity[]) => void;
  updateActivities: (updatedActivity: IActivity) => void;
  deleteActivities: (deletedActivity: IActivity) => void;
  addActivities: (newActivity: IActivity) => void;
  updateLastFetch: () => void;
  fetchActivities: () => Promise<void>;
}

/**
 * Activities Store
 */
export const useActivities = create<TuseActivities>()(devtools((set,get) => ({
  Activities: [] as IActivity[],
  lastFetch: 0,
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
  updateLastFetch: () => set({ lastFetch: Date.now() }),
  fetchActivities: async () => {
    const currentTime = Date.now();
    const cacheDuration =  isCacheDuration;
    const lastFetch = get().lastFetch;
    if (currentTime - lastFetch > cacheDuration || get().Activities.length === 0) {
      const response = await GET_ACTIVITIES();
      if (response.success && response.data) {  
        set({ Activities: response.data });
        set({ lastFetch: currentTime });
      }
    }
  }
})));
