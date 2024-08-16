 "use server"
import xss from 'xss';
import { connectDB, disconnectDB } from "@/libs/database/mongodb";
import { ISession } from "@/libs/database/models/Session";
import Session from "@/libs/database/models/Session";

export async function CREATE_SESSION(formData: ISession): Promise<{ success?: boolean; error?: string, session?: ISession }> {
  try {
    // Nettoyage des entrées pour prévenir les attaques XSS
    const cleanData: ISession = {
      status: "Actif",
      date: formData.date, // Les dates ne sont pas susceptibles aux attaques XSS
      startTime: xss(formData.startTime),
      endTime: xss(formData.endTime),
      activity: xss(formData.activity),
      spot: xss(formData.spot),
      placesMax: formData.placesMax, // Les nombres ne sont pas susceptibles aux attaques XSS
      placesReserved: formData.placesReserved // Les nombres ne sont pas susceptibles aux attaques XSS
    };
    await connectDB();

    // Création de la session dans la base de données
    const newSession = new Session(cleanData);
    await newSession.save();

    return { success: true , session: JSON.parse(JSON.stringify(newSession)) };
  } catch (error) {
    console.error("Erreur lors de la création de la session:", error);
    throw error;
  }finally{
    await disconnectDB();
  }
}

