"use client";
import React, { useState } from "react";
import { ISessionWithDetails } from "@/libs/actions/Get";

/* librairies */
import { Tooltip } from "antd";

/*actions*/
import { DELETE_SESSION } from "@/libs/actions/Delete";
import { UPDATE_SESSION } from "@/libs/actions/Update";

/*components*/
import Modal from "@/components/Modal";
import SessionDetailCard from "@/components/SessionDetailCard";
import AddCustomerOfSession from "@/components/form/addCustomerOfSession";
import CustomerSession from "./CustomerSession";

/*types*/
import { ISession } from "@/libs/database/models/Session";

/*icons*/
import { RiCalendarCloseFill } from "react-icons/ri";
import { TbListDetails } from "react-icons/tb";
import { IoMdPersonAdd } from "react-icons/io";
import { MdOutlineUpdate } from "react-icons/md";

type Props = {
  customerSession: ISessionWithDetails;
};

function SessionCard({ customerSession }: Props) {
  {
    /* GESTION DES MODALS */
  }
  const [thisSession, setThisSession] =
    useState<ISessionWithDetails>(customerSession);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false); // modal details
  const handleCloseDetailsModal = () => setIsDetailsModalOpen(false); // close modal details
  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false); // modal add customer

  const customerIsCancelled = () => {
    let result = true;
    thisSession.customerSessions.forEach((cs) => {
      if (cs.status !== "cancelled") {
        result = false;
      }
    });
    return result;
  };

  {
    /* check if the customer is cancelled */
  }
  const checked = {
    customerIsCancelled: customerIsCancelled(),
    isArchived: thisSession.status === "Archived",
    isReserved: +thisSession.placesReserved > 0,
  };

  const archiveSession = async (Session: ISessionWithDetails, data: any) => {
    console.log("UpdateSession", data, Session);
  };

  const deleteSession = async (sessionId: string) => {
    console.log("deleteSession", sessionId);
    const result = await DELETE_SESSION(sessionId);
    console.log("deleteSession result : ", result);
  };



  const SwitchAction = async (session: ISessionWithDetails, data: any) => {
    if (checked.customerIsCancelled && !checked.isArchived) {
      const result = await UPDATE_SESSION(
        session._id,
        { status: "Archived" }
      );
     
      if (result) { 
        const { activity, spot, ...rest } = result;
        setThisSession((prevSession) => ({ ...prevSession, ...rest }));
      }
    } else if (
      checked.isReserved &&
      !checked.isArchived &&
      !checked.customerIsCancelled
    ) {
      console.log("Annuler les reservations", session._id);
    }
  };

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
          {checked.isReserved && (
            <Tooltip title="Voir les détails">
              <TbListDetails
                className="text-2xl hover:text-slate-200 cursor-pointer transition-all"
                onClick={() => setIsDetailsModalOpen(true)}
              />
            </Tooltip>
          )}

          {!checked.isArchived && (
            <Tooltip title="Ajouter des participants">
              <IoMdPersonAdd
                className="text-2xl hover:text-slate-200 cursor-pointer transition-all"
                onClick={() => setIsAddCustomerModalOpen(true)}
              />
            </Tooltip>
          )}

          {!checked.isArchived && (
            <Tooltip title="Modifier la session">
              <MdOutlineUpdate className="text-2xl hover:text-slate-200 cursor-pointer transition-all" />
            </Tooltip>
          )}

          {!checked.isArchived && (
            <Tooltip
              title={
                checked.isReserved
                  ? "Annuler les réservations"
                  : "Archiver la session"
              }
            >
              <RiCalendarCloseFill
                className="text-2xl hover:text-red-500 cursor-pointer transition-all"
                onClick={() =>
                  SwitchAction(thisSession, { status: "Archived" })
                }
              />
            </Tooltip>
          )}

          {checked.isArchived && checked.customerIsCancelled && (
            <Tooltip title="Supprimer la session">
              <RiCalendarCloseFill
                className="text-2xl hover:text-slate-200 cursor-pointer transition-all"
                onClick={() => deleteSession(thisSession._id)}
              />
            </Tooltip>
          )}
        </div>
      </div>
      <Modal isOpen={isDetailsModalOpen} onClose={handleCloseDetailsModal}>
        <SessionDetailCard customerSession={customerSession} />
      </Modal>
      <AddCustomerOfSession
        session={thisSession}
        isOpen={isAddCustomerModalOpen}
        onClose={() => setIsAddCustomerModalOpen(false)}
      />
    </>
  );
}

export default SessionCard;
