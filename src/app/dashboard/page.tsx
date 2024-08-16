"use client";
import React, { Suspense, useEffect, useState } from "react";
import { useAuth } from "@/utils/useAuth";
import { GET_SESSIONS_WITH_DETAILS } from "@/libs/actions/Get";
import { ISessionWithDetails } from "@/libs/actions/Get";
import AllSessionsCard from "@/components/AllSessionsCard";

type Props = {};

const Dashboard = ({}: Props) => {
  const { session } = useAuth();


  
  const [customerSessions, setCustomerSessions] = useState<
    ISessionWithDetails[]
  >([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const req = await GET_SESSIONS_WITH_DETAILS();
      const result = await req;
      setCustomerSessions(result); 
    };

    fetchUsers();
  }, []);

  return (
      <Suspense fallback={<div>Chargement...</div>}>
        <AllSessionsCard customerSessions={customerSessions}  />
      </Suspense>

  );
};

export default Dashboard;

