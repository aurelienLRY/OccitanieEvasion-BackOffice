"use client";
import React, { Suspense } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import googleCalendarPlugin from "@fullcalendar/google-calendar";

/* COMPONENTS */
import { ItemContainer, SecondaryButton } from "@/components";
import { useProfile } from "@/store";

type Props = {
  className?: string;
};

export const CalendarCard = (props: Props) => {
  const [events, setEvents] = React.useState([]);
  const [tokenIsValid, setTokenIsValid] = React.useState(false);
  const { profile, updateProfile } = useProfile();

  async function fetchCheckToken() {
    const fetcherIsValide = await fetch(
      `/api/services/google/check-token?token=${profile?.tokenCalendar}`
    );
    const { data } = await fetcherIsValide.json();

    if (!data.valid && profile?.tokenCalendar) {
      const fetcherRefreshToken = await fetch(
        "/api/services/google/refresh-token",
        {
          method: "POST",
          body: JSON.stringify({
            profile: profile,
          }),
        }
      );
      const refreshToken = await fetcherRefreshToken.json();
      if (refreshToken.success && refreshToken.data) {
        updateProfile(refreshToken.data);
        setTokenIsValid(true);
      }
    } else {
      setTokenIsValid(data.valid);
    }
  }

  React.useEffect(() => {
    fetchCheckToken();
  }, []);

  return (
    <ItemContainer
      className={`flex flex-1 flex-col gap-4 min-w-[300px] min-h-[200px] items-center justify-around p-2 ${props.className}`}
    >
      <Suspense fallback={<div>Loading...</div>}>
        {tokenIsValid ? <Calendar /> : <ConnectToCalendar />}
      </Suspense>
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
    </>
  );
};

function Calendar() {
  const { profile } = useProfile();
  if (!profile) return null;
  return (
    <FullCalendar
      plugins={[dayGridPlugin, googleCalendarPlugin]}
      initialView="dayGridMonth"
      events={{
        googleCalendarId: profile.email,
        className: "bg-red-500 text-sm font-thin",
      }}
      googleCalendarApiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY}
      themeSystem="United"
    />
  );
}
