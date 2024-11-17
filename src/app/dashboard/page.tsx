"use client";
/* Libs */
import React from "react";
/* Components */

import {
  SessionForm,
  CustomerSessionForm,
  CanceledCustomerSession,
  CalendarCard,
  SessionDetailCard,
  SessionCard,
  ItemContainer,
} from "@/components";

/* Utils */
import { getMonthString, getYearString } from "@/utils/date.utils";
import { calculateSessionIncomeByMonth } from "@/utils/price.utils";
import {
  calculateNumberOfSessions,
  filterSessionsForDashboard,
  calculateInscrit,
  classifySpots,
  classifyActivities,
} from "@/utils";

/* Store */
import { useSessionWithDetails } from "@/store";

/* Types */
import { ISessionWithDetails } from "@/types";

/* Hook */
import { useModal } from "@/hook";

const Dashboard = () => {
  const sessionsWithDetails = useSessionWithDetails(
    (state) => state.SessionWithDetails
  );

  const filteredSessions = filterSessionsForDashboard(sessionsWithDetails);

  const detailsModal = useModal<ISessionWithDetails>();
  const updateSessionModal = useModal<ISessionWithDetails>();
  const customerModal = useModal<ISessionWithDetails>();
  const canceledCustomerModal = useModal<ISessionWithDetails>();

  const DisplayHeaderMessage = (n: number) => {
    if (1 <= n && n <= 4) {
      return (
        <p className="text-xl font-bold opacity-50">
          <span className="text-4xl">🚀</span> Lets Go !!
        </p>
      );
    }
    if (n >= 5 && n <= 10) {
      return (
        <p className="text-xl font-bold opacity-50">
          <span className="text-2xl ">🚀🚀</span> Tu fais du bon boulot 🔥
        </p>
      );
    }
    if (n >= 11 && n <= 20) {
      return (
        <p className="text-xl font-bold opacity-50">
          <span className="text-2xl">🚀🚀🚀</span> Tu es un machine 🤖
        </p>
      );
    }
    if (n >= 21) {
      return (
        <p className="text-xl font-bold opacity-50">
          <span className="text-4xl">🔥</span> C&apos;est le Feu !!! Quel fierté
          de travailler ensemble 🤝 ..
        </p>
      );
    }
  };

  return (
    <section className="w-full md:p-4 flex flex-col gap-12 items-center">
      <article className="w-full md:p-4 flex flex-col gap-12 items-center">
        <div className="w-full flex flex-col xl:flex-row gap-4">
          <ItemContainer title="Mes sessions à venir">
            {filteredSessions.length === 0 ? (
              <div className="flex flex-col gap-4 justify-center items-center h-full">
                <p className="text-xl font-bold ">
                  {" "}
                  <span className="text-4xl">🤷</span> Aucune session à venir
                </p>
                <p className="text-4xl font-bold ">
                  {" "}
                  Vacances 🏖️ <span className="text-xl">ou</span> Prospection 🔍
                  ❓
                </p>
              </div>
            ) : (
              <>
                {DisplayHeaderMessage(sessionsWithDetails.length)}
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 justify-items-center">
                  {filteredSessions.map((session) => (
                    <SessionCard
                      key={session._id}
                      sessionWithDetails={session}
                      detailsModal={detailsModal.openModal}
                      updateSessionModal={updateSessionModal.openModal}
                      addCustomerModal={customerModal.openModal}
                      canceledCustomerModal={canceledCustomerModal.openModal}
                    />
                  ))}
                </div>
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
              </>
            )}
          </ItemContainer>

          <CalendarCard />
        </div>
      </article>

      <article className="w-full md:p-4 flex flex-col gap-12 items-center">
        <h2 className="text-4xl font-bold">Mes statistiques</h2>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 justify-items-center">
          <StatisticCard title={`Statistiques de ${getMonthString()}`}>
            <StatisticItem
              label="Sessions"
              value={calculateNumberOfSessions(sessionsWithDetails, "month")}
            />
            <StatisticItem
              label="Nombre d'inscriptions"
              value={calculateInscrit(sessionsWithDetails, "month")}
            />
            <StatisticItem
              label="Chiffre d'affaire"
              value={`${calculateSessionIncomeByMonth(
                sessionsWithDetails,
                "month"
              )} €`}
            />
          </StatisticCard>

          <StatisticCard title={`Statistiques ${getYearString()}`}>
            <StatisticItem
              label="Sessions"
              value={calculateNumberOfSessions(sessionsWithDetails, "year")}
            />
            <StatisticItem
              label="Nombre d'inscriptions"
              value={calculateInscrit(sessionsWithDetails, "year")}
            />
            <StatisticItem
              label="Chiffre d'affaire"
              value={`${calculateSessionIncomeByMonth(
                sessionsWithDetails,
                "year"
              )} €`}
            />
          </StatisticCard>
          <StatisticCard title="Classement des Lieux">
            <ul>
              {Object.entries(classifySpots(sessionsWithDetails)).map(
                ([spot, numberSessions]) => (
                  <li key={spot} className="text-left">
                    <span className="font-bold pr-2">{spot}:</span>{" "}
                    {numberSessions}
                  </li>
                )
              )}
            </ul>
          </StatisticCard>
          <StatisticCard title="Classement des activités">
            <ul>
              {Object.entries(classifyActivities(sessionsWithDetails)).map(
                ([activity, numberSessions]) => (
                  <li key={activity} className="text-left">
                    <span className="font-bold pr-2">{activity}:</span>{" "}
                    {numberSessions}
                  </li>
                )
              )}
            </ul>
          </StatisticCard>
        </div>
      </article>
    </section>
  );
};

export default Dashboard;

/**
 * StatisticCard Component
 * @param title: string
 * @param children: React.ReactNode
 * @returns JSX.Element
 */
function StatisticCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="w-full flex flex-col gap-4 items-center text-white bg-slate-800 dark:bg-sky-950 p-4 rounded-lg border-2 border-slate-700 dark:border-sky-800 shadow-md shadow-slate-700/50 dark:shadow-sky-800/50">
      <h3 className="text-xl md:text-2xl font-bold">{title}</h3>
      <div className="w-full flex flex-col gap-1">{children}</div>
    </div>
  );
}

/**
 * StatisticItem Component
 * @param label: string
 * @param value: string | number
 * @returns JSX.Element
 */
function StatisticItem({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <p className="">
      <span className="font-bold pr-2">{label}:</span> {value}
    </p>
  );
}
