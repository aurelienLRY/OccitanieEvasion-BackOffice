"use client";
/* Librairies */
import { useState, useEffect } from "react";
import { cn } from "@/utils/cn";
import { Spin } from "antd";
/* Components */
import SessionCard from "@/components/SessionCard";
import { SessionForm , CustomerSessionForm  } from "@/components/form";
import CanceledCustomerSession from "@/components/CanceledCustomerSession";

/* Utils */
import { getSessionByStatus } from "@/utils";
import { SearchInObject } from "@/utils/search.utils";
import SessionDetailCard from "./SessionDetailCard";

/* Types */
import { ISessionWithDetails } from "@/types";

/* Hook */
import { useModal } from "@/hook";

/**
 * AllSessionsCard Component
 * @param sessionsWithDetails: ISessionWithDetails[]
 * @returns  JSX.Element
 */
export default function AllSessionsCard({
  sessionsWithDetails,
}: {
  sessionsWithDetails: ISessionWithDetails[];
}) {
  const [filter, setFilter] = useState<string>("all");
  const [filteredSessions, setFilteredSessions] = useState<
    ISessionWithDetails[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [status, setStatus] = useState<string>("Actif");
  const [search, setSearch] = useState<string>("");


const detailsModal = useModal<ISessionWithDetails>();
const updateSessionModal = useModal<ISessionWithDetails>();
const customerModal = useModal<ISessionWithDetails>();
const canceledCustomerModal = useModal<ISessionWithDetails>();









  useEffect(() => {
    setIsLoading(sessionsWithDetails.length === 0);
    const sortedSessions = [...sessionsWithDetails].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    const resultFilter = filterSessions(sortedSessions, filter, status);
    const resultSearch = SearchInObject(resultFilter, search);
    setFilteredSessions(resultSearch as ISessionWithDetails[]);
  }, [filter, sessionsWithDetails, status, search]);


  
  if (isLoading || sessionsWithDetails.length === 0) {
    if (sessionsWithDetails.length === 0) {
      return (
        <div className="flex flex-col gap-4 justify-center items-center w-screen min-h-60 ">
          <p>Aucune session trouvée.</p>
        </div>
      );
    } else {
      return (
        <div className="flex flex-col gap-4 justify-center items-center w-screen min-h-60 ">
          <Spin size="large" />
          <p>Chargement des données.</p>
        </div>
      );
    }
  }

  return (
    <div className="flex flex-col gap-4 w-full min-h-60 border-2 border-sky-700 dark:border-sky-900 rounded-md px-2 md:px-4 py-6">
      {/* filter NAV */}
      <div className="flex flex-col-reverse lg:flex-row justify-between gap-4 items-center w-full">
        <div className="flex flex-col md:flex-row gap-4 md:items-center">
          {/* filter Période */}
          <div className="flex gap-0 flex-col  items-center md:items-start  md:justify-center ">
            <div className=" text-lg text-start ms-2 opacity-50">Période</div>
            <div className="flex justify-center gap-4 text-xs min-h-6 font-light bg-sky-950 dark:bg-sky-800 rounded-md py-2 px-4 box-content max-w-fit">
              <button
                className={cn(
                  "px-2 rounded-md",
                  filter === "all"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-500"
                )}
                onClick={() => setFilter("all")}
              >
                All
              </button>
              <button
                className={cn(
                  "px-2 rounded-md",
                  filter === "thisMonth"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-500"
                )}
                onClick={() => setFilter("thisMonth")}
              >
                This month
              </button>{" "}
              <button
                className={cn(
                  "px-2 rounded-md",
                  filter === "thisWeek"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-500"
                )}
                onClick={() => setFilter("thisWeek")}
              >
                This week
              </button>
            </div>
          </div>
          {/* filter Statut */}
          <div className="flex gap-0 flex-col  items-center md:items-start  md:justify-center ">
            <div className=" text-lg text-start ms-2 opacity-50">Statut</div>
            <div className="flex justify-center gap-4 text-xs min-h-6 font-light bg-sky-950 dark:bg-sky-800 rounded-md py-2 px-4 box-content max-w-fit">
              <button
                className={cn(
                  "px-2 rounded-md",
                  status === "all"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-500"
                )}
                onClick={() => setStatus("all")}
              >
                All
              </button>
              <button
                className={cn(
                  "px-2 rounded-md",
                  status === "Actif"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-500"
                )}
                onClick={() => setStatus("Actif")}
              >
                Active
              </button>
              {/* pending */}
              <button
                className={cn(
                  "px-2 rounded-md relative",
                  status === "Pending"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-500"
                )}
                onClick={() => setStatus("Pending")}
              >
                en attente
                {getSessionByStatus(sessionsWithDetails, "Pending") > 0 && (
                  <span className="absolute -top-3 -right-2 w-5 h-5 bg-orange-600 rounded-full text-white text-xs flex justify-center items-center">
                    {getSessionByStatus(sessionsWithDetails, "Pending")}
                  </span>
                )}
              </button>

              <button
                className={cn(
                  "px-2 rounded-md",
                  status === "Archived"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-500"
                )}
                onClick={() => setStatus("Archived")}
              >
                Archivée
              </button>
            </div>
          </div>
        </div>

        {/* search */}
        <div className="flex items-center">
          <input
            type="text"
            placeholder="🔎 Recherche"
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-md border border-gray-300 bg-white py-2 px-6 text-base font-medium text-gray-700 outline-none transition-all duration-200"
          />
        </div>
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 justify-items-center">
        {filteredSessions.map((customerSession) => (
          <SessionCard
            sessionWithDetails={customerSession}
            key={customerSession._id}
            detailsModal={detailsModal.openModal}
            updateSessionModal={updateSessionModal.openModal}
            addCustomerModal={customerModal.openModal}
            canceledCustomerModal={canceledCustomerModal.openModal}
          />
        ))}

        {/* Form action  */}

        {/* Modal Details */}
        {detailsModal.data && (
          <SessionDetailCard
            data={detailsModal.data}
            isOpen={detailsModal.isOpen}
            onClose={detailsModal.closeModal}
          />
        )}

        {/* Modal Update */}
        {updateSessionModal.data && (
          <SessionForm
            data={updateSessionModal.data}
            isOpen={updateSessionModal.isOpen}
            onClose={updateSessionModal.closeModal}
          />
        )}

        {/* Modal Customer */}
        {customerModal.data && (
          <CustomerSessionForm
            session={customerModal.data}
            isOpen={customerModal.isOpen}
            onClose={customerModal.closeModal}
          />
        )}

        {/* Modal Canceled Customer */}
        {canceledCustomerModal.data && (
          <CanceledCustomerSession
            data={canceledCustomerModal.data}
            isOpen={canceledCustomerModal.isOpen}
            onClose={canceledCustomerModal.closeModal}
          />
        )}
      </div>
    </div>
  );
}

/*
  filterSessions
  @param sessions: ISessionWithDetails[]
  @param filter: string
  @param status: string
  @returns ISessionWithDetails[]
*/
function filterSessions(
  sessions: ISessionWithDetails[],
  filter: string,
  status?: string
) {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  return sessions.filter((session) => {
    const sessionDate = new Date(session.date);

    // Filtrer par statut si spécifié
    if (status && status !== "all" && session.status !== status) {
      return false;
    }

    // Filtrer par période
    switch (filter) {
      case "thisWeek":
        return sessionDate >= startOfWeek && sessionDate <= endOfWeek;
      case "thisMonth":
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        return sessionDate >= startOfMonth && sessionDate <= endOfMonth;
      case "past":
        return sessionDate < now;
      default:
        return true; // Pour le filtre "all" ou tout autre cas non spécifié
    }
  });
}
