"use client";
import { useSessionWithDetails } from "@/store";
import React from "react";
import { generateEvent } from "@/services/GoogleCalendar/generateEvent";
import { ICalendarEvent } from "@/types";
type Props = {};

const Page = (props: Props) => {
  const sessions = useSessionWithDetails();
  const selectOne = sessions.SessionWithDetails[0];
  console.log("selectOne", selectOne);

  const event: ICalendarEvent = generateEvent(selectOne);
  console.log("event", event);

  return <div>P</div>;
};

export default Page;
