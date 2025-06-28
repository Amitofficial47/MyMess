import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

const {
	SMTP_HOST,
	SMTP_PORT,
	SMTP_USER,
	SMTP_PASS,
	SMTP_SECURE,
	SMTP_FROM_ADDRESS,
	SMTP_FROM_NAME,
} = process.env;

const transporter = nodemailer.createTransport({
	host: SMTP_HOST,
	port: Number(SMTP_PORT),
	secure: SMTP_SECURE === "true", // true for 465, false for other ports
	auth: {
		user: SMTP_USER,
		pass: SMTP_PASS,
	},
});

const getEmailHtml = (
	title: string,
	body: string,
	buttonLink?: string,
	buttonText?: string
) => `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body { font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif; padding: 20px; background-color: #f4f4f4; }
      .card { background-color: #ffffff; border: 1px solid #e6e6e6; border-radius: 8px; padding: 40px; max-width: 600px; margin: 0 auto; text-align: center; }
      h1 { font-size: 24px; font-weight: bold; color: #333; }
      p { font-size: 16px; color: #555; line-height: 1.5; }
      .button { display: inline-block; padding: 12px 24px; font-size: 16px; font-weight: bold; color: #ffffff !important; background-color: #16a34a; border-radius: 6px; text-decoration: none; margin-top: 20px; }
      .footer { font-size: 12px; color: #999; margin-top: 20px; }
      .otp { font-size: 36px; font-weight: bold; color: #16a34a; letter-spacing: 10px; margin: 20px 0; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>${title}</h1>
      <p>${body}</p>
      ${
				buttonLink && buttonText
					? `<a href="${buttonLink}" class="button">${buttonText}</a>`
					: ""
			}
    </div>
  </body>
  </html>
`;

export const sendPasswordResetOtpEmail = async (email: string, otp: string) => {
	await transporter.sendMail({
		from: `"${SMTP_FROM_NAME}" <${SMTP_FROM_ADDRESS}>`,
		to: email,
		subject: "Your MyMess Password Reset OTP",
		html: getEmailHtml(
			"Your One-Time Password",
			`You requested a password reset for your MyMess account. Use the following OTP to proceed. This OTP is valid for 10 minutes.
            <div class="otp">${otp}</div>
            If you didn't request this, you can safely ignore this email.`
		),
	});
};

export const sendPasswordResetSuccessEmail = async (email: string) => {
	if (!process.env.JWT_RESET_SECRET) {
		throw new Error(
			"JWT_RESET_SECRET is not defined in environment variables."
		);
	}
	const loginLink = `${process.env.APP_BASE_URL}/login`;

	await transporter.sendMail({
		from: `"${SMTP_FROM_NAME}" <${SMTP_FROM_ADDRESS}>`,
		to: email,
		subject: "Your Password Has Been Reset",
		html: getEmailHtml(
			"Password Changed Successfully",
			"Your password for your MyMess account has been successfully changed. If you did not make this change, please contact support immediately.",
			loginLink,
			"Log In to MyMess"
		),
	});
};

export const sendVerificationEmail = async (
	email: string,
	userName: string,
	displayId: string,
	hostel: string
) => {
	if (!process.env.JWT_RESET_SECRET) {
		throw new Error(
			"JWT_RESET_SECRET is not defined in environment variables."
		);
	}
	const loginLink = `${process.env.APP_BASE_URL}/login`;

	await transporter.sendMail({
		from: `"${SMTP_FROM_NAME}" <${SMTP_FROM_ADDRESS}>`,
		to: email,
		subject: "Your MyMess Account is Approved!",
		html: getEmailHtml(
			`Welcome to MyMess, ${userName}!`,
			`Your account has been successfully verified and approved for <strong>${hostel}</strong>. Your Student ID is <strong>${displayId}</strong>. You can now log in and access all the features of MyMess.`,
			loginLink,
			"Log In to MyMess"
		),
	});
};
