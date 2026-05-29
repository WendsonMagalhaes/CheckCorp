"use client"

import {
    useEffect,
    useState,
    useTransition,
} from "react"

import {
    useSession,
} from "next-auth/react"

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

import {
    getUsersAction,
} from "@/app/(dashboard)/usuarios/actions"

interface SectorData {
    id: string
    name: string
}

interface UserData {
    id: string
    name: string
    role: string
    sectorId?: string | null
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

    sector?: {
        id: string
        name: string
    } | null

    assignedUser?: {
        id: string
        name: string
    } | null
}

interface Props {
    open: boolean
    onClose: () => void
    checklist: ChecklistData
}

type TargetType =
    | "SECTOR"
    | "USER"

export function EditChecklistModal({
    open,
    onClose,
    checklist,
}: Props) {

    const { data: session } =
        useSession()

    const [
        sectors,
        setSectors,
    ] = useState<SectorData[]>([])

    const [
        users,
        setUsers,
    ] = useState<UserData[]>([])

    const [
        targetType,
        setTargetType,
    ] = useState<TargetType>(
        checklist.sector
            ? "SECTOR"
            : "USER"
    )

    const [
        isPending,
        startTransition,
    ] = useTransition()

    const userRole =
        session?.user?.role

    const supervisedSectorIds =
        session?.user?.supervisedSectorIds || []

    const isEmployee =
        userRole === "EMPLOYEE"

    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,

        formState: {
            errors,
        },
    } = useForm<UpdateChecklistData>({
        resolver:
            zodResolver(
                updateChecklistSchema
            ),

        defaultValues: {
            sectorId: "",
            assignedUserId: "",
        },
    })

    const selectedSectorId =
        watch("sectorId")

    useEffect(() => {

        async function loadData() {

            try {

                const sectorsResponse =
                    await getSectorsAction()

                const usersResponse =
                    await getUsersAction()

                // =====================
                // ADMIN
                // =====================

                if (
                    userRole === "ADMIN"
                ) {

                    setSectors(
                        sectorsResponse
                    )

                    setUsers(
                        usersResponse
                    )

                    return
                }

                // =====================
                // SUPERVISOR
                // =====================

                if (
                    userRole ===
                    "SUPERVISOR"
                ) {

                    const filteredSectors =
                        sectorsResponse.filter(
                            (
                                sector: SectorData
                            ) =>
                                supervisedSectorIds.includes(
                                    sector.id
                                )
                        )

                    const filteredUsers =
                        usersResponse.filter(
                            (
                                user: UserData
                            ) =>
                                user.sectorId &&
                                supervisedSectorIds.includes(
                                    user.sectorId
                                )
                        )

                    setSectors(
                        filteredSectors
                    )

                    setUsers(
                        filteredUsers
                    )

                    return
                }

                // =====================
                // EMPLOYEE
                // =====================

                if (
                    userRole ===
                    "EMPLOYEE"
                ) {

                    const currentUser =
                        usersResponse.filter(
                            (
                                user: UserData
                            ) =>
                                user.id ===
                                session?.user?.id
                        )

                    setUsers(
                        currentUser
                    )

                    setSectors([])
                }

            } catch (error) {

                console.log(error)

                toast.error(
                    "Erro ao carregar dados"
                )
            }
        }

        if (open) {
            loadData()
        }

    }, [
        open,
        userRole,
        supervisedSectorIds,
        session?.user?.id,
    ])

    useEffect(() => {

        const currentType =
            checklist.sector
                ? "SECTOR"
                : "USER"

        setTargetType(
            currentType
        )

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
                checklist.sector?.id || "",

            assignedUserId:
                checklist.assignedUser?.id || "",
        })

    }, [
        checklist,
        reset,
    ])

    async function onSubmit(
        data: UpdateChecklistData
    ) {

        // =====================
        // EMPLOYEE
        // =====================

        if (isEmployee) {

            data.sectorId =
                checklist.sector?.id || undefined

            data.assignedUserId =
                checklist.assignedUser?.id || undefined

        } else {

            // LIMPA O CAMPO
            // NÃO UTILIZADO

            if (
                targetType ===
                "SECTOR"
            ) {

                data.assignedUserId =
                    undefined

            } else {

                data.sectorId =
                    undefined
            }
        }

        startTransition(async () => {

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
                max-w-xl
                bg-card
                border
                border-border
                rounded-3xl
                shadow-2xl
                overflow-hidden
            ">

                {/* HEADER */}

                <div className="
                    px-6
                    py-5
                    border-b
                    border-border
                ">

                    <h2 className="
                        text-2xl
                        font-black
                    ">
                        Editar checklist
                    </h2>

                    <p className="
                        text-sm
                        text-muted-foreground
                        mt-1
                    ">
                        Atualize as informações
                        do checklist
                    </p>

                </div>

                {/* FORM */}

                <form
                    onSubmit={
                        handleSubmit(
                            onSubmit
                        )
                    }
                    className="
                        p-6
                        flex
                        flex-col
                        gap-5
                    "
                >

                    {/* TIPO */}

                    {
                        !isEmployee && (
                            <div className="
                                grid
                                grid-cols-2
                                gap-3
                            ">

                                <button
                                    type="button"
                                    onClick={() => {

                                        setTargetType(
                                            "SECTOR"
                                        )

                                        setValue(
                                            "assignedUserId",
                                            ""
                                        )
                                    }}
                                    className={`
                                        h-14
                                        rounded-2xl
                                        border
                                        text-sm
                                        font-semibold
                                        transition

                                        ${targetType === "SECTOR"
                                            ? "border-primary bg-primary/10"
                                            : "border-border"
                                        }
                                    `}
                                >
                                    Por setor
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {

                                        setTargetType(
                                            "USER"
                                        )

                                        setValue(
                                            "sectorId",
                                            ""
                                        )
                                    }}
                                    className={`
                                        h-14
                                        rounded-2xl
                                        border
                                        text-sm
                                        font-semibold
                                        transition

                                        ${targetType === "USER"
                                            ? "border-primary bg-primary/10"
                                            : "border-border"
                                        }
                                    `}
                                >
                                    Individual
                                </button>

                            </div>
                        )
                    }

                    {/* TITLE */}

                    <div>

                        <input
                            placeholder="Título"
                            {...register(
                                "title"
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

                    {/* DESTINO SETOR */}

                    {
                        !isEmployee &&
                        targetType ===
                        "SECTOR" && (
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
                                        Selecione o setor
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
                        )
                    }

                    {/* DESTINO USER */}

                    {
                        !isEmployee &&
                        targetType ===
                        "USER" && (
                            <div>

                                <select
                                    {...register(
                                        "assignedUserId"
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
                                        Selecione o usuário
                                    </option>

                                    {
                                        users.map(
                                            (
                                                user
                                            ) => (
                                                <option
                                                    key={
                                                        user.id
                                                    }
                                                    value={
                                                        user.id
                                                    }
                                                >
                                                    {
                                                        user.name
                                                    }
                                                </option>
                                            )
                                        )
                                    }

                                </select>

                            </div>
                        )
                    }

                    {/* EMPLOYEE INFO */}

                    {
                        isEmployee && (
                            <div className="
                                rounded-2xl
                                border
                                border-primary/20
                                bg-primary/5
                                p-4
                                text-sm
                            ">
                                Você pode alterar
                                apenas as informações
                                do checklist. O destino
                                não pode ser alterado.
                            </div>
                        )
                    }

                    {/* INFO */}

                    {
                        targetType ===
                        "SECTOR" &&
                        selectedSectorId && (
                            <div className="
                                text-xs
                                text-muted-foreground
                                bg-muted
                                rounded-2xl
                                p-3
                            ">
                                O checklist será
                                compartilhado para
                                todos os usuários
                                do setor.
                            </div>
                        )
                    }

                    {/* ERRO */}

                    {
                        (
                            errors.sectorId ||
                            errors.assignedUserId
                        ) && (
                            <span className="
                                text-sm
                                text-destructive
                            ">
                                {
                                    errors
                                        .sectorId
                                        ?.message ||
                                    errors
                                        .assignedUserId
                                        ?.message
                                }
                            </span>
                        )
                    }

                    {/* ACTIVE */}

                    <label className="
                        flex
                        items-center
                        gap-3
                        text-sm
                        font-medium
                    ">

                        <input
                            type="checkbox"
                            {...register(
                                "active"
                            )}
                            className="
                                w-4
                                h-4
                            "
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
                                isPending
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