import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendVerificationEmail } from "@/lib/mail";

export async function POST(req: Request) {
    try {
        const { firstName, lastName, email, password } = await req.json();

        if (!firstName || !lastName || !email || !password) {
            return NextResponse.json(
                { message: "All fields are required" },
                { status: 400 }
            );
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { message: "Email already in use" },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                password: hashedPassword,
                name: `${firstName} ${lastName}`.trim(),
            },
        });

        // 1. Generate Verification Token
        const tokenValue = crypto.randomBytes(32).toString('hex');
        const expires = new Date(Date.now() + 3600 * 1000 * 24); // 24 hours from now

        await prisma.verificationToken.create({
            data: {
                identifier: email,
                token: tokenValue,
                expires,
            }
        });

        // 2. Send Verification Email (fire-and-forget — registration succeeds even if email fails)
        sendVerificationEmail(email, tokenValue).catch(err =>
            console.error("Failed to send verification email:", err)
        );

        return NextResponse.json(
            { message: "Registration successful! Please check your email to verify your account." },
            { status: 201 }
        );
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { message: "An error occurred during registration" },
            { status: 500 }
        );
    }
}
