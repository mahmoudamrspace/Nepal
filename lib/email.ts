import { Resend } from 'resend';

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

// Get email addresses from environment variables
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@example.com';
const TO_EMAIL = process.env.TO_EMAIL || 'contact@example.com';
const COMPANY_NAME = process.env.COMPANY_NAME || 'Explore Vision Nepal';

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

/**
 * Send notification email to business when contact form is submitted
 */
export async function sendContactNotification(data: ContactFormData) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not set, skipping email notification');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const { data: emailData, error } = await resend.emails.send({
      from: `Contact Form <${FROM_EMAIL}>`,
      to: [TO_EMAIL],
      replyTo: data.email,
      subject: `New Contact Form Submission: ${data.subject}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: #485342; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
              .content { background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
              .field { margin-bottom: 15px; }
              .label { font-weight: bold; color: #485342; }
              .value { margin-top: 5px; padding: 10px; background-color: white; border-radius: 4px; }
              .footer { background-color: #dbe2dd; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; color: #666; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2>New Contact Form Submission</h2>
              </div>
              <div class="content">
                <div class="field">
                  <div class="label">Name:</div>
                  <div class="value">${data.name}</div>
                </div>
                <div class="field">
                  <div class="label">Email:</div>
                  <div class="value"><a href="mailto:${data.email}">${data.email}</a></div>
                </div>
                ${data.phone ? `
                <div class="field">
                  <div class="label">Phone:</div>
                  <div class="value"><a href="tel:${data.phone}">${data.phone}</a></div>
                </div>
                ` : ''}
                <div class="field">
                  <div class="label">Subject:</div>
                  <div class="value">${data.subject}</div>
                </div>
                <div class="field">
                  <div class="label">Message:</div>
                  <div class="value">${data.message.replace(/\n/g, '<br>')}</div>
                </div>
              </div>
              <div class="footer">
                <p>This email was sent from the ${COMPANY_NAME} contact form.</p>
                <p>You can reply directly to this email to respond to ${data.name}.</p>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `
New Contact Form Submission

Name: ${data.name}
Email: ${data.email}
${data.phone ? `Phone: ${data.phone}` : ''}
Subject: ${data.subject}

Message:
${data.message}

---
This email was sent from the ${COMPANY_NAME} contact form.
You can reply directly to this email to respond to ${data.name}.
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, id: emailData?.id };
  } catch (error) {
    console.error('Failed to send contact notification email:', error);
    return { success: false, error: 'Failed to send email' };
  }
}

/**
 * Send confirmation email to user after contact form submission
 */
export async function sendContactConfirmation(data: ContactFormData) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not set, skipping confirmation email');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const { data: emailData, error } = await resend.emails.send({
      from: `${COMPANY_NAME} <${FROM_EMAIL}>`,
      to: [data.email],
      subject: `Thank you for contacting ${COMPANY_NAME}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: #485342; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
              .content { background-color: #f9f9f9; padding: 30px; border: 1px solid #ddd; }
              .message { margin: 20px 0; padding: 15px; background-color: white; border-left: 4px solid #485342; }
              .footer { background-color: #dbe2dd; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; color: #666; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2>Thank You for Contacting Us!</h2>
              </div>
              <div class="content">
                <p>Dear ${data.name},</p>
                <p>Thank you for reaching out to ${COMPANY_NAME}. We have received your message and will get back to you as soon as possible.</p>
                <div class="message">
                  <strong>Your Message:</strong><br>
                  ${data.message.replace(/\n/g, '<br>')}
                </div>
                <p>We typically respond within 24-48 hours. If your inquiry is urgent, please feel free to call us directly.</p>
                <p>Best regards,<br>The ${COMPANY_NAME} Team</p>
              </div>
              <div class="footer">
                <p>This is an automated confirmation email. Please do not reply to this message.</p>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `
Thank You for Contacting Us!

Dear ${data.name},

Thank you for reaching out to ${COMPANY_NAME}. We have received your message and will get back to you as soon as possible.

Your Message:
${data.message}

We typically respond within 24-48 hours. If your inquiry is urgent, please feel free to call us directly.

Best regards,
The ${COMPANY_NAME} Team

---
This is an automated confirmation email. Please do not reply to this message.
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, id: emailData?.id };
  } catch (error) {
    console.error('Failed to send confirmation email:', error);
    return { success: false, error: 'Failed to send email' };
  }
}

