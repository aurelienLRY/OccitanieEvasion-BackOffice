"use client";
import React from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

/* COMPONENTS */
import { ItemContainer, SecondaryButton } from "@/components";

type Props = {
  className?: string;
};

export const CalendarCard = (props: Props) => {
  const { data: session } = useSession();

  const fetchIdCalendar = async () => {
    const calendar = await fetch("/api/services/google/action", {
      method: "GET",
      credentials: "include",
    });
    const data = await calendar.json();
    console.log(data);
  };
  fetchIdCalendar();

  return (
    <ItemContainer
      className={`flex flex-1 flex-col gap-4 min-w-[300px] min-h-[200px] items-center justify-around p-2 ${props.className}`}
    >
      <ConnectToCalendar />
    </ItemContainer>
  );
};

/**
 * Composant qui retroune les élément pour se connecter
 * @returns {JSX.Element}
 */
const ConnectToCalendar = () => {
  const pathname = usePathname(); // Obtenir l'URL actuelle
  const router = useRouter();
  const googleCalendarConnect = async () => {
    await fetch(`/api/services/google?origin=${encodeURIComponent(pathname)}`)
      .then((res) => res.json())
      .then((data) => {
        router.push(data.authUrl);
      });
  };
  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <Image
          src="/img/googleCalendar.png"
          alt="Google Calendar"
          width={500}
          height={500}
          className="w-20 h-20 object-contain"
        />
        <h2 className="text-2xl font-bold">Mon calendrier Google</h2>
        <p className="text-sm text-slate-300 lg:max-w-[2/3]">
          Connectez votre calendrier Google pour synchroniser vos événements.
        </p>
      </div>
      <SecondaryButton onClick={googleCalendarConnect} className="px-4 py-2 ">
        Connecter mon calendrier
      </SecondaryButton>
      ;
    </>
  );
};
