import { createTransport } from 'nodemailer';

const transporter = createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendVerificationEmail = async (email: string, code: string) => {
  try {
    const mailOptions = {
      from: `"Toricy" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Код подтверждения Toricy',
      html: `<div style="text-align:center;padding:40px;"><h1 style="color:#0066ff;">Toricy</h1><h2>Код подтверждения</h2><div style="font-size:48px;font-weight:800;color:#0066ff;letter-spacing:8px;font-family:monospace;margin:30px 0;">${code}</div><p>Код действителен 10 минут</p></div>`,
      text: `Ваш код подтверждения Toricy: ${code}`,
    };
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Email error:', error);
    return false;
  }
};

export const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
