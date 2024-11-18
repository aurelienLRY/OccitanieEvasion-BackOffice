"use client";

/*libs*/
import Image from "next/image";
import { useSession } from "next-auth/react";

/*components*/
import {
  ItemCard,
  SecondaryButton,
  AvatarSystem,
  ProfilForm,
  ChangePassword,
  CalendarCard,
} from "@/components";

export default function Page() {
  const { data: session } = useSession();
  const userId = session?.user._id;
  if (!userId) {
    throw new Error("Utilisateur non authentifié.");
  }

  const googleCalendarConnect = () => {
    console.log("googleCalendarConnect");
  };

  return (
    <section className="w-full h-full flex flex-col gap-6 items-center justify-center ">
      <div className="flex flex-col lg:flex-row gap-4 w-full h-full justify-around max-w-[1400px] ">
        {/* Avatar */}
        <ItemCard className="min-w-[300px] min-h-[200px] flex flex-col flex-1 items-center">
          <AvatarSystem />
          <ProfilForm />
        </ItemCard>
        <ChangePassword />
      </div>

      <CalendarCard className="max-w-[1400px]" />
    </section>
  );
}
