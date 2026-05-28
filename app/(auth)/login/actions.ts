"use server"

import { signIn } from "@/lib/auth"
import { AuthError } from "next-auth"

export async function loginAction(formData: FormData) {

    try {

        await signIn("credentials", {
            email: formData.get("email"),
            password: formData.get("password"),
            redirectTo: "/dashboard",
        })

        return {
            success: true,
        }

    } catch (error) {

        if (error instanceof AuthError) {

            switch (error.type) {

                case "CredentialsSignin":

                    return {
                        success: false,
                        message: "E-mail ou senha inválidos",
                    }

                default:

                    return {
                        success: false,
                        message: "Erro ao realizar login",
                    }
            }
        }

        throw error
    }
}