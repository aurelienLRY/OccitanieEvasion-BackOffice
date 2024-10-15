"use client";
import React, { useEffect, useState } from "react";

/* store */
import { useSessionWithDetails } from "@/context/store";
/* COMPONENTS */
import CustomerBookingTable from "@/components/CustomerBookingTable";
import {CustomerSessionForm} from "@/components/form"
import CustomerFiche from "@/components/CustomerFiche";

/*Hook*/
import { useModal } from "@/hook";

/* types */
import { ICustomerSession, ISessionWithDetails } from "@/types";

/* utils */
import { getMonthValue } from "@/utils";

const BookingPage = () => {
  const { SessionWithDetails: sessionWithDetails } = useSessionWithDetails(); // Correction de l'expression


  const [sortedSession, setSortedSession] = useState<ISessionWithDetails[][]>([]); // Utilisation du type correct

  useEffect(() => {
    const sortSession = [...sessionWithDetails].sort((a: ISessionWithDetails, b: ISessionWithDetails) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    setSortedSession(getSortedSessionByMonthAndYear(sortSession));
  }, [sessionWithDetails]);

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



type TEditData = {
  data: ICustomerSession, 
  session: ISessionWithDetails
}
  const editCustomer = useModal<TEditData>()
  const detailCustomerModal= useModal<ICustomerSession>()

  console.log("editCustomer", editCustomer)

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
                      <CustomerBookingTable 
                      key={index3}
                      data={sessionWithDetails} 
                      customerFiche={detailCustomerModal.openModal}
                      editCustomer={editCustomer.openModal}
                      deleteCustomer={() => alert("tu dois coder")}
                      />
                    )
                )}
              </div>
            </div>
          ))}
        </div>
      ))}

      {/* les modals*/}
      {
        editCustomer.data && 
      <CustomerSessionForm 
      isOpen={editCustomer.isOpen}
      onClose={editCustomer.closeModal}
      data={editCustomer.data.data}
      session={editCustomer.data.session}
      />}

      
      
      {detailCustomerModal.data &&
      <CustomerFiche 
      customer={detailCustomerModal.data}
      onClose={detailCustomerModal.closeModal}
      isOpen={detailCustomerModal.isOpen}  
      />
      }


  </>
  );
};

export default BookingPage;
