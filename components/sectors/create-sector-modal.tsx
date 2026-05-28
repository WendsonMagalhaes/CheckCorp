"use client"

import {
    useForm,
} from "react-hook-form"

import { zodResolver } from "@hookform/resolvers/zod"

import { toast } from "sonner"

import {
    createSectorSchema,
    CreateSectorData,
} from "@/validations/sector-schema"

import {
    createSectorAction,
} from "@/app/(dashboard)/setores/actions"

interface Props {
    open: boolean
    onClose: () => void
}

export function CreateSectorModal({
    open,
    onClose,
}: Props) {

    const {
        register,
        handleSubmit,
        reset,

        formState: {
            errors,
            isSubmitting,
        },

    } = useForm<CreateSectorData>({
        resolver:
            zodResolver(
                createSectorSchema
            ),
    })

    async function onSubmit(
        data: CreateSectorData
    ) {

        const response =
            await createSectorAction(data)

        if (!response.success) {

            toast.error(
                response.message
            )

            return
        }

        toast.success(
            response.message
        )

        reset()

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
                max-w-lg
                bg-card
                border
                border-border
                rounded-3xl
                p-6
            ">
                <h2 className="
                    text-2xl
                    font-black
                    mb-6
                ">
                    Novo setor
                </h2>

                <form
                    onSubmit={
                        handleSubmit(onSubmit)
                    }
                    className="
                        flex
                        flex-col
                        gap-4
                    "
                >
                    <div>
                        <input
                            placeholder="Nome"
                            {...register("name")}
                            className="
                                w-full
                                h-12
                                px-4
                                rounded-2xl
                                bg-background
                                border
                                border-border
                            "
                        />

                        {
                            errors.name && (
                                <span className="
                                    text-sm
                                    text-destructive
                                ">
                                    {
                                        errors.name.message
                                    }
                                </span>
                            )
                        }
                    </div>

                    <textarea
                        placeholder="Descrição"
                        {...register("description")}
                        className="
                            w-full
                            min-h-28
                            px-4
                            py-3
                            rounded-2xl
                            bg-background
                            border
                            border-border
                            resize-none
                        "
                    />

                    <div className="
                        flex
                        justify-end
                        gap-2
                        mt-4
                    ">
                        <button
                            type="button"
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
                            type="submit"
                            disabled={isSubmitting}
                            className="
                                h-11
                                px-5
                                rounded-2xl
                                bg-primary
                                text-white
                                font-bold
                                disabled:opacity-50
                            "
                        >
                            {
                                isSubmitting
                                    ? "Criando..."
                                    : "Criar setor"
                            }
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}