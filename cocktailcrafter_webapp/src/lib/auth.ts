import { prisma } from "@/lib/prisma"
import { NextAuthOptions, DefaultSession } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

// Extend NextAuth types
declare module "next-auth" {
    interface Session {
        user: {
            id: string
            role: string
        } & DefaultSession["user"]
    }

    interface User {
        role: string
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string
        role: string
    }
}

// Hardcoded Super Admins
const SUPER_ADMINS = ["edi@cocktailcrafter.app", "edi@edistechlab.com", "info@edistechlab.com", "Edi"]

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "CocktailCrafter",
            credentials: {
                username: { label: "Username/Email", type: "text", placeholder: "edi@cocktailcrafter.app" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) {
                    return null
                }

                // 1. Custom hardcoded logic for Edi (Super Admin) - Legacy
                if (credentials.username === "Edi" && credentials.password === "CocktailEdi") {
                    let dbUser = await prisma.user.findFirst({
                        where: { name: "Edi" }
                    })

                    if (!dbUser) {
                        dbUser = await prisma.user.create({
                            data: {
                                name: "Edi",
                                email: "edi@cocktailcrafter.app"
                            }
                        })
                    }

                    return {
                        id: dbUser.id,
                        name: dbUser.name,
                        email: dbUser.email,
                        role: "SUPER_ADMIN"
                    }
                }

                // 2. Database User Lookup
                const user = await prisma.user.findFirst({
                    where: {
                        OR: [
                            { email: credentials.username },
                            { name: credentials.username }
                        ]
                    }
                })

                if (user && user.password) {
                    const isPasswordCorrect = await bcrypt.compare(
                        credentials.password,
                        user.password
                    )

                    if (isPasswordCorrect) {
                        return {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            role: SUPER_ADMINS.includes(user.email || "") || SUPER_ADMINS.includes(user.name || "")
                                ? "SUPER_ADMIN"
                                : (user.role || "USER")
                        }
                    }
                }

                // 3. Test user account - Legacy
                if (credentials.username === "user" && credentials.password === "user") {
                    let dbUser = await prisma.user.findFirst({
                        where: { name: "user" }
                    })

                    if (!dbUser) {
                        dbUser = await prisma.user.create({
                            data: {
                                name: "user",
                                email: "user@test.app",
                                role: "USER"
                            }
                        })
                    }

                    return {
                        id: dbUser.id,
                        name: dbUser.name,
                        email: dbUser.email,
                        role: dbUser.role || "USER"
                    }
                }

                return null
            }
        })
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.role = user.role
            }
            return token
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string
                session.user.role = token.role as string
            }
            return session
        }
    },
    pages: {
        signIn: "/login",
    },
    secret: process.env.NEXTAUTH_SECRET,
}
