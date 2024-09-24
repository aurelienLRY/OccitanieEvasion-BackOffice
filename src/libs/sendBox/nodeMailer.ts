"use server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport(
  {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  },
  {
    from: process.env.SMTP_EMAIL,
    subject: "Occitanie Evasion - Participer à notre prochaine évasion !",
  }
);

const sendEmail = async (
  email: string,
  subject: string,
  html: string
): Promise<boolean> => {
  const isVerified = await transporter.verify();
  if (!isVerified) {
    return false;
  }
  console.log("isVerified", isVerified);

  const mailOptions = {
    from: process.env.SMTP_EMAIL,
    to: email,
    subject: subject,
    html: html,
  };

  const info = await transporter.sendMail(mailOptions);
  if (info.messageId) {
    console.log("Email envoyé avec succès");
    return true;
  }
  console.log("Erreur lors de l'envoi de l'email");
  return false;
};

export { sendEmail };
