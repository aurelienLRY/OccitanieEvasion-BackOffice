"use client";
/* Libs */
import React, { useEffect, useState } from "react";
import { useAuth } from "@/utils/useAuth";
import { Spin } from "antd";

/* Actions */
import {
  GET_SESSIONS_WITH_DETAILS,
  GET_SPOTS,
  GET_ACTIVITIES,
  GET_CUSTOMER_SESSIONS,
} from "@/libs/actions";

/* Components */
import SingOutBtn from "@/components/singOut";
import Dashboard from "@/components/Dashboard";
import ToasterAction from "@/components/ToasterAction";

/* Store */
import {
  useSessionWithDetails,
  useSpots,
  useActivities,
  useCustomerSessions,
} from "@/context/store";

/**
 * Template Component
 * @param children: React.ReactNode
 * @returns JSX.Element
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sessionWithDetails, spots, activities, customerSessions] = await Promise.all([
          GET_SESSIONS_WITH_DETAILS(),
          GET_SPOTS(),
          GET_ACTIVITIES(),
          GET_CUSTOMER_SESSIONS(),
        ]);

        // Get Sessions with details and add them to the store
        if (sessionWithDetails.success && sessionWithDetails.data) {
          useSessionWithDetails.setState({
            SessionWithDetails: sessionWithDetails.data,
          });
        }
        else if (!sessionWithDetails.success) {
          ToasterAction({result: sessionWithDetails, defaultMessage: "Erreur lors du chargement des sessions avec détails"})
        }

        // Get Customer Sessions and add them to the store
        if (customerSessions.success && customerSessions.data) {
          useCustomerSessions.setState({
            CustomerSessions: customerSessions.data,
          });
        }
        // Get Spots and add them to the store
        if (spots.success && spots.data) {
          useSpots.setState({
            Spots: spots.data,
          });
        }
        // Get Activities and add them to the store
        if (activities.success && activities.data) {
          useActivities.setState({
            Activities: activities.data,
          });
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get the user status
  const { status } = useAuth();
  const sessionsWithDetails = useSessionWithDetails(
    (state) => state.SessionWithDetails
  );



  // If the user status is loading, return a loading message
  if (status === "loading" || isLoading) {
    return (
      <div className="flex gap-4 flex-col items-center justify-center h-screen">
        <Spin size="large" />
        <p>Chargement des données.</p>
      </div>
    );
  }

  return (
    <Dashboard sessionsWithDetails={sessionsWithDetails}>
      {children}
      <SingOutBtn />
    </Dashboard>
  );
}

export const getPathname = (pathname: string) => {
  switch (pathname) {
    case "/dashboard":
      return "Dashboard";
    case "/dashboard/session":
      return "Sessions";
    case "/dashboard/booking":
      return "Réservations";
    case "/dashboard/spot":
      return "Lieux";
    case "/dashboard/activity":
      return "Activités";
    case "/dashboard/email":
      return "Email";

    
    
      default:
      return "Dashboard";
  }
};
