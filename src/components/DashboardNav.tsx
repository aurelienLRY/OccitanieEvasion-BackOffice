"use client";

/* LIBRAIRIES */
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";

/* TYPES */
import { ISessionWithDetails } from "@/types";

/*utils*/
import { getSessionByStatus , countAllWaitingCustomers } from "@/utils";

/**
 * DashboardNav Component
 * @returns JSX.Element
 */
const DashboardNav = ({
  sessionsWithDetails,
}: {
  sessionsWithDetails: ISessionWithDetails[];
}) => {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname.toString() === path;
  };

   const sessionPendingCount = getSessionByStatus(sessionsWithDetails, "Pending")
   const customerWaitingCount = countAllWaitingCustomers(sessionsWithDetails);

  return (
    <nav className="flex flex-col md:flex-row items-center gap-1 md:gap-2  bg-sky-950 dark:bg-sky-800 text-white text-xs font-light p-1 rounded-md">
      <div className="flex  ">
      <Link
        href="/dashboard"
        className={cn(
          isActive("/dashboard")
            ? "font-semibold bg-sky-700 dark:bg-sky-900"
            : "",
          "p-1 px-2 rounded-md transition-all hover:font-semibold "
        )}
      >
        Dashboard
      </Link>
      <Link
        href="/dashboard/session"
        className={cn(
          isActive("/dashboard/session")
            ? "font-semibold bg-sky-700 dark:bg-sky-900"
            : "",
          "p-1 px-2 rounded-md transition-all hover:font-semibold  relative"
        )}
      >
        {sessionsWithDetails &&
          sessionPendingCount > 0  && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-600 rounded-full text-white p-1 text-xs flex justify-center items-center opacity-80">
              {sessionPendingCount }
            </span>
          )}
        Sessions
      </Link>
      <Link
        href="/dashboard/booking"
        className={cn(
          isActive("/dashboard/booking")
            ? "font-semibold bg-sky-700 dark:bg-sky-900"
            : "",
          "p-1 px-2 rounded-md transition-all hover:font-semibold  relative"
        )}
      >
          {sessionsWithDetails &&
          customerWaitingCount > 0  && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-600 rounded-full text-white p-1 text-xs flex justify-center items-center opacity-80">
              {customerWaitingCount}
            </span>
          )}
        Réservations
      </Link>
      </div>
      <div className="flex ">
      <Link
        href="/dashboard/spot"
        className={cn(
          isActive("/dashboard/spot")
            ? "font-semibold bg-sky-700 dark:bg-sky-900"
            : "",
          "p-1 px-2 rounded-md transition-all hover:font-semibold "
        )}
      >
        {" "}
        Lieux{" "}
      </Link>
      <Link
        href="/dashboard/activity"
        className={cn(
          isActive("/dashboard/activity")
            ? "font-semibold bg-sky-700 dark:bg-sky-900"
            : "",
          "p-1 px-2 rounded-md transition-all hover:font-semibold "
        )}
      >
        {" "}
        Activités{" "}
      </Link>

      <Link
        href="/dashboard/email"
        className={cn(
          isActive("/dashboard/email")
            ? "font-semibold bg-sky-700 dark:bg-sky-900"
            : "",
          "p-1 px-2 rounded-md transition-all hover:font-semibold "
        )}
      >
        {" "} 
        Emails
      </Link>
      </div>
    </nav>
  );
};

export default DashboardNav;
