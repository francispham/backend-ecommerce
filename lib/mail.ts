import { createTransport, getTestMessageUrl } from 'nodemailer';

// * Docs: https://nodemailer.com/smtp/
const transporter = createTransport({
  // * Configure your own SMTP server: https://ethereal.email/create
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

function makeEmail(text: string): string {
  return `
    <div style="
      border: 1px solid black;
      padding: 20px;
      font-family: sans-serif;
      line-height: 2;
      font-size: 20px;
    ">
      <h2>Hello There!</h2>
      <p>${text}</p>
      <p>🥰, Francis Pham</p>
    </div>
  `;
}

// * Copied from: https://jvilk.com/MakeTypes/
export interface Envelope {
  from: string;
  to?: string[] | null;
}

export interface MailResponse {
  accepted?: string[] | null;
  rejected?: null[] | null;
  envelopeTime: number;
  messageTime: number;
  messageSize: number;
  response: string;
  envelope: Envelope;
  messageId: string;
}

export async function sendPasswordResetEmail(
  resetToken: string,
  to: string
): Promise<void> {
  // ?  Email the user a token to reset their password: https://nodemailer.com/usage/#sending-mail
  const info = (await transporter.sendMail({
    to,
    from: 'francis.pham.ca@gmail.com',
    subject: 'Password Reset',
    html: makeEmail(`Your password reset token is ${resetToken}.
      <a href="${process.env.FRONTEND_URL}/reset?token=${resetToken}">
        Click here to reset your password</a>
    `),
  })) as unknown as MailResponse;

  if (process.env.MAIL_USER.includes('ethereal.email')) {
    // * Docs: https://nodemailer.com/smtp/testing/
    console.log(`✉️ Message Sent! Preview it at ${getTestMessageUrl(info)}`);
  };
}
