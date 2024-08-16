"use client";
import React, { Suspense, useEffect, useState } from "react";
import SessionForm from "@/components/form/sessionForm";

import { GET_SESSIONS_WITH_DETAILS } from "@/libs/actions/Get";
import { ISessionWithDetails } from "@/libs/actions/Get";
import AllSessionsCard from "@/components/AllSessionsCard";

type Props = {};

const SessionPage = (props: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customerSessions, setCustomerSessions] = useState<
    ISessionWithDetails[]
  >([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const req = await GET_SESSIONS_WITH_DETAILS();
      const result = await req;
      setCustomerSessions(result);
      console.log(result);
    };

    fetchUsers();
  }, []);

  return (
    <div className="w-full flex flex-col gap-12">
      <div className="flex gap-8 justify-end  items-center  ">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-orange-500 hover:bg-orange-600 transition-all duration-300 text-white px-4 py-2 rounded-md text-sm"
        >
          Créer une session
        </button>
      </div>
      <div>
        <Suspense fallback={<div>Chargement...</div>}>
          <AllSessionsCard customerSessions={customerSessions}  />
        </Suspense>
      </div>
      <SessionForm
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        sessionData={undefined}
      />
    </div>
  );
};

export default SessionPage;
