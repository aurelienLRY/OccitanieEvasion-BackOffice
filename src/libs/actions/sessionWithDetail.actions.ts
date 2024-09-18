
'use server'
/* Models */
import Activity from "@/libs/database/models/Activity";
import Spot from "@/libs/database/models/Spot";
import CustomerSession from "@/libs/database/models/CustomerSession";
import Session from "@/libs/database/models/Session";

/*Types*/
import { IActivity, ISpot, ICustomerSession, ISession, ISessionWithDetails } from "@/types";


export const GET_SERVER_SESSION_WITH_DETAILS = async (
    sessionId: string
): Promise<ISessionWithDetails> => {
    const session = await Session.findById(sessionId) as ISession
    const activity = await Activity.findById(session.activity) as IActivity
    const spot = await Spot.findById(session.spot) as ISpot
    const customerSession = await CustomerSession.find({sessionId: session._id}) as ICustomerSession[]

    if (!session || !activity || !spot || !customerSession) {
        throw new Error("Session non trouvée")
    }

    const sessionWithDetails = {
        ...session.toObject(),
        activity: activity,
        spot: spot,
        customerSessions: customerSession
    } as ISessionWithDetails

    return sessionWithDetails 
};
