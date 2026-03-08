import nodemailer from "nodemailer";

const domain = process.env.NEXTAUTH_URL || "http://localhost:3000";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

const from = process.env.SMTP_FROM || '"CocktailCrafter" <info@cocktail-crafter.com>';

export const sendVerificationEmail = async (email: string, token: string) => {
    const confirmLink = `${domain}/verify-email?token=${token}`;

    await transporter.sendMail({
        from,
        to: email,
        subject: "Welcome to CocktailCrafter – Please verify your email",
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; background-color: #0b0c10; color: #ffffff; border-radius: 16px;">
                <div style="text-align: center; margin-bottom: 32px;">
                    <span style="font-size: 40px;">🍹</span>
                    <h1 style="color: #00d2ff; margin: 12px 0 4px; font-size: 24px; letter-spacing: -0.5px;">Welcome to CocktailCrafter!</h1>
                    <p style="color: #888c94; margin: 0; font-size: 14px;">Your cocktail journey starts here</p>
                </div>

                <p style="color: #cccccc; line-height: 1.7;">Hey there,</p>
                <p style="color: #cccccc; line-height: 1.7;">
                    We're thrilled to have you on board! CocktailCrafter is your personal space to discover, create, and share amazing cocktail recipes.
                </p>
                <p style="color: #cccccc; line-height: 1.7;">
                    To get started, please confirm your email address by clicking the button below:
                </p>

                <div style="text-align: center; margin: 32px 0;">
                    <a href="${confirmLink}"
                        style="background-color: #00d2ff; color: #0b0c10; padding: 14px 32px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 15px; display: inline-block; letter-spacing: 0.3px;">
                        Verify My Email Address
                    </a>
                </div>

                <p style="color: #888c94; font-size: 13px; line-height: 1.6;">
                    Or copy this link into your browser:<br/>
                    <span style="color: #00d2ff; word-break: break-all;">${confirmLink}</span>
                </p>

                <hr style="border: none; border-top: 1px solid #1a1b21; margin: 32px 0;" />
                <p style="font-size: 12px; color: #555; text-align: center;">
                    If you didn't create an account, you can safely ignore this email.<br/>
                    This link expires in 24 hours.
                </p>
            </div>
        `,
    });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
    const resetLink = `${domain}/reset-password?token=${token}`;

    await transporter.sendMail({
        from,
        to: email,
        subject: "Reset your password – CocktailCrafter",
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; background-color: #0b0c10; color: #ffffff; border-radius: 16px;">
                <div style="text-align: center; margin-bottom: 32px;">
                    <span style="font-size: 40px;">🔑</span>
                    <h1 style="color: #00d2ff; margin: 12px 0 4px; font-size: 24px; letter-spacing: -0.5px;">Password Reset</h1>
                    <p style="color: #888c94; margin: 0; font-size: 14px;">No worries — it happens to the best of us</p>
                </div>

                <p style="color: #cccccc; line-height: 1.7;">Hey there,</p>
                <p style="color: #cccccc; line-height: 1.7;">
                    We received a request to reset the password for your CocktailCrafter account. Click the button below to choose a new password:
                </p>

                <div style="text-align: center; margin: 32px 0;">
                    <a href="${resetLink}"
                        style="background-color: #00d2ff; color: #0b0c10; padding: 14px 32px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 15px; display: inline-block; letter-spacing: 0.3px;">
                        Reset My Password
                    </a>
                </div>

                <p style="color: #888c94; font-size: 13px; line-height: 1.6;">
                    Or copy this link into your browser:<br/>
                    <span style="color: #00d2ff; word-break: break-all;">${resetLink}</span>
                </p>

                <hr style="border: none; border-top: 1px solid #1a1b21; margin: 32px 0;" />
                <p style="font-size: 12px; color: #555; text-align: center;">
                    If you didn't request a password reset, you can safely ignore this email.<br/>
                    This link expires in 1 hour.
                </p>
            </div>
        `,
    });
};

export const sendAccountDeletionEmail = async (email: string, firstName?: string | null) => {
    const name = firstName || "there";

    await transporter.sendMail({
        from,
        to: email,
        subject: "Your CocktailCrafter account has been deleted",
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; background-color: #0b0c10; color: #ffffff; border-radius: 16px;">
                <div style="text-align: center; margin-bottom: 32px;">
                    <span style="font-size: 40px;">👋</span>
                    <h1 style="color: #00d2ff; margin: 12px 0 4px; font-size: 24px; letter-spacing: -0.5px;">Until next time, ${name}!</h1>
                    <p style="color: #888c94; margin: 0; font-size: 14px;">Your account has been successfully deleted</p>
                </div>

                <p style="color: #cccccc; line-height: 1.7;">Hey ${name},</p>
                <p style="color: #cccccc; line-height: 1.7;">
                    We just wanted to let you know that your CocktailCrafter account has been permanently deleted — just as you requested.
                </p>
                <p style="color: #cccccc; line-height: 1.7;">
                    All your personal data, cocktail recipes, and favorites have been removed from our system.
                </p>
                <p style="color: #cccccc; line-height: 1.7;">
                    We're sad to see you go, but we hope our paths cross again someday. If you ever feel like crafting cocktails again, you're always welcome back. 🍸
                </p>

                <hr style="border: none; border-top: 1px solid #1a1b21; margin: 32px 0;" />
                <p style="font-size: 12px; color: #555; text-align: center;">
                    If you didn't request this deletion or think something went wrong, please contact us at
                    <a href="mailto:info@cocktail-crafter.com" style="color: #00d2ff;">info@cocktail-crafter.com</a>
                </p>
            </div>
        `,
    });
};
