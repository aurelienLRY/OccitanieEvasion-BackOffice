"use client";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";

import { Header } from "@/components/ui/Header";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <Toaster richColors position="top-center" closeButton />
      <Header />
      <main className="flex flex-col items-center justify-center  box-border mt-20">
        {children}
      </main>
    </SessionProvider>
  );
}
