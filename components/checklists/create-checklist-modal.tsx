"use client"

import {
    useEffect,
    useState,
    useTransition,
} from "react"

import { X } from "lucide-react"

import {
    useForm,
} from "react-hook-form"

import {
    zodResolver,
} from "@hookform/resolvers/zod"

import { toast } from "sonner"

import {
    createChecklistSchema,
    CreateChecklistData,
} from "@/validations/checklist-schema"

import {
    createChecklistAction,
} from "@/app/(dashboard)/checklists/actions"

import {
    getSectorsAction,
} from "@/app/(dashboard)/setores/actions"

interface SectorData {
    id: string
    name: string
}

export function CreateChecklistModal() {

    const [
        open,
        setOpen,
    ] = useState(false)

    const [
        sectors,
        setSectors,
    ] = useState<SectorData[]>([])

    const [
        isPending,
        startTransition,
    ] = useTransition()

    const {
        register,
        handleSubmit,
        reset,
        formState: {
            errors,
        },
    } = useForm<CreateChecklistData>({
        resolver:
            zodResolver(
                createChecklistSchema
            ),
    })

    useEffect(() => {

        async function loadSectors() {

            try {

                const response =
                    await getSectorsAction()

                setSectors(response)

            } catch (error) {

                console.log(error)
            }
        }

        if (open) {

            document.body.style.overflow =
                "hidden"

            loadSectors()

        } else {

            document.body.style.overflow =
                "auto"
        }

        return () => {

            document.body.style.overflow =
                "auto"
        }

    }, [open])

    async function onSubmit(
        data: CreateChecklistData
    ) {

        startTransition(async () => {

            const response =
                await createChecklistAction(
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

            reset()

            setOpen(false)
        })
    }

    return (
        <>
            {/* BUTTON */}

            <button
                onClick={() =>
                    setOpen(true)
                }
                className="
                    h-12
                    px-5
                    rounded-2xl
                    bg-primary
                    text-primary-foreground
                    font-bold
                    hover:opacity-90
                    transition
                "
            >
                Novo checklist
            </button>

            {/* MODAL */}

            {
                open && (
                    <div className="
                        fixed
                        inset-0
                        z-50
                        bg-black/60
                        backdrop-blur-sm
                        flex
                        items-end
                        sm:items-center
                        justify-center
                        p-0
                        sm:p-4
                    ">
                        <div className="
                            w-full
                            sm:max-w-xl
                            bg-background
                            rounded-t-[32px]
                            sm:rounded-3xl
                            shadow-2xl
                            border
                            border-border
                            max-h-[95vh]
                            overflow-y-auto
                        ">
                            {/* HEADER */}

                            <div className="
                                sticky
                                top-0
                                bg-background
                                border-b
                                border-border
                                px-5
                                sm:px-8
                                py-5
                                flex
                                items-start
                                justify-between
                                gap-4
                            ">
                                <div>
                                    <h2 className="
                                        text-2xl
                                        font-black
                                    ">
                                        Novo checklist
                                    </h2>

                                    <p className="
                                        text-sm
                                        text-muted-foreground
                                        mt-1
                                    ">
                                        Crie um checklist corporativo
                                    </p>
                                </div>

                                <button
                                    onClick={() =>
                                        setOpen(false)
                                    }
                                    className="
                                        w-10
                                        h-10
                                        rounded-xl
                                        border
                                        border-border
                                        flex
                                        items-center
                                        justify-center
                                        hover:bg-accent
                                        transition
                                    "
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* FORM */}

                            <form
                                onSubmit={
                                    handleSubmit(
                                        onSubmit
                                    )
                                }
                                className="
                                    p-5
                                    sm:p-8
                                    flex
                                    flex-col
                                    gap-4
                                "
                            >
                                {/* TITLE */}

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
                                                    errors
                                                        .title
                                                        .message
                                                }
                                            </span>
                                        )
                                    }
                                </div>

                                {/* DESCRIPTION */}

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

                                {/* FREQUENCY */}

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
                                        <option value="">
                                            Frequência
                                        </option>

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

                                {/* SECTOR */}

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
                                                (
                                                    sector
                                                ) => (
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

                                {/* BUTTON */}

                                <button
                                    disabled={
                                        isPending
                                    }
                                    className="
                                        h-12
                                        rounded-2xl
                                        bg-primary
                                        text-primary-foreground
                                        font-bold
                                        mt-2
                                        hover:opacity-90
                                        transition
                                    "
                                >
                                    {
                                        isPending
                                            ? "Criando..."
                                            : "Criar checklist"
                                    }
                                </button>
                            </form>
                        </div>
                    </div>
                )
            }
        </>
    )
}