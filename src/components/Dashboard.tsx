import React from "react";
import DashboardNav from "@/components/DashboardNav";

const Dashboard = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col gap-3 items-center min-h-screen w-full p-6">
      <div className="w-full flex flex-col gap-2 items-start px-6">
        <h1 className="text-4xl font-bold ">Dashboard</h1>
        <DashboardNav />
      </div>
      <div className="w-full flex flex-col items-start px-4  border-2 border-sky-700 dark:border-sky-900 rounded-md py-6 ">
        {children}
        </div>
    </div>
  );
};

export default Dashboard;
