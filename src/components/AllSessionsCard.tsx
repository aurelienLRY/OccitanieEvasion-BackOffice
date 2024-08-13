"use client";
import { useState, useEffect } from "react";
import { cn } from "@/utils/cn";
import SessionCard from "@/components/SessionCard";
import { ISessionWithDetails } from "@/libs/actions/Get";

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

  useEffect(() => {
    setFilteredSessions(customerSessions);
    setIsLoading(customerSessions.length === 0);
  }, [customerSessions]);

  useEffect(() => {
    const now = new Date();
    const filtered = customerSessions.filter((session) => {
      const sessionDate = new Date(session.date);
      switch (filter) {
        case "thisWeek":
          const startOfWeek = new Date(now);
          startOfWeek.setDate(now.getDate() - now.getDay());
          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(startOfWeek.getDate() + 7);
          return sessionDate >= startOfWeek && sessionDate < endOfWeek;
        case "thisMonth":
          const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
          const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
          return sessionDate >= startOfMonth && sessionDate <= endOfMonth;
        case "all":
          return sessionDate > now;
        default:
          return true;
      }
    });
    setFilteredSessions(filtered);
  }, [filter, customerSessions]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-4 w-full">
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
