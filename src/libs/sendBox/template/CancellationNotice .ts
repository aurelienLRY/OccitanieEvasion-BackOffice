// template de mail pour l'annulation d'une réservation par le client
import { ICustomerSession, IActivity } from "@/types";
export const customerCanceled = (customer: ICustomerSession, activity: IActivity): string => {
    return `
    <!DOCTYPE html>
    <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">  
        <title>Annulation de votre réservation</title>
      </head>
      <body>
        <h1>Annulation de votre réservation</h1>
        <p>Bonjour ${customer.first_names},</p>
        <p>Nous sommes désolés de vous informer que votre réservation pour l'activité "${activity.name}" a été annulée.</p>
        <p>Nous espérons que vous avez trouvé une solution alternative pour vos activités en plein air.</p>
        <p>Cordialement,</p>    
        <p>L'équipe de notre site</p>
      </body>
    </html>
    `;
};