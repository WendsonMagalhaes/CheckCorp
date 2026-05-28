"use client"

import {
    useTransition,
} from "react"

import { toast } from "sonner"

import {
    deleteChecklistAction,
} from "@/app/(dashboard)/checklists/actions"

interface Props {
    open: boolean
    onClose: () => void
    checklistId: string
}

export function DeleteChecklistDialog({
    open,
    onClose,
    checklistId,
}: Props) {

    const [
        isPending,
        startTransition,
    ] = useTransition()

    async function handleDelete() {

        startTransition(async () => {

            const response =
                await deleteChecklistAction(
                    checklistId
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
        })
    }

    if (!open) {
        return null
    }

    return (
        <div className="
            fixed
            inset-0
            z-50
            bg-black/50
            backdrop-blur-sm
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
                shadow-2xl
            ">
                <h2 className="
                    text-2xl
                    font-black
                    mb-3
                ">
                    Excluir checklist
                </h2>

                <p className="
                    text-muted-foreground
                    leading-relaxed
                ">
                    Tem certeza que deseja
                    excluir este checklist?
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
                            disabled:opacity-50
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