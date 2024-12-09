/*libs */ 
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { produce } from 'immer';

/* actions */
import { GET_EMAIL_TEMPLATE } from "@/libs/ServerAction";

/* types */
import { IEmailTemplate } from "@/types";

/*data */ 
import { isCacheDuration } from "@/store";



/**
 * EmailTemplates Type
 */
type TuseEmailTemplates = {
    EmailTemplates: IEmailTemplate[];
    lastFetch: number;
    setEmailTemplates: (EmailTemplates: IEmailTemplate[]) => void;
    updateEmailTemplates: (updatedEmailTemplate: IEmailTemplate) => void;
    deleteEmailTemplates: (deletedEmailTemplate: IEmailTemplate) => void;
    addEmailTemplates: (newEmailTemplate: IEmailTemplate) => void;
    updateLastFetch: () => void;
    fetchEmailTemplates: () => Promise<void>;
}

/**
 * EmailTemplates Store
 */
export const useEmailTemplates = create<TuseEmailTemplates>()(devtools((set, get) => ({
    EmailTemplates: [] as IEmailTemplate[],
    lastFetch: 0,
    setEmailTemplates: (EmailTemplates: IEmailTemplate[]) => set({ EmailTemplates }),
    updateEmailTemplates: (updatedEmailTemplate: IEmailTemplate) => set(produce((state: { EmailTemplates: IEmailTemplate[] }) => {
        const index = state.EmailTemplates.findIndex(s => s._id === updatedEmailTemplate._id);
        if (index !== -1) {
            state.EmailTemplates[index] = updatedEmailTemplate;
        }
    })),
    deleteEmailTemplates: (deletedEmailTemplate: IEmailTemplate) => set(produce((state: { EmailTemplates: IEmailTemplate[] }) => {
        state.EmailTemplates = state.EmailTemplates.filter(s => s._id !== deletedEmailTemplate._id);
    })),
    addEmailTemplates: (newEmailTemplate: IEmailTemplate) => set(produce((state: { EmailTemplates: IEmailTemplate[] }) => {
        state.EmailTemplates.push(newEmailTemplate);
    })),
    updateLastFetch: () => set({ lastFetch: Date.now() }),
    fetchEmailTemplates: async () => {
    const currentTime = Date.now();
    const cacheDuration = isCacheDuration;
    const lastFetch = get().lastFetch;
    if (currentTime - lastFetch > cacheDuration || get().EmailTemplates.length === 0) {
        const response = await GET_EMAIL_TEMPLATE();
        if (response.success && response.data) {
            set({ EmailTemplates: response.data });
            set({ lastFetch: currentTime });
        }
    }
   
   
   
   
    }   
}),
{ name: "EmailTemplatesStore" }
))
