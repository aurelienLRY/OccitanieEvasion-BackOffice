import { connectDB, disconnectDB } from "@/libs/database/mongodb"
import Session from "@/libs/database/models/Session"

export const UPDATE_SESSION = async (sessionId: string, data: any) => {
    try {
        await connectDB()
        const session = await Session.findByIdAndUpdate(sessionId, data, { new: true })
        return JSON.stringify(session)
    }
    catch (error) {
        console.log(error)
    }
    finally {
        await disconnectDB()
    }




}



export const UPDATE_SPOT = async (spotId: string, data: any) => {

}

