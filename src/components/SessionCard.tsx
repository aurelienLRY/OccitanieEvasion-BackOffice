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
import { SessionForm, CustomerSessionForm } from "@/components/form";
import CanceledCustomerSession from "@/components/CanceledCustomerSession";
import { ItemCard, ItemCardInner } from "@/components/ItemCard";

/* utils */
import { calculateSessionIncome } from "@/utils/price";

/* Types */
import { ISessionWithDetails } from "@/types";
/*icons*/
import { RiCalendarCloseFill } from "react-icons/ri";
import { TbListDetails } from "react-icons/tb";
import { IoMdPersonAdd } from "react-icons/io";
import { MdOutlineUpdate } from "react-icons/md";

type Props = {
  sessionWithDetails: ISessionWithDetails;
};

/**
 * SessionCard Component
 * @param customerSession: ISessionWithDetails
 * @returns JSX.Element
 */
function SessionCard({ sessionWithDetails }: Props) {
  // GESTION DES MODALS
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false); // modal details
  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false); // modal add customer
  const [isUpdateSessionModalOpen, setIsUpdateSessionModalOpen] =
    useState(false); // modal update session
  const [
    isCanceledCustomerSessionModalOpen,
    setIsCanceledCustomerSessionModalOpen,
  ] = useState(false);
  const [calculateRevenue, setCalculateRevenue] = useState(0);

  // modal canceled customer session
  const { updateSessionWithDetails, deleteSessionWithDetails } =
    useSessionWithDetails();

  // Vérifie si tous les clients sont annulés
  const customerIsCancelled = () =>
    sessionWithDetails?.customerSessions?.every(
      (cs) => cs.status === "Canceled"
    );

  const customerIsWaiting = () =>
    sessionWithDetails?.customerSessions?.some((cs) => cs.status === "Waiting");

  const customerWaitingCount = () =>
    sessionWithDetails?.customerSessions?.filter(
      (cs) => cs.status === "Waiting"
    ).length;

  // Statuts vérifiés
  const checked = {
    customerIsCancelled: customerIsCancelled(),
    customerIsWaiting: customerIsWaiting(),
    isArchived: sessionWithDetails.status === "Archived",
    isReserved: +sessionWithDetails.placesReserved > 0,
    isPending: sessionWithDetails.status === "Pending",
    isActive: sessionWithDetails.status === "Actif",
  };

  React.useEffect(() => {
    setCalculateRevenue(calculateSessionIncome(sessionWithDetails));
  }, [sessionWithDetails]);

  // Supprimer une session
  const deleteSession = async (sessionId: string) => {
    if (window.confirm("Voulez-vous vraiment supprimer cette session ?")) {
      const result = await DELETE_SESSION(sessionId);
      if (result.success) {
        toast.success("Session supprimée avec succès");
        deleteSessionWithDetails(sessionWithDetails);
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
          activity: session.activity._id as string,
          spot: session.spot._id as string,
          status: "Archived" ,
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
      <ItemCard
        className={`flex flex-col gap-4 min-w-[350px] ${
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
            {sessionWithDetails.activity.name}
          </p>
          {checked.isReserved && (
            <small className="text-xs font-light text-orange-500 text-center">
              🚀 {sessionWithDetails.placesReserved} places réservées 🚀
            </small>
          )}

          {checked.isReserved && calculateRevenue > 0 && (
            <p className="text-center text-sm font-semibold">
              💲 {calculateRevenue}€ 💲
            </p>
          )}
        </div>
        <ItemCardInner className="flex flex-col  w-full text-sm">
          <p>
            <span className="font-semibold">Date : </span>
            {new Date(sessionWithDetails.date).toLocaleDateString()}
          </p>
          <p>
            <span className="font-semibold">Horaire : </span>
            {`de ${sessionWithDetails.startTime} à ${sessionWithDetails.endTime}`}
          </p>
          <p>
            <span className="font-semibold">Lieu : </span>
            {sessionWithDetails.spot.name}
          </p>
          <p>
            <span className="font-semibold">Places disponibles : </span>
            {+sessionWithDetails.placesMax - +sessionWithDetails.placesReserved}
          </p>
          <p>
            <span className="font-semibold">Formule : </span>
            {sessionWithDetails.type_formule === "half_day"
              ? "demi-journée"
              : "journée"}{" "}
          </p>
        </ItemCardInner>

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
                <button onClick={() => SwitchAction(sessionWithDetails)}>
                  <RiCalendarCloseFill className="text-2xl hover:text-red-500 cursor-pointer transition-all" />
                </button>
              </Tooltip>
            </>
          )}

          {checked.isArchived && checked.customerIsCancelled && (
            <Tooltip title="Supprimer la session">
              <button onClick={() => deleteSession(sessionWithDetails._id)}>
                <RiCalendarCloseFill className="text-2xl hover:text-slate-200 cursor-pointer transition-all" />
              </button>
            </Tooltip>
          )}
        </div>
      </ItemCard>
      {/* MODALS DETAILS */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
      >
        <SessionDetailCard customerSession={sessionWithDetails} />
      </Modal>
      <CanceledCustomerSession
        isOpen={isCanceledCustomerSessionModalOpen}
        data={sessionWithDetails}
        onClose={() => setIsCanceledCustomerSessionModalOpen(false)}
      />

      <SessionForm
        sessionData={sessionWithDetails}
        isOpen={isUpdateSessionModalOpen}
        onClose={() => setIsUpdateSessionModalOpen(false)}
      />

      <CustomerSessionForm
        session={sessionWithDetails}
        isOpen={isAddCustomerModalOpen}
        onClose={() => setIsAddCustomerModalOpen(false)}
      />
    </>
  );
}

export default SessionCard;
