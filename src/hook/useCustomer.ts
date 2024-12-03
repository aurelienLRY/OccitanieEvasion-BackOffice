"use client";

import { generateEvent } from "@/services/GoogleCalendar/generateEvent";
import { fetcherUpdateEvent } from "@/services/GoogleCalendar/fetcherUpdateEvent";
import { useProfile, useSessionWithDetails } from "@/store";
import { ICustomerSession } from "@/types";
import { useState } from "react";
import { CANCEL_CUSTOMER_SESSION } from "@/libs/actions";
import { toast } from "sonner";
import { ToasterAction } from "@/components";

export const useCustomer = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { profile } = useProfile();
  const { updateSessionWithDetails } = useSessionWithDetails();

  const CancelCustomer = async (customer: ICustomerSession) => {
    window.confirm(
      `Voulez-vous annuler ${customer.first_names} ${customer.last_name} ?`
    );
    setIsSubmitting(true);
    const act = await CANCEL_CUSTOMER_SESSION(customer._id);
    if (act.success && act.data) {
      updateSessionWithDetails(act.data);
      const refreshToken = profile?.tokenRefreshCalendar;
      if (refreshToken) {
        const event = generateEvent(act.data);
        await fetcherUpdateEvent(refreshToken, event, act.data._id);
      } else {
        toast.error(
          "Votre calendrier n'est pas connecté, l'évènement n'a pas été mis à jour dans votre calendrier"
        );
      }
    }
    ToasterAction({ result: act, defaultMessage: "Client annulé avec succès" });
    setIsSubmitting(false);
  };

  return { CancelCustomer, isSubmitting };
};
