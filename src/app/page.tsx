"use client";
/* librairies */
import Image from "next/image";
/*components*/
import { LoginForm } from "@/components";

export default function HomePage() {
  return (
    <div className="flex  max-h-screen relative -mt-20">
      <Image
        src="/img/escalade-scroll.jpg"
        alt="logo"
        width={4453}
        height={2969}
        className="object-cover max-h-screen"
      />
      <LoginForm />
    </div>
  );
}
