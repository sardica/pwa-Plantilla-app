// backend-services/auth-service/src/utils/mailer.ts


import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport/index.js';
import { env } from '../config/env.js';
// La configuración del transporter ahora se lee directamente de las variables de entorno.
// En desarrollo, estas variables apuntarán a MailHog gracias a docker-compose.yml.
// En producción, apuntarán a tu servicio de correo real (ej. Mailtrap, SendGrid).
//const transporter = nodemailer.createTransport({
//  host: env.EMAIL_HOST,
//  port: env.EMAIL_PORT,
//  secure: env.EMAIL_SECURE,
//  auth: {
//    user: env.EMAIL_USER,
//    pass: env.EMAIL_PASS,
//  },
//});
// Se crea una configuración base para el transporter.
const transporterOptions: SMTPTransport.Options = {
  host: env.EMAIL_HOST,
  port: env.EMAIL_PORT,
  secure: env.EMAIL_SECURE,
};

const transporter = nodemailer.createTransport(transporterOptions);

export const sendVerificationEmail = async (to: string, token: string): Promise<void> => {
  const verificationUrl = `${env.CORS_ORIGIN}/verify-email?token=${token}`;

  try {
    await transporter.sendMail({
      from: '"Tu App" <noreply@tuapp.com>',
      to,
      subject: 'Verifique su dirección de correo electrónico',
      html: `
        <h2>Verificación de correo electrónico</h2>
        <p>Haga clic en el siguiente enlace para verificar su cuenta:</p>
        <a href="${verificationUrl}" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verificar Email</a>
        <p>O copie y pegue esta URL en su navegador:</p>
        <p>${verificationUrl}</p>
        <p>Este enlace expira en 1 hora.</p>
      `,
    });

    console.log('Email enviado exitosamente a:', to);
  } catch (error) {
    console.error('Error enviando email:', error);
    throw error;
  }
};