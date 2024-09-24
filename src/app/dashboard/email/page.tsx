"use client";   
import { CustomerWaiting , customerConfirmation } from "@/libs/sendBox/template/RegistrationConfirmation";
import { HtmlBase , MailContent } from "@/libs/sendBox/template/base";



/* Store */
import { useCustomerSessions , useSessionWithDetails } from "@/context/store";


import EditEmail from "@/components/EditEmail";



export default function EmailPage() {
    const customer = useCustomerSessions(state => state.CustomerSessions);
    const sessionWithDetails = useSessionWithDetails(state => state.SessionWithDetails);

     const {subject , content} = customerConfirmation(customer[0], sessionWithDetails[0]);
 
  
  const EmailConfirmation = MailContent(subject, content);

    return (
      <>
      {/* affiche EmailConfirmation dans  */}
      <div className="w-full h-full bg-white">
        <div dangerouslySetInnerHTML={{ __html: EmailConfirmation }} />
      </div>
     <EditEmail isOpen={true} onClose={() => {}} myContent={EmailConfirmation}  />
      </>
    ) ;
}