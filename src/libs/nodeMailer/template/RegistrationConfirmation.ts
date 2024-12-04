/* types*/
import { ICustomerSession, ISessionWithDetails } from "@/types";

/**
 * Content Email forCustomer confirmation
 * @param customer
 * @param sessionWithDetails
 * @returns
 */
export const customerConfirmation = (
  customer: ICustomerSession,
  sessionWithDetails: ISessionWithDetails
): { subject: string; content: string } => {
  const emailContent = `
    <tr>
      <td style="padding-bottom: 20px;">
        <p style="text-align: center; color: #fffff;">Bonjour ${customer.first_names},</p>
        <p style="text-align: center; color: #fffff;">Échauffez vos muscles et ${
          customer.number_of_people > 1 ? "vos esprits" : "votre esprit"
        }, car votre aventure commence bientôt ! 🚀 </p>
        <p style="text-align: center; color: #fffff;">Je vous confirme la réservation du ${new Date(
          sessionWithDetails.date
        ).toLocaleDateString("fr-FR")} pour ${
    customer.number_of_people
  } personne(s)</p>  
      </td>
    </tr>
    <tr>
      <td style="padding-bottom: 20px;">
        <p style="text-align: center; color: #fffff;">Je suis ravi de vous accompagner pour une session de ${
          sessionWithDetails.activity.name
        } en formule ${
    sessionWithDetails.type_formule === "half_day" ? "demi-journée" : "journée"
  }.</p>
        <p style="text-align: center; color: #fffff;">Une activité d'environ ${
          sessionWithDetails.spot.estimatedDuration
        } , pour un tarif de ${customer.price_total}€</p>
        <p style="text-align: center; color: #fffff;">Je vous invite à vous munir d'espèces ou d'un chèque afin de payer sur place.</p>  
      </td>
    </tr>

    <tr style="padding-bottom: 20px;">
      <td >
        <h2 style="text-align: center; font-size: 1.5em; margin-bottom: 10px; font-weight: bold; color: #fffff;">Détails de la réservation</h2>
        
            <p style="text-align: center; color: #fffff;"><strong>Date:</strong> ${new Date(sessionWithDetails.date).toLocaleDateString("fr-FR")} de ${sessionWithDetails.startTime} à ${sessionWithDetails.endTime}</p>
            <p style="text-align: center; color: #fffff;"><strong>Lieu:</strong> ${sessionWithDetails.spot.name}</p>
            
            <p style="text-align: center; color: #fffff;"><strong>Nombre de personnes:</strong> ${customer.number_of_people}</p>
            <p style="text-align: center; color: #fffff;"><strong>Durée estimée:</strong> ${sessionWithDetails.spot.estimatedDuration}</p>
          
      </td>
    </tr>

    <tr>
      <td style="text-align: center; padding: 20px;">
        <a href="https://www.google.com/maps/dir/?api=1&destination=${
          sessionWithDetails.spot.meetingPoint ||
          sessionWithDetails.spot.gpsCoordinates
        }" style="text-decoration: none; color: white; background-color: #007bff; padding: 10px 20px; border-radius: 5px; display: inline-block; margin: 0 auto;">Itinéraire</a>
      </td>
    </tr>
  `;

  return {
    subject: "🥳 Confirmation de votre réservation 🥳",
    content: emailContent,
  };
};

/**
 * Content Email for Customer waiting
 * @param customer
 * @param sessionWithDetails
 * @returns
 */
export const CustomerWaiting = (
  customer: ICustomerSession,
  sessionWithDetails: ISessionWithDetails
): { subject: string; content: string } => {
  return {
    subject: "Votre inscription est prise en compte",
    content: `
    <div style="padding-bottom: 20px;">
        <p>Bonjour ${customer.first_names},</p>
        <p style="margin: 0px;">J'ai reçu votre demande de réservation pour l'activité "${
          sessionWithDetails.activity.name
        }" du ${new Date(sessionWithDetails.date).toLocaleDateString(
      "fr-FR"
    )}.</p>
        <p style="margin: 0px;">je prends d'étudier votre demande et vous répondrai sous 48h.</p>
        <p style="margin: 0px;">Merci de votre patience et à très vite sur les sentiers !</p>  
    </div>
    `,
  };
};
