"use client"

import { useEffect, useTransition } from "react"

import {
    useForm,
} from "react-hook-form"

import {
    zodResolver,
} from "@hookform/resolvers/zod"

import { toast } from "sonner"

import {
    updateSectorSchema,
    UpdateSectorData,
} from "@/validations/sector-schema"

import {
    updateSectorAction,
} from "@/app/(dashboard)/setores/actions"

interface SectorData {
    id: string
    name: string
    description?: string | null
    active: boolean
}

interface Props {
    open: boolean
    onClose: () => void
    sector: SectorData
}

export function EditSectorModal({
    open,
    onClose,
    sector,
}: Props) {

    const [isPending, startTransition] =
        useTransition()

    const {
        register,
        handleSubmit,
        reset,
        formState: {
            errors,
        },
    } = useForm<UpdateSectorData>({
        resolver:
            zodResolver(
                updateSectorSchema
            ),
    })

    useEffect(() => {

        reset({
            id: sector.id,
            name: sector.name,
            description:
                sector.description || "",

            active: sector.active,
        })

    }, [sector, reset])

    function onSubmit(
        data: UpdateSectorData
    ) {

        startTransition(async () => {

            const response =
                await updateSectorAction(data)

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
                    Editar setor
                </h2>

                <form
                    onSubmit={
                        handleSubmit(
                            onSubmit
                        )
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
                            min-h-[120px]
                            p-4
                            rounded-2xl
                            bg-background
                            border
                            border-border
                            resize-none
                        "
                    />

                    <label className="
                        flex
                        items-center
                        gap-2
                        text-sm
                        font-medium
                    ">
                        <input
                            type="checkbox"
                            {...register("active")}
                        />

                        Setor ativo
                    </label>

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
                            disabled={isPending}
                            className="
                                h-11
                                px-5
                                rounded-2xl
                                bg-primary
                                text-white
                                font-bold
                            "
                        >
                            {
                                isPending
                                    ? "Salvando..."
                                    : "Salvar"
                            }
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}