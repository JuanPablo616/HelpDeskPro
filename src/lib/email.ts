import nodemailer from "nodemailer";
import { emailTemplate } from "./emailTemplates";

export const mailer = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export async function sendMail(to: string, subject: string, htmlContent: string) {
  try {
    await mailer.sendMail({
      from: `"HelpDeskPro" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: htmlContent,
    });

    console.log("Correo enviado a:", to);
  } catch (error) {
    console.error("Error enviando correo:", error);
  }
}
