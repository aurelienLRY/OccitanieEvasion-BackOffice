/*libraries*/
import React from "react";

/*types*/
import { ICustomerSession, ISessionWithDetails } from "@/types";

/*components*/
import { CustomerCard , Modal , CustomerFiche } from "@/components";


/*utils*/
import { cn } from "@/utils/cn";
import { calculateSessionIncome } from "@/utils/price.utils";

/* Hooks */ 
import { useModal } from "@/hook";


/**
 * SessionDetailCard Component
 * @param {ISessionWithDetails} data - La session avec les détails du client.
 * @param {boolean} isOpen - Indicateur d'ouverture de la modal.
 * @param {() => void} onClose - Fonction de fermeture de la modal.
 * @returns {JSX.Element} Le composant carte de détail de session.
 */
export default function SessionDetailCard ({ data, isOpen, onClose }: { data: ISessionWithDetails, isOpen: boolean, onClose: () => void }) {



  const detailsCustomerModal = useModal<ICustomerSession>()

   console.log(detailsCustomerModal)

  const getPrice_total = calculateSessionIncome(data);
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
    <div className="flex flex-col gap-10 justify-evenly min-w-fit    text-white relative ">
      <div className=" w-full flex flex-col items-center   ">
          <p className="text-center text-2xl font-semibold m-0">
            {data.activity.name}
          </p>
          {+data.placesReserved > 0 && (
            <small className="text-lg font-light text-orange-500 text-center">
              🚀 {data.placesReserved} places réservées 🚀
            </small>
          )}
          {getPrice_total > 0 && (
            <p className="text-center text-sm font-semibold">
              💲 {getPrice_total}€ 💲
            </p>
          )}
      </div>
      <div className="flex flex-col">
        <p>
          <span className="font-semibold">Date : </span>
          {new Date(data.date).toLocaleDateString()}
        </p>
        <p>
          <span className="font-semibold">Horaire : </span>
          {`de ${data.startTime} à ${data.endTime}`}
        </p>
        <p>
          <span className="font-semibold">Lieu : </span>{" "}
          {data.spot.name}
        </p>

          <p>
            <span className="font-semibold">Places disponibles : </span>
            {+data.placesMax - +data.placesReserved}
          </p>
          <p>
            <span className="font-semibold">Formule : </span>
            {data.type_formule === "half_day" ? "demi-journée" : "journée"}
          </p>
      </div>
      <div className={cn(data.customerSessions.length >= 4 ? `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2  ` : `grid grid-cols-1 md:grid-cols-2  gap-2`, )}>
        {data.customerSessions.map((customerSession) => (
          <CustomerCard
            customer={customerSession}
            key={customerSession._id}
            detailsCustomer={detailsCustomerModal.openModal}
          />
        ))}
      </div>
    </div>
    { detailsCustomerModal && (
    <CustomerFiche 
    customer={detailsCustomerModal.data as ICustomerSession}
    isOpen = {detailsCustomerModal.isOpen}
    onClose={detailsCustomerModal.closeModal}
    /> )}
    </Modal>
  );
}
