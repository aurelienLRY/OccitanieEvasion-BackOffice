"use client";

/* librairies */
import { Tooltip } from "antd";
import { toast } from "sonner";
import React, { useState } from "react";
/*actions*/
import { DELETE_SESSION } from "@/libs/actions";
import { UPDATE_SESSION } from "@/libs/actions";

/*store*/
import { useSessionWithDetails } from "@/context/store";

/*components*/
import Modal from "@/components/Modal";
import SessionDetailCard from "@/components/SessionDetailCard";
import AddCustomerOfSession from "@/components/form/addCustomerOfSession";
import UpdateSessionForm from "@/components/form/updateSession";
import CanceledCustomerSession from "@/components/CanceledCustomerSession";

/* Types */
import { ISessionWithDetails } from "@/types";
/*icons*/
import { RiCalendarCloseFill } from "react-icons/ri";
import { TbListDetails } from "react-icons/tb";
import { IoMdPersonAdd } from "react-icons/io";
import { MdOutlineUpdate } from "react-icons/md";

type Props = {
  customerSession: ISessionWithDetails;
};

/**
 * SessionCard Component
 * @param customerSession: ISessionWithDetails
 * @returns JSX.Element
 */
function SessionCard({ customerSession }: Props) {
  // GESTION DES MODALS
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false); // modal details
  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false); // modal add customer
  const [isUpdateSessionModalOpen, setIsUpdateSessionModalOpen] =
    useState(false); // modal update session
  const [
    isCanceledCustomerSessionModalOpen,
    setIsCanceledCustomerSessionModalOpen,
  ] = useState(false);

  // modal canceled customer session
  const { updateSessionWithDetails, deleteSessionWithDetails } =
    useSessionWithDetails();

  // Vérifie si tous les clients sont annulés
  const customerIsCancelled = () =>
    customerSession.customerSessions.every((cs) => cs.status === "Canceled");

  const customerIsWaiting = () =>
    customerSession.customerSessions.some((cs) => cs.status === "Waiting");

  const customerWaitingCount = () =>
    customerSession.customerSessions.filter((cs) => cs.status === "Waiting")
      .length;

  // Statuts vérifiés
  const checked = {
    customerIsCancelled: customerIsCancelled(),
    customerIsWaiting: customerIsWaiting(),
    isArchived: customerSession.status === "Archived",
    isReserved: +customerSession.placesReserved > 0,
    isPending: customerSession.status === "Pending",
    isActive: customerSession.status === "Actif",
  };

  // Supprimer une session
  const deleteSession = async (sessionId: string) => {
    if (window.confirm("Voulez-vous vraiment supprimer cette session ?")) {
      const result = await DELETE_SESSION(sessionId);
      if (result.success) {
        toast.success("Session supprimée avec succès");
        deleteSessionWithDetails(customerSession);
      } else {
        toast.error("Erreur lors de la suppression de la session");
      }
    }
  };

  // Action de bascule (archiver ou annuler les réservations)

  //TODO: pb de soustraction des places réservées
  const SwitchAction = async (session: ISessionWithDetails) => {
    if (checked.customerIsCancelled && !checked.isArchived) {
      if (window.confirm("Voulez-vous vraiment archiver cette session ?")) {
        const result = await UPDATE_SESSION(session._id, {
          ...session,
          activity: session.activity._id,
          spot: session.spot._id,
          status: "Archived",
        });
        if (result.success) {
          updateSessionWithDetails({ ...session, status: "Archived" });
          toast.success("Session archivée avec succès");
        } else {
          if (result.feedback) {
            toast.error(result.feedback);
          }
        }
      }
    } else if (
      checked.isReserved &&
      !checked.isArchived &&
      !checked.customerIsCancelled
    ) {
      setIsCanceledCustomerSessionModalOpen(true);
    }
  };

  return (
    <>
      <div
        className={`flex flex-col gap-2 justify-evenly min-w-fit w-full max-w-[350px] bg-slate-700 dark:bg-sky-800 rounded-md px-3 pt-3 pb-1 text-white relative shadow-md shadow-slate-400 dark:shadow-sky-400 border-opacity-65 ${
          checked.isArchived
            ? "opacity-60 border-e-8 border-red-500"
            : checked.isPending
            ? "border-e-8 border-orange-500"
            : checked.isActive
            ? "border-e-8 border-green-500"
            : "opacity-100"
        }`}
      >
        <div className="w-full flex flex-col">
          <p className="text-center text-xl font-semibold m-0">
            {customerSession.activity.name}
          </p>
          {checked.isReserved && (
            <small className="text-xs font-light text-orange-500 text-center">
              🚀 {customerSession.placesReserved} places réservées 🚀
            </small>
          )}
        </div>
        <div className="flex flex-col gap-1 w-full text-xs">
          <p>
            <span className="font-semibold">Date : </span>
            {new Date(customerSession.date).toLocaleDateString()}
          </p>
          <p>
            <span className="font-semibold">Horaire : </span>
            {`de ${customerSession.startTime} à ${customerSession.endTime}`}
          </p>
          <p>
            <span className="font-semibold">Lieu : </span>
            {customerSession.spot.name}
          </p>
          <p>
            <span className="font-semibold">Places disponibles : </span>
            {+customerSession.placesMax - +customerSession.placesReserved}
          </p>
        </div>

        <div className="flex justify-end items-center gap-4 w-full text-slate-400">
          {checked.isReserved && (
            <Tooltip title="Voir les détails">
              <button
                onClick={() => setIsDetailsModalOpen(true)}
                className="relative"
              >
                <TbListDetails
                  className={`text-2xl hover:text-slate-200 cursor-pointer transition-all ${
                    checked.customerIsWaiting
                      ? "text-orange-600"
                      : "text-slate-400"
                  }`}
                />
                {checked.customerIsWaiting && (
                  <span className="absolute -top-1 -right-2 bg-orange-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {customerWaitingCount()}
                  </span>
                )}
              </button>
            </Tooltip>
          )}

          {!checked.isArchived && (
            <>
              <Tooltip title="Ajouter des participants">
                <button onClick={() => setIsAddCustomerModalOpen(true)}>
                  <IoMdPersonAdd className="text-2xl hover:text-slate-200 cursor-pointer transition-all" />
                </button>
              </Tooltip>

              <Tooltip title="Modifier la session">
                <button onClick={() => setIsUpdateSessionModalOpen(true)}>
                  <MdOutlineUpdate className="text-2xl hover:text-slate-200 cursor-pointer transition-all" />
                </button>
              </Tooltip>

              <Tooltip
                title={
                  checked.isReserved
                    ? "Annuler les réservations"
                    : "Archiver la session"
                }
              >
                <button onClick={() => SwitchAction(customerSession)}>
                  <RiCalendarCloseFill className="text-2xl hover:text-red-500 cursor-pointer transition-all" />
                </button>
              </Tooltip>
            </>
          )}

          {checked.isArchived && checked.customerIsCancelled && (
            <Tooltip title="Supprimer la session">
              <button onClick={() => deleteSession(customerSession._id)}>
                <RiCalendarCloseFill className="text-2xl hover:text-slate-200 cursor-pointer transition-all" />
              </button>
            </Tooltip>
          )}
        </div>
      </div>

      {/* MODALS DETAILS */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
      >
        <SessionDetailCard customerSession={customerSession} />
      </Modal>
      <CanceledCustomerSession
        isOpen={isCanceledCustomerSessionModalOpen}
        data={customerSession}
        onClose={() => setIsCanceledCustomerSessionModalOpen(false)}
      />

      <UpdateSessionForm
        sessionData={customerSession}
        isOpen={isUpdateSessionModalOpen}
        onClose={() => setIsUpdateSessionModalOpen(false)}
      />

      <AddCustomerOfSession
        session={customerSession}
        isOpen={isAddCustomerModalOpen}
        onClose={() => setIsAddCustomerModalOpen(false)}
      />
    </>
  );
}

export default SessionCard;
