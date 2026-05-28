"use client"

import {
    useEffect,
    useState,
} from "react"

import {
    useForm,
} from "react-hook-form"

import {
    zodResolver,
} from "@hookform/resolvers/zod"

import { toast } from "sonner"

import {
    updateChecklistSchema,
    UpdateChecklistData,
} from "@/validations/checklist-schema"

import {
    updateChecklistAction,
} from "@/app/(dashboard)/checklists/actions"

import {
    getSectorsAction,
} from "@/app/(dashboard)/setores/actions"

interface SectorData {
    id: string
    name: string
}

interface ChecklistData {
    id: string
    title: string
    description?: string | null

    frequency:
    | "DAILY"
    | "WEEKLY"
    | "MONTHLY"

    active: boolean

    sector: {
        id: string
        name: string
    }
}

interface Props {
    open: boolean
    onClose: () => void
    checklist: ChecklistData
}

export function EditChecklistModal({
    open,
    onClose,
    checklist,
}: Props) {

    const [sectors, setSectors] =
        useState<SectorData[]>([])

    const {
        register,
        handleSubmit,
        reset,

        formState: {
            errors,
            isSubmitting,
        },
    } = useForm<UpdateChecklistData>({
        resolver:
            zodResolver(
                updateChecklistSchema
            ),
    })

    useEffect(() => {

        async function loadSectors() {

            const response =
                await getSectorsAction()

            setSectors(response)
        }

        loadSectors()

    }, [])

    useEffect(() => {

        reset({
            id: checklist.id,

            title:
                checklist.title,

            description:
                checklist.description || "",

            frequency:
                checklist.frequency,

            active:
                checklist.active,

            sectorId:
                checklist.sector.id,
        })

    }, [checklist, reset])

    async function onSubmit(
        data: UpdateChecklistData
    ) {

        const response =
            await updateChecklistAction(
                data
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
                max-w-xl
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
                    mb-6
                ">
                    Editar checklist
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
                    {/* TITULO */}
                    <div>
                        <input
                            placeholder="Título"
                            {...register("title")}
                            className="
                                w-full
                                h-12
                                px-4
                                rounded-2xl
                                border
                                border-border
                                bg-background
                            "
                        />

                        {
                            errors.title && (
                                <span className="
                                    text-sm
                                    text-destructive
                                ">
                                    {
                                        errors.title.message
                                    }
                                </span>
                            )
                        }
                    </div>

                    {/* DESCRIÇÃO */}
                    <div>
                        <textarea
                            placeholder="Descrição"
                            {...register(
                                "description"
                            )}
                            className="
                                w-full
                                min-h-[120px]
                                p-4
                                rounded-2xl
                                border
                                border-border
                                bg-background
                                resize-none
                            "
                        />
                    </div>

                    {/* FREQUENCIA */}
                    <div>
                        <select
                            {...register(
                                "frequency"
                            )}
                            className="
                                w-full
                                h-12
                                px-4
                                rounded-2xl
                                border
                                border-border
                                bg-background
                            "
                        >
                            <option value="DAILY">
                                Diário
                            </option>

                            <option value="WEEKLY">
                                Semanal
                            </option>

                            <option value="MONTHLY">
                                Mensal
                            </option>
                        </select>
                    </div>

                    {/* SETOR */}
                    <div>
                        <select
                            {...register(
                                "sectorId"
                            )}
                            className="
                                w-full
                                h-12
                                px-4
                                rounded-2xl
                                border
                                border-border
                                bg-background
                            "
                        >
                            <option value="">
                                Selecione um setor
                            </option>

                            {
                                sectors.map(
                                    (sector) => (
                                        <option
                                            key={
                                                sector.id
                                            }
                                            value={
                                                sector.id
                                            }
                                        >
                                            {
                                                sector.name
                                            }
                                        </option>
                                    )
                                )
                            }
                        </select>
                    </div>

                    {/* ACTIVE */}
                    <label className="
                        flex
                        items-center
                        gap-2
                        text-sm
                        font-medium
                    ">
                        <input
                            type="checkbox"
                            {...register(
                                "active"
                            )}
                        />

                        Checklist ativo
                    </label>

                    {/* ACTIONS */}
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
                            disabled={
                                isSubmitting
                            }
                            className="
                                h-11
                                px-5
                                rounded-2xl
                                bg-primary
                                text-primary-foreground
                                font-bold
                                disabled:opacity-50
                            "
                        >
                            {
                                isSubmitting
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