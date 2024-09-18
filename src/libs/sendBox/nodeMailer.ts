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
  text?: string,
  html?: string
): Promise<boolean> => {
  const isVerified = await transporter.verify();
  if (!isVerified) {
    return false;
  }

  const mailOptions = {
    from: process.env.SMTP_EMAIL,
    to: email,
    subject: subject,
    text: text,
    html: html,
  };

  const info = await transporter.sendMail(mailOptions);
  if (info.messageId) {
    return true;
  }
  return false;
};

export { sendEmail };
