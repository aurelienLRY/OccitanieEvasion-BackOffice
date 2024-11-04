/* Libs */
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { produce } from 'immer';

/* Data */
import { isCacheDuration } from "@/store";

/* Types */
import { ICustomerSession } from "@/types";

/* Actions */
import { GET_CUSTOMER_SESSIONS } from "@/libs/actions";



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