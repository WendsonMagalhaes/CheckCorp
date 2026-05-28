"use client"

import { useTransition } from "react"

import { toast } from "sonner"

import {
    deleteSectorAction,
} from "@/app/(dashboard)/setores/actions"

interface Props {
    open: boolean
    onClose: () => void
    sectorId: string
}

export function DeleteSectorDialog({
    open,
    onClose,
    sectorId,
}: Props) {

    const [isPending, startTransition] =
        useTransition()

    function handleDelete() {

        startTransition(async () => {

            const response =
                await deleteSectorAction(
                    sectorId
                )

            if (!response.success) {

                toast.error(
                    response.message
                )

                return
            }

            toast.success(
                response.message
            )

            onClose()

            window.location.reload()
        })
    }

    if (!open) {
        return null
    }

    return (
        <div className="
            fixed
            inset-0
            bg-black/50
            backdrop-blur-sm
            z-50
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
                    text-xl
                    font-black
                ">
                    Excluir setor
                </h2>

                <p className="
                    text-muted-foreground
                    mt-2
                ">
                    Deseja realmente excluir
                    este setor?
                </p>

                <div className="
                    flex
                    justify-end
                    gap-2
                    mt-6
                ">
                    <button
                        onClick={onClose}
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
                        disabled={isPending}
                        className="
                            h-11
                            px-5
                            rounded-2xl
                            bg-destructive
                            text-white
                            font-bold
                        "
                    >
                        {
                            isPending
                                ? "Excluindo..."
                                : "Excluir"
                        }
                    </button>
                </div>
            </div>
        </div>
    )
}