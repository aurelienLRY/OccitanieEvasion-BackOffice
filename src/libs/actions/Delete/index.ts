"use server"
import { connectDB, disconnectDB } from "@/libs/database/mongodb"
import Session from "@/libs/database/models/Session"




export const DELETE_SESSION = async (sessionId: string) => {
    try {
        await connectDB()
        const session = await Session.findById(sessionId)
        if (!session) {
            throw new Error("Session not found")
        }

        if (session.status !== "Archived") {
            throw new Error("Session is not archived")
        }
        else if (session.status === "Archived") {
            const result = await Session.findByIdAndDelete(sessionId)
            return JSON.parse(JSON.stringify(result))
        }
    } catch (error) {
        console.log(error)
        return JSON.stringify(error)
    }

    finally {
        await disconnectDB()
    }


}
