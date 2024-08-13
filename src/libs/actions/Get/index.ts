"use server";
import { connectDB, disconnectDB } from "@/libs/database/mongodb";
import User from "@/libs/database/models/User";
import { IUser } from "@/libs/database/models/User";
import CustomerSession from "@/libs/database/models/CustomerSession";
import { ICustomerSession } from "@/libs/database/models/CustomerSession";
import Activity from "@/libs/database/models/Activity";
import { IActivity } from "@/libs/database/models/Activity";
import Spot from "@/libs/database/models/Spot";
import { ISpot } from "@/libs/database/models/Spot";
import Session from "@/libs/database/models/Session";
import { ISession } from "@/libs/database/models/Session";

export async function GET_USERS(): Promise<IUser[]> {
  try {
    await connectDB();
    const users = (await User.find()) as IUser[];
    return JSON.parse(JSON.stringify(users));
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error);
    throw error;
  } finally {
    await disconnectDB();
  }
}

export async function GET_USER_BY_ID(id: string): Promise<IUser | null> {
  try {
    await connectDB();
    const user = (await User.findById(id)) as IUser | null;
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur:", error);
    throw error;
  } finally {
    await disconnectDB();
  }
}

export async function GET_CUSTOMER_SESSIONS(): Promise<ICustomerSession[]> {
  try {
    await connectDB();
    const sessions = (await CustomerSession.find()) as ICustomerSession[];
    return JSON.parse(JSON.stringify(sessions));
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des sessions clients:",
      error
    );
    throw error;
  } finally {
    await disconnectDB();
  }
}

export async function GET_CUSTOMER_SESSION_BY_ID(
  id: string
): Promise<ICustomerSession | null> {
  try {
    await connectDB();
    const session = (await CustomerSession.findById(
      id
    )) as ICustomerSession | null;
    return JSON.parse(JSON.stringify(session));
  } catch (error) {
    console.error(
      "Erreur lors de la récupération de la session client:",
      error
    );
    throw error;
  } finally {
    await disconnectDB();
  }
}

export async function GET_ACTIVITIES(): Promise<IActivity[]> {
  try {
    await connectDB();
    const activities = (await Activity.find()) as IActivity[];
    return JSON.parse(JSON.stringify(activities));
  } catch (error) {
    console.error("Erreur lors de la récupération des activités:", error);
    throw error;
  } finally {
    await disconnectDB();
  }
}

export async function GET_ACTIVITY_BY_ID(
  id: string
): Promise<IActivity | null> {
  try {
    await connectDB();
    const activity = (await Activity.findById(id)) as IActivity | null;
    return JSON.parse(JSON.stringify(activity));
  } catch (error) {
    console.error("Erreur lors de la récupération de l'activité:", error);
    throw error;
  } finally {
    await disconnectDB();
  }
}

export async function GET_SPOTS(): Promise<ISpot[]> {
  try {
    await connectDB();
    const spots = (await Spot.find()) as ISpot[];
    return JSON.parse(JSON.stringify(spots));
  } catch (error) {
    console.error("Erreur lors de la récupération des spots:", error);
    throw error;
  } finally {
    await disconnectDB();
  }
}

export async function GET_SPOT_BY_ID(id: string): Promise<ISpot | null> {
  try {
    await connectDB();
    const spot = (await Spot.findById(id)) as ISpot | null;
    return JSON.parse(JSON.stringify(spot));
  } catch (error) {
    console.error("Erreur lors de la récupération du spot:", error);
    throw error;
  } finally {
    await disconnectDB();
  }
}

export async function GET_SESSIONS(): Promise<ISession[]> {
  try {
    await connectDB();
    const sessions = (await Session.find()) as ISession[];
    return JSON.parse(JSON.stringify(sessions));
  } catch (error) {
    console.error("Erreur lors de la récupération des sessions:", error);
    throw error;
  } finally {
    await disconnectDB();
  }
}

export async function GET_SESSION_BY_ID(id: string): Promise<ISession | null> {
  try {
    await connectDB();
    const session = (await Session.findById(id)) as ISession | null;
    return JSON.parse(JSON.stringify(session));
  } catch (error) {
    console.error("Erreur lors de la récupération de la session:", error);
    throw error;
  } finally {
    await disconnectDB();
  }
}

export async function GET_SESSIONS_WITH_DETAILS(): Promise<ISessionWithDetails[] > {
  try {
    await connectDB();

    // Récupérer toutes les sessions
    const sessions = (await Session.find()) as ISession[];

    // Pour chaque session, récupérer les détails de l'activité, du spot et des sessions clients
    const sessionsWithDetails = await Promise.all(
      sessions.map(async (session) => {
        const activity = (await Activity.findById(
          session.activity
        )) as IActivity | null;
        const spot = (await Spot.findById(session.spot)) as ISpot | null;
        const customerSessions = (await CustomerSession.find({
          sessionId: session._id,
        })) as ICustomerSession[];

        return {
          ...session.toObject(),
          activity: activity ? activity.toObject() : null,
          spot: spot ? spot.toObject() : null,
          customerSessions: customerSessions.map((cs) => cs.toObject()),
        };
      })
    );

    return JSON.parse(JSON.stringify(sessionsWithDetails));
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des sessions avec détails:",
      error
    );
    throw error;
  } finally {
    await disconnectDB();
  }
}

export interface ISessionWithDetails extends Document {
  _id: "string";
  status: "string";
  date: "string";
  startTime: "string";
  endTime: "string";
  activity: {
    _id: "string";
    name: "string";
    description: "string";
    half_day: "boolean";
    full_day: "boolean";
    price_half_day: "number";
    price_full_day: "number";
    min_age: "number";
    max_OfPeople: "number";
    min_OfPeople: "number";
  };
  spot: {
    _id: "string";
    name: "string";
    description: "string";
    gpsCoordinates: "string";
    practicedActivities: [
      {
        activityName: "string";
        activityId: "string";
      }
    ];
    photo: "string";
    half_day: "boolean";
    full_day: "boolean";
    max_OfPeople: "number";
    min_OfPeople: "number";
    meetingPoint: "string";
    estimatedDuration: "string";
  };
  customerSessions: [
    {
      _id: "string";
      sessionId: "string";
      date: "string";
      status: "string";
      typeOfReservation: "string";
      number_of_people: "number";
      last_name: "string";
      first_names: "string";
      email: "string";
      phone: "string";
      people_list: [
        {
          size: "string";
          weight: "string";
        }
      ];
    }
  ];
  placesMax: "number";
  placesReserved: "number";
}
