import { useState } from "react";
import { toast } from "sonner";
import { emailScenarios } from "@/libs/nodeMailer/TemplateV2/scenarios";
import { EMAIL_SCENARIOS } from "@/libs/nodeMailer/TemplateV2/constants";
import { generateEmail } from "@/libs/nodeMailer/TemplateV2";
import { nodeMailerSender } from "@/libs/nodeMailer";
import { ITemplateData } from "@/libs/nodeMailer/TemplateV2/types";

interface UseMailerProps {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}

export const useMailer = (props?: UseMailerProps) => {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [currentEmailContent, setCurrentEmailContent] = useState<string>("");
  const [initialEmailContent, setInitialEmailContent] = useState<string>("");
  const [emailData, setEmailData] = useState<{
    to: string;
    subject: string;
    templateData: ITemplateData;
    scenario: keyof typeof EMAIL_SCENARIOS;
  } | null>(null);

  const prepareEmail = (
    scenarioType: keyof typeof EMAIL_SCENARIOS,
    data: ITemplateData
  ) => {
    const scenario = emailScenarios[scenarioType];
    const fullEmailContent = generateEmail(scenario, data);

    setEmailData({
      to: data.customer.email,
      subject: scenario.subject,
      templateData: data,
      scenario: scenarioType,
    });

    setInitialEmailContent(fullEmailContent);
    setCurrentEmailContent(fullEmailContent);
    setIsEditorOpen(true);
  };

  const handleEmailContent = (content: string): void => {
    setCurrentEmailContent(content);
  };

  const sendEmail = async (): Promise<void> => {
    if (!emailData) return;

    try {
      const success = await nodeMailerSender(
        emailData.to,
        emailData.subject,
        currentEmailContent
      );

      if (success) {
        toast.success("Email envoyé avec succès");
        props?.onSuccess?.();
      } else {
        throw new Error("Échec de l'envoi de l'email");
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'email:", error);
      toast.error("Erreur lors de l'envoi de l'email");
      props?.onError?.(error);
    } finally {
      setIsEditorOpen(false);
      setEmailData(null);
    }
  };

  return {
    isEditorOpen,
    currentEmailContent,
    initialEmailContent,
    prepareEmail,
    handleEmailContent,
    sendEmail,
    closeEditor: () => setIsEditorOpen(false),
  };
};
