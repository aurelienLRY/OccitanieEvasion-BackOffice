/**
 * Interface for a customer session
 * @property {string} _id - The id of the customer session
 * @property {Date} createdAt - The date of creation of the customer session
 * @property {Date | null} validatedAt - The date of validation of the customer session
 * @property {Date | null} canceledAt - The date of cancellation of the customer session
 * @property {string} sessionId - The id of the session
 * @property {Date} date - The date of the session
 * @property {string} status - The status of the customer session
 * @property {string} typeOfReservation - The type of reservation of the customer session
 * @property {number} number_of_people - The number of people of the customer session
 */
export interface ICustomerSession {
    _id: string;
    createdAt: Date;
    validatedAt: Date | null;
    canceledAt: Date | null;
    sessionId: string;
    date: Date;
    status: "Validated" | "Canceled" | "Waiting";
    typeOfReservation: string;
    number_of_people: number;
    last_name: string;
    first_names: string;
    email: string;
    phone: string;
    people_list: {
      size: string;
      weight: string;
    }[];
    tarification: "reduced" | "standard" | "acm";
  }