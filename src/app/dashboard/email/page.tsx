"use client";   
import React from "react";
import { CustomerWaiting , customerConfirmation } from "@/libs/sendBox/template/RegistrationConfirmation";
import { HtmlBase , MailContent } from "@/libs/sendBox/template/base";

/* Actions */
import { GET_EMAIL_TEMPLATE } from "@/libs/actions";

/* Store */
import { useCustomerSessions , useSessionWithDetails } from "@/store";

/* Components */
import { ToasterAction , EmailTemplateEditor } from "@/components";
import { dynamicDataTemplate } from "@/libs/sendBox/dynamicData";



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



    return (
      <>
      {/* affiche EmailConfirmation dans  */}
      <EmailTemplateEditor Mail={EmailConfirmation} dynamicData={dynamicDataTemplate} />
      </>
    ) ;
}


