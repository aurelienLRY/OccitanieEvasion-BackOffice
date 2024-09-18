import { ISession } from "@/types/session.type";
import { IActivity } from "@/types/activity.type";
import { ISpot } from "@/types/spot.type";
import { ICustomerSession } from "@/types/customerSession.type";

/**
 * Interface for a session with details
 * @extends Omit <ISession, "activity" | "spot">
 * @property {IActivity} activity - The activity of the session
 * @property {ISpot} spot - The spot of the session
 * @property {ICustomerSession[]} customerSessions - The customer sessions of the session
 */
export interface ISessionWithDetails
  extends Omit<ISession, "activity" | "spot"> {
  activity: IActivity;
  spot: ISpot;
  customerSessions: ICustomerSession[];
}
