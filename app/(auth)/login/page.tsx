"use client"

import { useTransition } from "react"

import { toast } from "sonner"

import { loginAction } from "./actions"

export default function LoginPage() {

    const [isPending, startTransition] = useTransition()

    async function handleLogin(
        formData: FormData
    ) {

        startTransition(async () => {

            const response = await loginAction(formData)

            if (!response?.success) {

                toast.error(
                    response?.message
                )

                return
            }

            toast.success(
                "Login realizado com sucesso"
            )
        })
    }

    return (
        <div className="
            min-h-screen
            flex
            items-center
            justify-center
            bg-background
            px-4
        ">
            <div className="
                w-full
                max-w-md
                bg-card
                rounded-3xl
                shadow-2xl
                border
                border-border
                p-8
            ">
                <div className="mb-8">
                    <h1 className="
                        text-4xl
                        font-black
                        text-center
                        text-primary
                    ">
                        CheckFlow
                    </h1>

                    <p className="
                        text-center
                        text-muted-foreground
                        mt-2
                    ">
                        Gestão inteligente de checklists
                    </p>
                </div>

                <form
                    action={handleLogin}
                    className="
                        flex
                        flex-col
                        gap-4
                    "
                >
                    <input
                        type="email"
                        name="email"
                        placeholder="E-mail"
                        className="
                            h-12
                            px-4
                            bg-background
                            border
                            border-border
                            rounded-xl
                            outline-none
                            focus:ring-2
                            focus:ring-primary
                            transition
                        "
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Senha"
                        className="
                            h-12
                            px-4
                            bg-background
                            border
                            border-border
                            rounded-xl
                            outline-none
                            focus:ring-2
                            focus:ring-primary
                            transition
                        "
                    />

                    <button
                        type="submit"
                        disabled={isPending}
                        className="
                            h-12
                            bg-primary
                            hover:opacity-90
                            disabled:opacity-50
                            disabled:cursor-not-allowed
                            transition
                            text-primary-foreground
                            rounded-xl
                            font-bold
                            shadow-lg
                        "
                    >
                        {
                            isPending
                                ? "Entrando..."
                                : "Entrar"
                        }
                    </button>
                </form>
            </div>
        </div>
    )
}