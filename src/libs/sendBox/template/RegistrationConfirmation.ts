
/* types*/ 
import { ICustomerSession, ISessionWithDetails} from "@/types";


/**
 * Content Email forCustomer confirmation
 * @param customer 
 * @param sessionWithDetails 
 * @returns 
 */
export const customerConfirmation = (
  customer: ICustomerSession,
  sessionWithDetails: ISessionWithDetails
): {subject: string , content: string} => {      
return {
  subject: "🥳 Confirmation de votre réservation 🥳",
  content:
   `
  <div style="padding-bottom: 20px;">
      <p style="text-align: center;">Bonjour ${customer.first_names },</p>
      <p style="text-align: center;">Échauffez vos muscles et ${customer.number_of_people> 1 ? "vos esprits" : "votre esprit"}, car votre aventure commence bientôt ! 🚀 </p>
      <p style="text-align: center;">je vous confirme votre réservation de ${customer.number_of_people} place(s) pour l'activité "${sessionWithDetails.activity.name}" du ${ new Date(sessionWithDetails.date).toLocaleDateString("fr-FR")}.</p>
      
  </div>
    <div style="padding-bottom: 20px; ">
        <h2 style="text-align: center;" >Détails de la réservation</h2>
        <p style="text-align: center;" ><strong>Date:</strong> ${new Date(sessionWithDetails.date).toLocaleDateString("fr-FR")} de ${sessionWithDetails.startTime} à ${sessionWithDetails.endTime}</p>
        <p style="text-align: center;" ><strong>Lieu:</strong> ${sessionWithDetails.spot.name}</p>
        <p style="text-align: center;" ><strong>Nombre de personnes:</strong> ${customer.number_of_people}</p>
    </div>
  `
}
}








/**
 * Content Email for Customer waiting
 * @param customer 
 * @param sessionWithDetails 
 * @returns 
 */
 export const CustomerWaiting = (
  customer: ICustomerSession,
  sessionWithDetails: ISessionWithDetails
): {subject: string , content: string} => {      
  return {
    subject: "Votre inscription est prise en compte",
    content: `
    <div style="padding-bottom: 20px;">
        <p>Bonjour ${customer.first_names },</p>
        <p style="margin: 0px;">J'ai reçu votre demande de réservation pour l'activité "${sessionWithDetails.activity.name}" du ${ new Date(sessionWithDetails.date).toLocaleDateString("fr-FR")}.</p>
        <p style="margin: 0px;">je prends d'étudier votre demande et vous répondrai sous 48h.</p>
        <p style="margin: 0px;">Merci de votre patience et à très vite sur les sentiers !</p>  
    </div>
    `
  }
}