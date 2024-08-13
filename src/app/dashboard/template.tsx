"use client";
import React from "react";
import { useAuth } from "@/utils/useAuth";
import SingOutBtn from "@/components/singOut";
import Dashboard from "@/components/Dashboard";

export default function Template({ children }: { children: React.ReactNode }) {
  const {  status } = useAuth();

  if (status === "loading") {
    return <p>Chargement...</p>;
  }

  return <>
  <Dashboard>
  {children}
  <SingOutBtn /> 
  </Dashboard>
  </>
}