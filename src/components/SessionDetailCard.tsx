import React from "react";
import { ISessionWithDetails } from "@/libs/actions/Get";
import CustomerSession from "@/components/CustomerSession";

type Props = {
  customerSession: ISessionWithDetails;
};

export default function SessionDetailCard({ customerSession }: Props) {
  return (
    <div className="flex flex-col gap-2 justify-evenly min-w-fit w-full max-w-[550px] bg-slate-700 dark:bg-sky-800 rounded-md px-3 pt-3 pb-1 text-white relative shadow-md shadow-slate-400 dark:shadow-sky-400">
      <div className=" w-full flex flex-col items-center   ">
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {customerSession.customerSessions.map((customerSession) => (
          <CustomerSession
            customer={customerSession}
            key={customerSession._id}
          />
        ))}
      </div>
    </div>
  );
}
