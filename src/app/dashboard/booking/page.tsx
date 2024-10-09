"use client";
import React from "react";

/* store */
import { useSessionWithDetails, useCustomerSessions } from "@/context/store";
/* COMPONENTS */
import { DetailButton, EditButton, DeleteButton } from "@/components/Button";
import { GlobalPriceBadge } from "@/components/badge";
import CustomerBookingTable from "@/components/CustomerBookingTable";

/* types */
import { ICustomerSession, ISessionWithDetails } from "@/types";

/* utils */
import { getMonthValue } from "@/utils/date";
import CustomerCard from "@/components/CustomerCard";
/* icons*/
import { FaRegEye } from "react-icons/fa";
import { Tooltip } from "antd";
import { BiEditAlt } from "react-icons/bi";


const BookingPage = () => {
  const sessionWithDetails = useSessionWithDetails(
    (state) => state.SessionWithDetails
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  function getSortedSessionByMonthAndYear(
    sessionWithDetails: ISessionWithDetails[]
  ) {
    const sortedSession = sessionWithDetails.reduce(
      (acc: any, session: ISessionWithDetails) => {
        const date = new Date(session.date);
        const month = date.getMonth();
        const year = date.getFullYear();
        acc[year] = acc[year] || [];
        acc[year][month] = acc[year][month] || [];
        acc[year][month].push(session);
        return acc;
      },
      []
    );

    return sortedSession;
  }

  const sortedSession = getSortedSessionByMonthAndYear(sessionWithDetails);

  return (
  <>
      {sortedSession.map((data: any, index: number) => (
        <div key={index} className="flex flex-col gap-6 min-w-[350px]  w-full max-w-[1500px] p-4 ">
          {data.map((arraySessionWithDetails: any, index2: number) => (
            <div key={index2} className="flex flex-col gap-2 items-center md:items-start">
              <h2 className="text-4xl font-bold">
                {getMonthValue(index2)} {index}
              </h2>
              <div className="flex flex-col gap-2 w-full">
                {arraySessionWithDetails.map(
                  (sessionWithDetails: any, index3: number) =>
                    sessionWithDetails.customerSessions.length >= 1 && (
                      <CustomerBookingTable key={index3} data={sessionWithDetails}/>
                    )
                )}
              </div>
            </div>
          ))}
        </div>
      ))}
  </>
  );
};

export default BookingPage;

/*
 *  @description: displayStatusBadge est une fonction qui affiche le badge de statut en fonction du statut du customerSession
 *  @param {ICustomerSession} customerSession
 *  @returns {React.ReactNode}
 */
function displayStatusBadge(customerSession: ICustomerSession) {
  switch (customerSession.status) {
    case "Waiting":
      return (
        <p className="p-1 bg-yellow-500 bg-opacity-50 border border-yellow-500 rounded-md text-sm flex flex-col items-center">
          <span className="">en attente</span>{" "}
          <span className="text-xs text-yellow-500">
            depuis le{" "}
            {customerSession.createdAt &&
              new Date(customerSession.createdAt).toLocaleDateString()}
          </span>
        </p>
      );
    case "Validated":
      return (
        <p className="p-1 bg-green-500 bg-opacity-50 border border-green-500 rounded-md text-sm flex flex-col items-center">
          <span className="">Confirmé</span>{" "}
          <span className="text-xs text-green-500">
            le{" "}
            {customerSession.validatedAt &&
              new Date(customerSession.validatedAt).toLocaleDateString()}
          </span>
        </p>
      );
    case "Canceled":
      return (
        <p className="p-1 bg-red-500 bg-opacity-50 border border-red-500 rounded-md text-sm flex flex-col items-center">
          <span className="">Annulé</span>{" "}
          <span className="text-xs text-red-500">
            le{" "}
            {customerSession.canceledAt &&
              new Date(customerSession.canceledAt).toLocaleDateString()}
          </span>
        </p>
      );
  }
}
