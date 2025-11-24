import nodemailer from 'nodemailer';

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'sservly@gmail.com',
    pass: process.env.EMAIL_PASSWORD || '',
  },
});

export async function sendWelcomeEmail(email: string, name: string): Promise<void> {
  try {
    // Skip if no email credentials configured
    if (!process.env.EMAIL_PASSWORD) {
      console.log(`[EMAIL] Skipping welcome email - no EMAIL_PASSWORD configured. Would send to: ${email}`);
      return;
    }

    await transporter.sendMail({
      from: process.env.EMAIL_USER || 'sservly@gmail.com',
      to: email,
      subject: 'Welcome to Servly!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">Welcome to Servly, ${name}!</h1>
          <p>Thank you for creating an account with us. You're now part of our community of service providers and customers.</p>
          
          <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #1e40af; margin-top: 0;">What's Next?</h2>
            <ul>
              <li>Complete your profile to get started</li>
              <li>Browse available services in your area</li>
              <li>Book appointments or list your services</li>
            </ul>
          </div>
          
          <p>If you have any questions, feel free to contact our support team.</p>
          
          <p style="color: #666; font-size: 12px;">
            This is an automated email. Please do not reply directly to this message.
          </p>
        </div>
      `,
    });
    console.log(`[EMAIL] Welcome email sent to ${email}`);
  } catch (error) {
    console.error('[EMAIL] Failed to send welcome email:', error);
    // Don't throw - let signup continue even if email fails
  }
}
