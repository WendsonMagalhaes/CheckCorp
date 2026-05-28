"use client"

import { useState } from "react"

import { toast } from "sonner"

import {
    deleteUserAction,
} from "@/app/(dashboard)/usuarios/actions"

interface Props {
    open: boolean
    onClose: () => void
    userId: string
}

export function DeleteUserDialog({
    open,
    onClose,
    userId,
}: Props) {

    const [loading, setLoading] =
        useState(false)

    async function handleDelete() {

        setLoading(true)

        const response =
            await deleteUserAction(
                userId
            )

        if (!response.success) {

            toast.error(
                response.message
            )

            setLoading(false)

            return
        }

        toast.success(
            response.message
        )

        setLoading(false)

        onClose()

        window.location.reload()
    }

    if (!open) {
        return null
    }

    return (
        <div className="
            fixed
            inset-0
            z-50
            bg-black/40
            flex
            items-center
            justify-center
            p-4
        ">
            <div className="
                w-full
                max-w-md
                bg-card
                border
                border-border
                rounded-3xl
                p-6
            ">
                <h2 className="
                    text-2xl
                    font-black
                    mb-2
                ">
                    Excluir usuário
                </h2>

                <p className="
                    text-muted-foreground
                    mb-6
                ">
                    Essa ação não poderá
                    ser desfeita.
                </p>

                <div className="
                    flex
                    justify-end
                    gap-2
                ">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="
                            h-11
                            px-5
                            rounded-2xl
                            border
                            border-border
                        "
                    >
                        Cancelar
                    </button>

                    <button
                        onClick={handleDelete}
                        disabled={loading}
                        className="
                            h-11
                            px-5
                            rounded-2xl
                            bg-destructive
                            text-white
                            font-bold
                            disabled:opacity-50
                        "
                    >
                        {
                            loading
                                ? "Excluindo..."
                                : "Excluir"
                        }
                    </button>
                </div>
            </div>
        </div>
    )
}