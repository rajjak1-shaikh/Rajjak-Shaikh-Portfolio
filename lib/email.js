import nodemailer from 'nodemailer';

// Log email config on startup (redacted for security)
console.log('[Email Config] EMAIL_USER:', process.env.EMAIL_USER ? `${process.env.EMAIL_USER.substring(0, 5)}...` : 'NOT SET');
console.log('[Email Config] EMAIL_PASS:', process.env.EMAIL_PASS ? `SET (${process.env.EMAIL_PASS.length} chars)` : 'NOT SET');
console.log('[Email Config] EMAIL_TO:', process.env.EMAIL_TO || 'NOT SET (will use EMAIL_USER)');

// Create reusable transporter with extended timeouts for serverless
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  },
  // Extended timeouts for serverless environments
  connectionTimeout: 10000, // 10 seconds
  greetingTimeout: 10000,
  socketTimeout: 15000,
  pool: false, // Disable connection pooling for serverless
  debug: false,
  logger: false
});

// Verify transporter connection
transporter.verify((error, success) => {
  if (error) {
    console.error('[Email] Transporter verification FAILED:', error.message);
  } else {
    console.log('[Email] Transporter verified - ready to send emails');
  }
});

// Send contact form notification email
export async function sendContactEmail({ email, subject, message, ipAddress, contactId }) {
  const mailOptions = {
    from: {
      name: 'Portfolio Contact Form',
      address: process.env.EMAIL_USER
    },
    to: process.env.EMAIL_TO || process.env.EMAIL_USER,
    subject: `📩 New Contact: ${subject}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: white; 
            padding: 30px; 
            border-radius: 10px 10px 0 0; 
            text-align: center; 
          }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .field { margin-bottom: 20px; }
          .label { font-weight: bold; color: #555; margin-bottom: 5px; }
          .value { 
            background: white; 
            padding: 15px; 
            border-radius: 5px; 
            border-left: 4px solid #667eea; 
          }
          .footer { text-align: center; margin-top: 20px; color: #999; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">📬 New Contact Message</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Portfolio Contact Form</p>
          </div>
          
          <div class="content">
            <div class="field">
              <div class="label">📧 From:</div>
              <div class="value">${email}</div>
            </div>
            
            <div class="field">
              <div class="label">📋 Subject:</div>
              <div class="value">${subject}</div>
            </div>
            
            <div class="field">
              <div class="label">💬 Message:</div>
              <div class="value">${message.replace(/\n/g, '<br>')}</div>
            </div>
            
            <div class="field">
              <div class="label">🌐 IP Address:</div>
              <div class="value">${ipAddress || 'N/A'}</div>
            </div>
            
            <div class="field">
              <div class="label">🕒 Received:</div>
              <div class="value">${new Date().toLocaleString()}</div>
            </div>
          </div>
          
          <div class="footer">
            <p>Contact ID: ${contactId}</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
New Contact Form Submission

From: ${email}
Subject: ${subject}

Message:
${message}

IP: ${ipAddress || 'N/A'}
Time: ${new Date().toLocaleString()}
ID: ${contactId}
    `
  };

  return await transporter.sendMail(mailOptions);
}

// Send newsletter welcome email
export async function sendNewsletterWelcomeEmail(recipientEmail, recipientName = '') {
  // Handle both object and string arguments for flexibility
  const email = typeof recipientEmail === 'object' ? recipientEmail.email : recipientEmail;
  const name = typeof recipientEmail === 'object' ? recipientEmail.name : recipientName;

  // Validate email before sending
  if (!email || typeof email !== 'string') {
    throw new Error(`Invalid recipient email: ${email}`);
  }

  const mailOptions = {
    from: {
      name: 'Krishna - Portfolio Blog',
      address: process.env.EMAIL_USER
    },
    to: email,
    subject: '🎉 Welcome to My Newsletter!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%); 
                    color: white; padding: 40px 20px; border-radius: 10px 10px 0 0; text-align: center; }
          .content { background: #f9f9f9; padding: 40px 30px; border-radius: 0 0 10px 10px; }
          .footer { text-align: center; margin-top: 30px; color: #999; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 32px;">🎉 Welcome!</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 18px;">
              Thanks for subscribing to my newsletter
            </p>
          </div>
          
          <div class="content">
            <p>Hey${name ? ' ' + name : ''}! 👋</p>
            
            <p>
              I'm thrilled to have you here! You're now part of an exclusive community 
              that gets first access to my thoughts on AI, engineering, and whatever 
              interesting things I'm building.
            </p>
            
            <h3>What to expect:</h3>
            <ul>
              <li>📚 Curated blog posts matching your interests</li>
              <li>🚀 Behind-the-scenes of projects I'm working on</li>
              <li>💡 Insights and lessons learned from building</li>
              <li>🎯 Zero spam - only quality content</li>
            </ul>
            
            <p>
              I respect your inbox and promise to only send content that's worth your time. 
              You can unsubscribe anytime with one click.
            </p>
            
            <p style="margin-top: 30px;">
              Got questions or feedback? Just reply to this email - I read every message!
            </p>
            
            <p>
              Best,<br>
              <strong>Krishna</strong>
            </p>
          </div>
          
          <div class="footer">
            <p>You're receiving this because you subscribed at my portfolio</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Hey${name ? ' ' + name : ''}! 👋

Thanks for subscribing to my newsletter! I'm thrilled to have you here.

What to expect:
- Curated blog posts matching your interests
- Behind-the-scenes of projects I'm working on
- Insights and lessons learned from building
- Zero spam - only quality content

I respect your inbox and promise to only send content that's worth your time.

Got questions? Just reply to this email!

Best,
Krishna
    `
  };

  return await transporter.sendMail(mailOptions);
}

// Send newsletter admin notification
export async function sendNewsletterAdminNotification({ email, name, ipAddress }) {
  const mailOptions = {
    from: {
      name: 'Portfolio Newsletter',
      address: process.env.EMAIL_USER
    },
    to: process.env.EMAIL_TO || process.env.EMAIL_USER,
    subject: '🎉 New Newsletter Subscriber!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #10b981; color: white; padding: 20px; border-radius: 5px; }
          .content { background: #f9f9f9; padding: 20px; margin-top: 10px; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>🎉 New Newsletter Subscriber</h2>
          </div>
          <div class="content">
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Name:</strong> ${name || 'Anonymous'}</p>
            <p><strong>IP:</strong> ${ipAddress || 'N/A'}</p>
            <p><strong>Subscribed At:</strong> ${new Date().toLocaleString()}</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  return await transporter.sendMail(mailOptions);
}

export default transporter;