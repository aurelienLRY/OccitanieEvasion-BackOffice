"use client";
import React, { useState } from "react";



/* Store */
import { useSessionWithDetails } from "@/context/store";

/* Components */
import { IconButton } from "@/components/Button";
import { SessionForm } from "@/components/form";
import AllSessionsCard from "@/components/AllSessionsCard";
/* Icons */
import { IoMdAddCircle } from "react-icons/io";
import { RiCalendarCloseFill } from "react-icons/ri";
import { MdOutlineUpdate } from "react-icons/md";

/**
 * SessionPage Component
 * @returns JSX.Element
 */
const SessionPage = () => {
  const [isOpenCreate, setIsOpenCreate] = useState(false);
  const sessionsWithDetails = useSessionWithDetails(
    (state) => state.SessionWithDetails
  );

  return (
    <div className="w-full flex flex-col items-center gap-12">
      <div className="flex flex-row gap-4  justify-around items-center min-w-[280px] w-full max-w-[600px]">
        <IconButton
          title="Créer une session"
          icon={<IoMdAddCircle className="text-4xl" />}
          onClick={() => setIsOpenCreate(true)}
        />
        <IconButton
          title="Modifier une session"
          icon={<MdOutlineUpdate className="text-4xl" />}
          onClick={() => alert("Tu dois la coder ! 💻")}
        />
        <IconButton
          title="Supprimer une session"
          icon={<RiCalendarCloseFill className="text-4xl" />}
          onClick={() => alert("Tu dois la coder ! 💻")}
        />
      </div>

        <AllSessionsCard sessionsWithDetails={sessionsWithDetails} />


      <SessionForm
        isOpen={isOpenCreate}
        onClose={() => setIsOpenCreate(false)}
        sessionData={undefined}
      />
    </div>
  );
};

export default SessionPage;
