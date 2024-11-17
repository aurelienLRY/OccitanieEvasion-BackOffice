"use client";
/* Libs */
import React, { useEffect, useState } from "react";
import { useAuth } from "@/hook/useAuth";
import { Spin } from "antd";


/* Components */
import { SingOutBtn  , Dashboard  } from "@/components";

/* Store */
import {
  useSessionWithDetails,
  useSpots,
  useActivities,
  useCustomerSessions,
} from "@/store";

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
        await Promise.all([
          useSessionWithDetails.getState().fetchSessionWithDetails(),
          useSpots.getState().fetchSpots(),
          useActivities.getState().fetchActivities(),
          useCustomerSessions.getState().fetchCustomerSessions(),
        ]);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
        setIsLoading(false);
      } finally {
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
