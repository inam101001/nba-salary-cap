/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class NotificationsService {
  // Create a Nodemailer transporter instance for sending emails.
  private transporter = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io', // SMTP host for Mailtrap (a testing email service).
    port: 2525, // Port used by Mailtrap for SMTP.
     // Email service provider (not used here as Mailtrap is configured).
    auth: {
      user: 'd5497c39a62cd8', // Mailtrap SMTP username (replace with your credentials).
      pass: 'd66a875d25b6bd', // Mailtrap SMTP password (replace with your credentials).
    },
  });

  /**
   * Sends an email with the provided message.
   * @param message - The content of the email to be sent.
   */
  async sendEmail(message: string): Promise<void> {
    await this.transporter.sendMail({
      from: 'testing@gmail.com', // Sender's email address.
      to: 'testing@yahoo.com', // Recipient's email address.
      subject: 'Table Structure Change Alert', // Subject of the email.
      text: message, // Body of the email.
    });
  }
}
