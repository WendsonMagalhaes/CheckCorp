import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

import { PrismaAdapter } from "@auth/prisma-adapter"

import bcrypt from "bcryptjs"

import { prisma } from "./prisma"

export const {
    handlers,
    signIn,
    signOut,
    auth,
} = NextAuth({
    adapter: PrismaAdapter(prisma),

    session: {
        strategy: "jwt",
    },

    providers: [
        Credentials({
            credentials: {
                email: {},
                password: {},
            },

            async authorize(credentials) {

                console.log(credentials)

                if (!credentials?.email || !credentials?.password) {
                    return null
                }

                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email as string,
                    },
                })

                console.log(user)

                if (!user) {
                    console.log("Usuário não encontrado")
                    return null
                }

                const passwordMatch = await bcrypt.compare(
                    credentials.password as string,
                    user.password
                )

                console.log(passwordMatch)

                if (!passwordMatch) {
                    console.log("Senha inválida")
                    return null
                }

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                }
            },
        }),
    ],

    callbacks: {

        async jwt({ token, user }) {

            if (user) {
                token.role = user.role
            }

            return token
        },

        async session({ session, token }) {

            if (session.user) {
                session.user.id = token.sub as string
                session.user.role = token.role as string
            }

            return session
        },
    },

    pages: {
        signIn: "/login",
    },

    secret: process.env.AUTH_SECRET,
})