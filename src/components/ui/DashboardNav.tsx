"use client";

/* LIBRAIRIES */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";

/* TYPES */
import { ISessionWithDetails } from "@/types";

/*utils*/
import { getSessionByStatus, countAllWaitingCustomers } from "@/utils";

/**
 * DashboardNav Component
 * @param {ISessionWithDetails[]} sessionsWithDetails - Les données des sessions.
 * @returns {JSX.Element} Le composant barre de navigation du tableau de bord.
 */
export const DashboardNav = ({
  sessionsWithDetails,
}: {
  sessionsWithDetails: ISessionWithDetails[];
}) => {
  /*usePathname*/
  const pathname = usePathname();

  /**
   * isActive
   * @param {string} path - Le chemin de la route.
   * @returns {boolean} Si la route est active ou inactive.
   */
  const isActive = (path: string) => {
    return pathname.toString() === path;
  };

  /*get session pending count*/
  const sessionPendingCount = getSessionByStatus(
    sessionsWithDetails,
    "Pending"
  );

  /*get customer waiting count*/
  const customerWaitingCount = countAllWaitingCustomers(sessionsWithDetails);

  /**
   * isPathActive
   * @param {string} path - Le chemin de la route.
   * @returns {string} La classe CSS active ou inactive.
   */
  const isPathActive = (path: string) => {
    return cn(
      isActive(path) ? "font-semibold bg-sky-700 dark:bg-sky-900" : "",
      "py-2 px-3 rounded-md transition-all hover:font-semibold "
    );
  };

  return (
    <nav
      className="flex flex-col sm:flex-row justify-center items-center gap-1 md:gap-2  bg-sky-950 dark:bg-sky-800 text-white text-xs font-light md:p-1 rounded-md
    fixed bottom-10 translate-y-1/2 py-4 w-full md:w-auto  md:top-0 md:left-0 md:right-0 md:bottom-auto z-10
    md:relative md:translate-y-0 
    >
      <div className="flex relative  ">
        <Link href="/dashboard" className={isPathActive("/dashboard")}>
          Dashboard
        </Link>
        <Link
          href="/dashboard/session"
          className={isPathActive("/dashboard/session")}
        >
          {sessionsWithDetails && sessionPendingCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-600 rounded-full text-white p-1 text-xs flex justify-center items-center opacity-80">
              {sessionPendingCount}
            </span>
          )}
          Sessions
        </Link>
        <Link
          href="/dashboard/booking"
          className={isPathActive("/dashboard/booking")}
        >
          {sessionsWithDetails && customerWaitingCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-600 rounded-full text-white p-1 text-xs flex justify-center items-center opacity-80">
              {customerWaitingCount}
            </span>
          )}
          Réservations
        </Link>
      </div>
      <div className="flex relative  ">
        <Link
          href="/dashboard/spot"
          className={isPathActive("/dashboard/spot")}
        >
          Lieux
        </Link>
        <Link
          href="/dashboard/activity"
          className={isPathActive("/dashboard/activity")}
        >
          Activités
        </Link>
      </div>
    </nav>
  );
};
