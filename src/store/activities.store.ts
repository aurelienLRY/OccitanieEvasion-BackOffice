/* Libs */  
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { produce } from 'immer';

/* Data */
import { isCacheDuration } from "@/store";

/* Types */
import { IActivity } from "@/types";

/* Actions */
import { GET_ACTIVITIES } from "@/libs/actions";

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
  