"use client";
import { SessionProvider } from "next-auth/react";


export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
        <main className="flex flex-col items-center justify-center min-h-screen ">
          {children}
        </main>
    </SessionProvider>
  );
}
