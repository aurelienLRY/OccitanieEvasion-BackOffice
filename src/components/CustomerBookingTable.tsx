/* Librairies */
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip } from "antd";

/* Components */
import { DetailButton, EditButton, DeleteButton } from "@/components/Button";
import { GlobalPriceBadge, StatusBadge } from "@/components/badge";

/* Utils */
import { cn } from "@/utils/cn";
/* Types */
import { ISessionWithDetails } from "@/types";

type Props = {
  data: ISessionWithDetails;
};

const variants = {
  open: { opacity: 1, height: "auto", transition: { duration: 0.3 } },
  closed: { opacity: 0, height: 0, transition: { duration: 0.2 } },
};

export default function CustomerBookingTable({ data }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleTable = () => {
    setIsOpen(!isOpen);
  };

  return (
    <article className="overflow-hidden w-full border border-slate-300 dark:border-sky-700 rounded-md ">
      <div
        id="customer-booking-table-header"
        className="flex justify-between items-center bg-slate-500 dark:bg-sky-900 px-4 py-3 rounded-t-md w-full text-white"
      >
        <h3 className="text-xl font-bold text-center md:text-left">
          {data.activity.name} du {new Date(data.date).toLocaleDateString()}
        </h3>
        <DetailButton
          title="Voir le détail"
          onClick={toggleTable}
          className={cn(
            "transition-all duration-300",
            isOpen ? "text-green-500" : "text-slate-500 "
          )}
        />
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={variants}
            initial="closed"
            animate="open"
            exit="closed"
            className="overflow-x-auto w-full"
          >
            <motion.table className="min-w-full">
              <thead className="bg-slate-300 dark:bg-sky-600 text-white">
                <tr>
                  <th className=" text-center py-2 px-2">Nom</th>
                  <th className="text-center py-2 px-1">Contact</th>
                  <th className="text-center py-2 px-1">Status</th>
                  <th className="text-center py-2 px-1">Enregistré par</th>
                  <th className="text-center py-2 px-1">Prix total</th>
                  <th className="text-center py-2 px-1"></th>
                </tr>
              </thead>
              <tbody className="text-sm text-center rounded-md">
                {data.customerSessions.map((customerSession, index) => (
                  <tr
                    key={index}
                    className="h-16 border-b rounded-md border-slate-300 dark:border-sky-700 hover:bg-slate-200 dark:hover:bg-orange-500 transition-all duration-300"
                  >
                    <td className="text-center px-2">
                      <div className="flex flex-col text-xl font-bold">
                        <span>
                          {customerSession.last_name.charAt(0).toUpperCase() +
                            customerSession.last_name
                              .slice(1)
                              .toLocaleLowerCase()}{" "}
                          {customerSession.first_names.charAt(0).toUpperCase() +
                            customerSession.first_names
                              .slice(1)
                              .toLocaleLowerCase()}
                        </span>
                        <Tooltip title="Appeler">
                          <a
                            href={`tel:${customerSession.phone}`}
                            className="m-0 p-0 text-xs font-normal text-slate-500"
                          >
                            {customerSession.phone}
                          </a>
                        </Tooltip>
                      </div>
                    </td>

                    <td className="text-center  px-1">
                      <Tooltip title="Envoyer un email">
                        <a href={`mailto:${customerSession.email}`} className="">
                          {customerSession.email}
                        </a>
                      </Tooltip>
                    </td>

                    <td className="text-center  px-1">
                      <div className="flex justify-center items-center">
                        <StatusBadge
                          customerSession={customerSession}
                          className="max-w-fit px-4"
                        />
                      </div>
                    </td>

                    <td className="text-center px-1">
                      <div className="flex flex-col">
                        <span>{typeOfReservation(customerSession.typeOfReservation)}</span>
                        <span className="text-xs font-normal text-slate-500">{new Date(customerSession.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>




                    <td className="text-center  px-1">
                      <div className="flex justify-center items-center">
                        <GlobalPriceBadge price={customerSession.price_total} label={false}/>
                      </div>
                    </td>
                    <td className="text-center px-2">
                      <div className="flex gap-3 items-center justify-center ">
                        <DetailButton
                          title="Voir le détail"
                          onClick={() => alert("tu dois le coder")}
                        />
                        <EditButton
                          title="Modifier"
                          onClick={() => alert("tu dois le coder")}
                        />
                        <DeleteButton
                          title="Annuler"
                          onClick={() => alert("tu dois le coder")}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </motion.table>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}

// affiche une équivalence pou ui en fonction de la customerSession.typeOfReservation
const typeOfReservation = (typeOfReservation: string) => {
  switch (typeOfReservation) {
    case "ByCompany":
      return "Entreprise";
    case "ByWeb":
      return "site web";
    case "ByPhone":
      return "Téléphone";
  }
}
