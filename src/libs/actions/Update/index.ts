"use server";
import { connectDB, disconnectDB } from "@/libs/database/mongodb";
import Session from "@/libs/database/models/Session";
import { ISession } from "@/libs/database/models/Session";

export const UPDATE_SESSION = async (
  sessionId: string,
  data: any
): Promise<ISession | undefined> => {
  try {
    await connectDB();
    const session: ISession | null = await Session.findByIdAndUpdate(
      sessionId,
      data,
      { new: true }
    );
    if (!session) {
      throw new Error("Session not found");
    }
    return JSON.parse(JSON.stringify(session));
  } catch (error) {
    console.log(error);
  } finally {
    await disconnectDB();
  }
};

export const UPDATE_SPOT = async (spotId: string, data: any) => {};
