"use client";
import { useState, useEffect } from "react";
import { cn } from "@/utils/cn";
import SessionCard from "@/components/SessionCard";
import { ISessionWithDetails } from "@/libs/actions/Get";

/*icons*/
import { IoIosSearch } from "react-icons/io";


function AllSessionsCard({
  customerSessions,
}: {
  customerSessions: ISessionWithDetails[];
}) {
  const [filter, setFilter] = useState<string>("all");
  const [filteredSessions, setFilteredSessions] = useState<
    ISessionWithDetails[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [status, setStatus] = useState<string>("Actif");
  const [search, setSearch] = useState<string>("");



  useEffect(() => {
    setIsLoading(customerSessions.length === 0);
    const resultFilter = filterSessions(customerSessions, filter, status);
    const resultSearch = SearchInSessions(resultFilter, search);
    setFilteredSessions(resultSearch);
  }, [filter, customerSessions, status, search]);


  if (isLoading) {
    return <div className="flex justify-center items-center w-screen  h-screen">Chargement...</div>;
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* filter NAV */}
      <div className="flex flex-col-reverse md:flex-row justify-between gap-4 items-center w-full">
        <div className="flex gap-4 items-center">
          {/* filter Période */}
          <div className="flex flex-col  justify-center ">
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
          <div className="flex flex-col  justify-center ">
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
                  "px-2 rounded-md",
                  status === "pending"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-500"
                )}
                onClick={() => setStatus("Pending")}
              >
                en attente
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
            customerSession={customerSession}
            key={customerSession._id}
          />
        ))}
      </div>
    </div>
  );
}

export default AllSessionsCard;

function filterSessions(
  sessions: ISessionWithDetails[],
  filter: string,
  status?: string
) {
  const now = new Date();
  return sessions.filter((session) => {
    const sessionDate = new Date(session.date);

    // Filtrer par statut si spécifié
    if (status && status !== "all" && session.status !== status) {
      return false;
    }

    // Filtrer par période
    switch (filter) {
      case "thisWeek":
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        const endOfWeek = new Date(
          now.setDate(now.getDate() - now.getDay() + 7)
        );
        return sessionDate >= startOfWeek && sessionDate < endOfWeek;
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


function SearchInSessions(objet: ISessionWithDetails[], search: string) {
  const searchLower = search.toLowerCase(); // Convertir la recherche en minuscules pour une comparaison insensible à la casse

  function searchIn(obj: any): boolean {
    if (obj !== null && typeof obj === "object") {
      for (const [cle, valeur] of Object.entries(obj)) {
        // Vérifier si la valeur est une chaîne et si elle contient la chaîne de recherche
        if (typeof valeur === "string" && valeur.toLowerCase().includes(searchLower)) {
          return true; // Correspondance trouvée, renvoyer vrai
        }
        // Récursion pour chercher dans les objets imbriqués
        if (typeof valeur === "object" && searchIn(valeur)) {
          return true; // Correspondance trouvée dans un sous-objet, renvoyer vrai
        }
      }
    }
    return false; // Aucune correspondance trouvée, renvoyer faux
  }

  return objet.filter(session => searchIn(session)); // Filtrer les sessions où une correspondance est trouvée
}
  






