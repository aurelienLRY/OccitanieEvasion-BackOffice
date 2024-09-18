/*libraries*/
import React from "react";

/*types*/
import { ISessionWithDetails } from "@/types";

/*components*/
import CustomerCard from "@/components/CustomerCard";

/*utils*/
import { cn } from "@/utils/cn";

/*
 * SessionDetailCard Component
 * @param customerSession: ISessionWithDetails
 * @returns JSX.Element
 */
export default function SessionDetailCard({ customerSession }: { customerSession: ISessionWithDetails }) {
  return (
    <div className="flex flex-col gap-10 justify-evenly min-w-fit   px-3 pt-3 pb-1 text-white relative ">
      <div className=" w-full flex flex-col items-center   ">
          <p className="text-center text-2xl font-semibold m-0">
            {customerSession.activity.name}
          </p>
          {+customerSession.placesReserved > 0 && (
            <small className="text-lg font-light text-orange-500 text-center">
              🚀 {customerSession.placesReserved} places réservées 🚀
            </small>
          )}
      </div>
      <div className="flex flex-col gap-1 ">
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
      <div className={cn(customerSession.customerSessions.length > 4 ? `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2  ` : `grid grid-cols-1 md:grid-cols-2  gap-2`, )}>
        {customerSession.customerSessions.map((customerSession) => (
          <CustomerCard
            customer={customerSession}
            key={customerSession._id}
          />
        ))}
      </div>
    </div>
  );
}
