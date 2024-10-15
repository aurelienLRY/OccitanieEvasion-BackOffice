"use client";   
import React from "react";
import { CustomerWaiting , customerConfirmation } from "@/libs/sendBox/template/RegistrationConfirmation";
import { HtmlBase , MailContent } from "@/libs/sendBox/template/base";

/* Actions */
import { GET_EMAIL_TEMPLATE } from "@/libs/actions";

/* Store */
import { useCustomerSessions , useSessionWithDetails } from "@/context/store";

/* Components */
import EditEmail from "@/components/EditEmail";
import ToasterAction from "@/components/ToasterAction";



export default function EmailPage() {
    const customer = useCustomerSessions(state => state.CustomerSessions);
    const sessionWithDetails = useSessionWithDetails(state => state.SessionWithDetails);

    const [templateEmail , setTemplateEmail] = React.useState<any>(null);

     const {subject , content} = customerConfirmation(customer[0], sessionWithDetails[0]);
 
  
  const EmailConfirmation = MailContent(subject, content);
  
  React.useEffect(() => {
    const fetchTemplateEmail = async () => {
      const result = await GET_EMAIL_TEMPLATE();
      if(result.success){
        setTemplateEmail(result.data);
      }

      ToasterAction({result , defaultMessage: "Template email"});
    };

    fetchTemplateEmail();
  }, []);

  console.log( "templateEmail : " ,templateEmail);


    return (
      <>
      {/* affiche EmailConfirmation dans  */}
      <div className="w-full h-full bg-white">
        <div dangerouslySetInnerHTML={{ __html: EmailConfirmation }} />
      </div>
     <EditEmail isOpen={false} onClose={() => {}} myContent={EmailConfirmation}  />
      </>
    ) ;
}