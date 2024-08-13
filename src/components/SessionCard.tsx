'use client'
import React, { useState } from "react";
import { ISessionWithDetails } from "@/libs/actions/Get";
/* librairies */
import { Tooltip } from "antd";


/*components*/ 
import Modal from "@/components/Modal";
import SessionDetailCard from "@/components/SessionDetailCard";
/*icons*/
import { RiCalendarCloseFill } from "react-icons/ri";
import { TbListDetails } from "react-icons/tb";
import { IoMdPersonAdd } from "react-icons/io";




type Props = {
  customerSession: ISessionWithDetails;
};

function SessionCard({ customerSession }: Props) {
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const handleCloseDetailsModal = () => setIsDetailsModalOpen(false);
  return (
    <>
    <div className="flex flex-col gap-2 justify-evenly min-w-fit w-full max-w-[350px] bg-slate-700 dark:bg-sky-800 rounded-md px-3 pt-3 pb-1 text-white relative shadow-md shadow-slate-400 dark:shadow-sky-400">
      <div className=" w-full  flex flex-col ">
        <p className="text-center text-xl font-semibold m-0">
          {customerSession.activity.name}
        </p>
        {+customerSession.placesReserved > 0 && (
          <small className="text-xs font-light text-orange-500 text-center">
            🚀 {customerSession.placesReserved} places réservées 🚀
          </small>
        )}
      </div>
      <div className="flex flex-col gap-1 w-full text-xs ">
        <p>
          <span className="font-semibold">Date : </span>
          {new Date(customerSession.date).toLocaleDateString()}
        </p>
        <p>
          <span className="font-semibold">Horaire : </span>
          {`de ${customerSession.startTime} à ${customerSession.endTime}`}
        </p>
        <p>
          <span className="font-semibold">Lieu : </span>{" "}
          {customerSession.spot.name}
        </p>

        <p>
          <span className="font-semibold">Places disponibles : </span>
          {+customerSession.placesMax - +customerSession.placesReserved}
        </p>
      </div>

      <div className="flex justify-end  items-center gap-4 w-full text-slate-400 ">

        <Tooltip title="Voir les détails">
          <TbListDetails className="text-2xl hover:text-slate-200 cursor-pointer transition-all" onClick={() => setIsDetailsModalOpen(true)} />
        </Tooltip>
        <Tooltip title="Ajouter des participants">
          <IoMdPersonAdd className="text-2xl hover:text-slate-200 cursor-pointer transition-all" />
        </Tooltip>

        <Tooltip
          title={
            +customerSession.placesReserved > 0
              ? "Annuler les réservations"
              : "Archiver la session"
          }
        >
          <RiCalendarCloseFill className="text-2xl hover:text-red-500 cursor-pointer transition-all" />
        </Tooltip>
      </div>
    </div>
    <Modal isOpen={isDetailsModalOpen} onClose={handleCloseDetailsModal}>
        <SessionDetailCard customerSession={customerSession} />
    </Modal>
    </> 
  );
}

export default SessionCard;
