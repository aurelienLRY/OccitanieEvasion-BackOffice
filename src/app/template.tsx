"use client";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";


export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <Toaster richColors position="top-center" closeButton/>
        <main className="flex flex-col items-center justify-center min-h-screen box-border">
          {children}
        </main>
    </SessionProvider>
  );
}
