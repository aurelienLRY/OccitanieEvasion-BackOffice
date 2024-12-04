"use server";
import { NextRequest, NextResponse } from "next/server";
import { addEvent, getEvent } from "@/services";
/* types */
import { ICallback } from "@/types";
import { updateEvent, deleteEvent } from "@/services/GoogleCalendar";

/* Actions*/
import {
  CREATE_EVENT,
  DELETE_EVENT,
  GET_EVENT_BY_SESSION_ID,
} from "@/libs/actions/event.action";
import { connectDB, disconnectDB } from "@/libs/database/mongodb";

/**
 * GET route to get events from the Google Calendar
 * @param req - The request object
 * @param res - The response object
 * @returns The response object
 */
export async function GET(req: NextRequest): Promise<NextResponse<ICallback>> {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.json(
      {
        success: false,
        data: null,
        feedback: null,
        error: "Token manquant",
      },
      { status: 400 }
    );
  }
  try {
    const response = await getEvent(token);
    return NextResponse.json(
      {
        success: true,
        data: response.data.items || [],
        feedback: null,
        error: null,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Erreur lors de la récupération des événements :", error);
    return NextResponse.json(
      {
        success: false,
        data: null,
        feedback: null,
        error: error.message || "Impossible de récupérer les événements",
      },
      { status: 500 }
    );
  }
}

/**
 * POST route to add an event to the Google Calendar
 * @param req - The request object
 * @param res - The response object
 * @returns The response object
 */
export async function POST(req: NextRequest): Promise<NextResponse<ICallback>> {
  try {
    const { refreshToken, event, sessionId } = await req.json();
    if (!refreshToken || !event || !sessionId) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          feedback: null,
          error: "Paramètres manquants",
        },
        { status: 400 }
      );
    }
    const response = await addEvent(refreshToken, event);
    if (response.status === 200 && response.data.id) {
      const result = await CREATE_EVENT({
        eventId: response.data.id,
        sessionId: sessionId,
      });
      if (result.success) {
        return NextResponse.json(
          {
            success: true,
            data: response.data,
            feedback: null,
            error: null,
          },
          { status: 200 }
        );
      } else {
        throw new Error(
          "Impossible d'enregistrer l'événement en base de données"
        );
      }
    } else {
      throw new Error("Impossible d'ajouter un événement à Google Calendar");
    }
  } catch (error: any) {
    console.error("Erreur lors de l'ajout d'un événement :", error);
    return NextResponse.json(
      {
        success: false,
        data: null,
        feedback: null,
        error: error.message || "Impossible d'ajouter un événement",
      },
      { status: 500 }
    );
  }
}

/**
 * PUT route to update an event on the Google Calendar
 * @param req - The request object
 * @param res - The response object
 * @returns The response object
 */
export async function PUT(req: NextRequest): Promise<NextResponse<ICallback>> {
  try {
    const { refreshToken, event, sessionId } = await req.json();
    const EventDB = await GET_EVENT_BY_SESSION_ID(sessionId);
    if (!EventDB.success || !EventDB.data) {
      throw new Error("Événement non trouvé");
    }
    const response = await updateEvent(
      refreshToken,
      event,
      EventDB.data.eventId
    );
    return NextResponse.json(
      {
        success: true,
        data: response.data,
        feedback: null,
        error: null,
      },
      { status: response.status }
    );
  } catch (error: any) {
    console.error("Erreur lors de la mise à jour de l'événement :", error);
    return NextResponse.json(
      {
        success: false,
        data: null,
        feedback: null,
        error: error.message || "Impossible de mettre à jour l'événement",
      },
      { status: 500 }
    );
  }
}

/** DELETE route to delete an event from the Google Calendar
 * @param req - The request object
 * @param res - The response object
 * @returns The response object
 */
export async function DELETE(req: NextRequest) {
  try {
    const { refreshToken, sessionId } = await req.json();
    await connectDB();
    const EventDB = await GET_EVENT_BY_SESSION_ID(sessionId);
    if (!EventDB.success || !EventDB.data) {
      throw new Error("Événement non trouvé");
    }
    const response = await deleteEvent(refreshToken, EventDB.data.eventId);
    if (response.status === 204) {
      const result = await DELETE_EVENT(EventDB.data._id as string);
      if (result.success) {
        return NextResponse.json(
          {
            success: true,
            data: response.data,
            feedback: null,
            error: null,
          },
          { status: 200 }
        );
      } else {
        throw new Error(
          "Impossible de supprimer l'événement en base de données"
        );
      }
    } else {
      throw new Error("Impossible de supprimer l'événement de Google Calendar");
    }
  } catch (error: any) {
    console.error("Erreur lors de la suppression de l'événement :", error);
    return NextResponse.json(
      {
        success: false,
        data: null,
        feedback: null,
        error: error.message || "Impossible de supprimer l'événement",
      },
      { status: 500 }
    );
  } finally {
    await disconnectDB();
  }
}
