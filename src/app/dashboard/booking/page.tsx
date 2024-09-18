"use client";
import React from "react";

/* store */
import { useSessionWithDetails, useCustomerSessions } from "@/context/store";

/* types */
import { ISessionWithDetails } from "@/types";

/* utils */
import { getMonthValue } from "@/utils/date";
import CustomerCard from "@/components/CustomerCard";

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
    <div className="flex flex-col gap-4">
      {sortedSession.map((data: any, index: number) => (
        <div key={index}>
          {data.map((arraySessionWithDetails: any, index2: number) => (
            <div key={index2}>
              <h2 className="text-4xl font-bold">
                {getMonthValue(index2)} {index}
              </h2>
              <div className="flex flex-col gap-2">
                {arraySessionWithDetails.map(
                  (sessionWithDetails: any, index3: number) =>
                    sessionWithDetails.customerSessions.length >= 1 && (
                      <div key={index3} className="flex flex-col gap-2 ">
                        <div className="flex gap-2 items-center">
                          <p className="text-xl font-bold">
                            {new Date(
                              sessionWithDetails.date
                            ).toLocaleDateString()}
                          </p>
                          <p className="text-2xl font-bold">
                            {sessionWithDetails.activity.name}
                          </p>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-4 ">
                          {sessionWithDetails.customerSessions.map(
                            (customerSession: any, index4: number) => (
                              <CustomerCard
                                key={index4}
                                customer={customerSession}
                                className="bg-sky-800 shadow-md shadow-sky-800/50"
                              />
                            )
                          )}
                        </div>
                      </div>
                    )
                )}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default BookingPage;
