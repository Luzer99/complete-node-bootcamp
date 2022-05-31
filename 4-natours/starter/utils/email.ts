import { createTransport } from 'nodemailer';
import { Email } from '../types';

export const sendEmail = async (options: Email) => {
  // 1. Create a transporter instance
  const transporter = createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // 2. Define the email popOptions
  const mailOptions = {
    from: 'Oskar Luzny <hello@oskar.io>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3. actually send the email
  await transporter.sendMail(mailOptions);
};
