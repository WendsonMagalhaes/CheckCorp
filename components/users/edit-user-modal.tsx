"use client"

import {
    useEffect,
    useState,
} from "react"

import {
    useForm,
} from "react-hook-form"

import { zodResolver } from "@hookform/resolvers/zod"

import { toast } from "sonner"

import {
    updateUserSchema,
    UpdateUserData,
} from "@/validations/user-schema"

import {
    updateUserAction,
} from "@/app/(dashboard)/usuarios/actions"

import {
    getSectorsAction,
} from "@/app/(dashboard)/setores/actions"

interface UserData {
    id: string
    name: string
    email: string
    role: string
    active: boolean

    sector?: {
        id: string
        name: string
    } | null

    supervisedSectors?: {
        id: string
        name: string
    }[]
}

interface Props {
    open: boolean
    onClose: () => void
    user: UserData
}

export function EditUserModal({
    open,
    onClose,
    user,
}: Props) {

    const {
        register,
        handleSubmit,
        reset,
        watch,

        formState: {
            errors,
            isSubmitting,
        },
    } = useForm<UpdateUserData>({
        resolver:
            zodResolver(
                updateUserSchema
            ),
    })

    const [sectors, setSectors] =
        useState<
            {
                id: string
                name: string
            }[]
        >([])

    // ROLE SELECIONADA

    const selectedRole =
        watch("role")

    useEffect(() => {

        async function loadSectors() {

            const response =
                await getSectorsAction()

            setSectors(response)
        }

        loadSectors()

        reset({
            id: user.id,

            name: user.name,

            email: user.email,

            role: user.role as
                | "ADMIN"
                | "SUPERVISOR"
                | "EMPLOYEE",

            active: user.active,

            sectorId:
                user.sector?.id || "",

            supervisedSectorIds:
                user.supervisedSectors?.map(
                    sector => sector.id
                ) || [],
        })

    }, [user, reset])

    async function onSubmit(
        data: UpdateUserData
    ) {

        const response =
            await updateUserAction(data)

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
        <div
            className="
                fixed
                inset-0
                bg-black/40
                z-50
                flex
                items-center
                justify-center
                p-4
            "
        >
            <div
                className="
                    w-full
                    max-w-lg
                    bg-card
                    border
                    border-border
                    rounded-3xl
                    p-6
                    max-h-[90vh]
                    overflow-y-auto
                "
            >
                <h2
                    className="
                        text-2xl
                        font-black
                        mb-6
                    "
                >
                    Editar usuário
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
                    {/* NOME */}
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
                                <span
                                    className="
                                        text-sm
                                        text-destructive
                                    "
                                >
                                    {
                                        errors.name.message
                                    }
                                </span>
                            )
                        }
                    </div>

                    {/* EMAIL */}
                    <div>
                        <input
                            placeholder="E-mail"
                            {...register("email")}
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
                    </div>

                    {/* ROLE */}
                    <div>
                        <select
                            {...register("role")}
                            className="
                                w-full
                                h-12
                                px-4
                                rounded-2xl
                                bg-background
                                border
                                border-border
                            "
                        >
                            <option value="ADMIN">
                                Administrador
                            </option>

                            <option value="SUPERVISOR">
                                Supervisor
                            </option>

                            <option value="EMPLOYEE">
                                Funcionário
                            </option>
                        </select>
                    </div>

                    {/* SETOR PRINCIPAL */}
                    <div>
                        <select
                            {...register("sectorId")}
                            className="
                                w-full
                                h-12
                                px-4
                                rounded-2xl
                                bg-background
                                border
                                border-border
                            "
                        >
                            <option value="">
                                Selecione um setor
                            </option>

                            {
                                sectors.map((sector) => (
                                    <option
                                        key={sector.id}
                                        value={sector.id}
                                    >
                                        {sector.name}
                                    </option>
                                ))
                            }
                        </select>
                    </div>

                    {/* SETORES SUPERVISIONADOS */}
                    {
                        selectedRole === "SUPERVISOR" && (
                            <div>
                                <label
                                    className="
                                        text-sm
                                        font-medium
                                        mb-2
                                        block
                                    "
                                >
                                    Setores supervisionados
                                </label>

                                <div
                                    className="
                                        border
                                        border-border
                                        rounded-2xl
                                        p-4
                                        flex
                                        flex-col
                                        gap-3
                                        max-h-52
                                        overflow-y-auto
                                    "
                                >
                                    {
                                        sectors.map((sector) => (
                                            <label
                                                key={sector.id}
                                                className="
                                                    flex
                                                    items-center
                                                    gap-3
                                                    text-sm
                                                "
                                            >
                                                <input
                                                    type="checkbox"
                                                    value={sector.id}

                                                    {...register(
                                                        "supervisedSectorIds"
                                                    )}
                                                />

                                                {sector.name}
                                            </label>
                                        ))
                                    }
                                </div>
                            </div>
                        )
                    }

                    {/* ACTIVE */}
                    <label
                        className="
                            flex
                            items-center
                            gap-2
                        "
                    >
                        <input
                            type="checkbox"
                            {...register("active")}
                        />

                        Usuário ativo
                    </label>

                    {/* ACTIONS */}
                    <div
                        className="
                            flex
                            justify-end
                            gap-2
                            mt-4
                        "
                    >
                        <button
                            type="button"

                            onClick={onClose}

                            className="
                                h-11
                                px-5
                                rounded-2xl
                                border
                                border-border
                                hover:bg-muted
                                transition
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
                                hover:opacity-90
                                disabled:opacity-50
                                transition
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